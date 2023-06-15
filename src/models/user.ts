import { InsertOneResult, Document, OptionalId, ObjectId } from 'mongodb';
import { ModelStoreBase } from './modelBase';
import { hash, compare } from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/environment';
import { resetPasswordConfirmationMessage, resetPasswordMessage, sendEmail, signupMessage } from '../services/emails';

export interface User {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  slug: string;
  isActive: boolean;
  isStaff: boolean;
  isAdmin: boolean;
}

export class UserStore extends ModelStoreBase<User> {
  constructor() {
    super('users', 'slug');
  }

  override async create(object: User): Promise<{ message: string }> {
    try {
      const slug = object.firstName + '-' + object.lastName + '-' + new Date().getTime();

      const hashPassword = await hash(object.password + env.BCRYPT_SECRET, 12);

      const result = await this.document.insertOne({
        ...object,
        password: hashPassword,
        slug,
        isActive: false,
        isStaff: false,
        isAdmin: false,
      });

      const emailConfirmToken = jwt.sign({ id: result.insertedId }, env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      const message = signupMessage(env.CLIENT_URL + 'auth/activation', emailConfirmToken);

      sendEmail(object.email, 'Example.com Account Activation', message).catch(console.error);

      return { message: `${object.email} account created successfully, and waiting for email confirmation!` };
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async jwtCreate(email: string, password: string) {
    try {
      const user = await this.document.findOne({ email });

      if (!user) throw new Error('Error: email not found');
      if (!(await compare(password + env.BCRYPT_SECRET, user.password))) throw new Error('Error: password is invalid');
      if (!user.isActive) throw new Error('Error: user is not activated');

      const accessToken = jwt.sign(
        { id: user._id, email: user.email, name: user.firstName + ' ' + user.lastName },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      const refreshToken = jwt.sign({ id: user._id }, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async jwtRefresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as JwtPayload;

      const user = await this.document.findOne({ _id: new ObjectId(payload.id) });

      if (!user) throw new Error(`Error: user not found`);

      const accessToken = jwt.sign(
        { id: user._id, email: user.email, name: user.firstName + ' ' + user.lastName },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      return { accessToken };
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async jwtVerify(token: string) {
    try {
      const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;

      return payload;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async activate(token: string) {
    try {
      const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;

      const user = await this.document.findOneAndUpdate(
        { _id: new ObjectId(payload.id) },
        { $set: { isActive: true } }
      );

      if (!user.value) throw new Error(`Error: account not fount`);
      if (!user.ok) throw new Error(`Error: account activation failed`);

      return { message: 'account activated successfully.' };
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async resendActivation(email: string) {
    try {
      const user = await this.document.findOne({ email });
      if (!user) throw new Error(`Error: email not found!`);
      if (user.isActive) throw new Error(`Error: account already activated!`);

      const emailConfirmToken = jwt.sign({ id: user._id }, env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      const message = signupMessage(env.CLIENT_URL + 'auth/activation', emailConfirmToken);

      sendEmail(email, 'Account Activation', message);

      return { message: 'account activation email sent to ' + email };
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async changePassword(userId: string, token: string, currentPassword: string, newPassword: string) {
    try {
      const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
      if (payload.id !== userId) throw new Error('Error: permission denied');

      const user = await this.document.findOne({ _id: new ObjectId(payload.id) });

      if (!user) throw new Error('Error: account not found');
      if (!(await compare(currentPassword, user.password))) throw new Error('Error: current password not valid');

      const newPasswordHash = await hash(newPassword + env.BCRYPT_SECRET, 12);

      const newUser = await this.document.findOneAndUpdate(
        { _id: new ObjectId(payload.id) },
        { $set: { password: newPasswordHash } }
      );

      if (!newUser.ok) throw new Error('Error: change password failed');

      sendEmail(user.email, 'Password Changed', resetPasswordConfirmationMessage());

      return { message: 'password changed successfully!' };
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async resetPassword(email: string) {
    try {
      const user = await this.document.findOne({ email });
      if (!user) throw new Error(`Error: email not found!`);
      if (!user.isActive) throw new Error(`Error: account is not activated!`);

      const emailConfirmToken = jwt.sign({ id: user._id }, env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      const message = resetPasswordMessage(env.CLIENT_URL + 'auth/reset_password', emailConfirmToken);

      sendEmail(email, 'Resset Password', message);

      return { message: 'reset password email sent to ' + email };
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  async resetPasswordConfirmation(token: string, newPassword: string) {
    try {
      const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;

      const newPasswordHash = await hash(newPassword + env.BCRYPT_SECRET, 12);

      const user = await this.document.findOneAndUpdate(
        { _id: new ObjectId(payload.id) },
        { $set: { password: newPasswordHash } }
      );

      if (!user.value) throw new Error(`Error: account not found!`);

      if (!user.ok) throw new Error(`Error: reset password failed!`);

      const message = resetPasswordConfirmationMessage();

      sendEmail(user.value.email, 'Password Changed', message);

      return { message: 'password changed successfully' };
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}
