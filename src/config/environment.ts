import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) throw new Error('Please enter a valid port!');
if (!process.env.MONGODB_URI) throw new Error('Please enter a valid MONGODB_URI!');
if (!process.env.BCRYPT_SECRET) throw new Error('Please enter a valid BCRYPT_SECRET!');
if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('Please enter a valid ACCESS_TOKEN_SECRET!');
if (!process.env.REFRESH_TOKEN_SECRET) throw new Error('Please enter a valid REFRESH_TOKEN_SECRET!');
if (!process.env.NODEMAILER_EMAIL) throw new Error('Please enter a valid NODEMAILER_EMAIL!');
if (!process.env.NODEMAILER_PASSWORD) throw new Error('Please enter a valid NODEMAILER_PASSWORD!');
if (!process.env.CLIENT_URL) throw new Error('Please enter a valid CLIENT_URL!');
if (!process.env.SERVER_URL) throw new Error('Please enter a valid SERVER_URL!');

export const env = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  BCRYPT_SECRET: process.env.BCRYPT_SECRET,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  CLIENT_URL: process.env.CLIENT_URL,
  CLIENT_NAME: process.env.CLIENT_NAME as string,
  SERVER_URL: process.env.SERVER_URL,
};
