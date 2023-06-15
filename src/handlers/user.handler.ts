import { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import { userBodySchema, userQuerySchema } from '../validators/user';
import { HandlerBase } from './handlerBase';

export default class UserHandler extends HandlerBase<User, UserStore> {
  constructor() {
    super(UserStore, userBodySchema, userQuerySchema);
  }

  async jwtCreate(req: Request, res: Response) {
    try {
      const result = await this.store.jwtCreate(req.body.email, req.body.password);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async jwtRefresh(req: Request, res: Response) {
    try {
      const result = await this.store.jwtRefresh(req.body.refreshToken);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async jwtVerify(req: Request, res: Response) {
    try {
      const result = await this.store.jwtVerify(req.body.token);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async activation(req: Request, res: Response) {
    try {
      const result = await this.store.activate(req.body.token as string);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async resendActivation(req: Request, res: Response) {
    try {
      const result = await this.store.resendActivation(req.body.email as string);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const result = await this.store.changePassword(
        req.params.id,
        req.body.token,
        req.body.currentPassword,
        req.body.newPassword
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const result = await this.store.resetPassword(req.body.email as string);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetPasswordConfirmation(req: Request, res: Response) {
    try {
      const result = await this.store.resetPasswordConfirmation(req.body.token, req.body.newPassword);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
