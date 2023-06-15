import express from 'express';
import UserHandler from '../../handlers/user.handler';

const userRoutes = express.Router();
const userHandler = new UserHandler();

// userRoutes.get('', (req, res) => userHandler.list(req, res));

userRoutes.post('', (req, res) => userHandler.create(req, res));

userRoutes.post('/login', (req, res) => userHandler.jwtCreate(req, res));

userRoutes.post('/refresh', (req, res) => userHandler.jwtRefresh(req, res));

userRoutes.post('/verify', (req, res) => userHandler.jwtVerify(req, res));

userRoutes.post('/activation', (req, res) => userHandler.activation(req, res));

userRoutes.post('/activation/resend', (req, res) => userHandler.resendActivation(req, res));

userRoutes.post('/reset_password', (req, res) => userHandler.resetPassword(req, res));

userRoutes.post('/reset_password_confirmation', (req, res) => userHandler.resetPasswordConfirmation(req, res));

// userRoutes.get('/:id', (req, res) => userHandler.retrive(req, res));

userRoutes.post('/:id/change_password', (req, res) => userHandler.changePassword(req, res));

// userRoutes.put('/:id', (req, res) => userHandler.update(req, res));

// userRoutes.patch('/:id', (req, res) => userHandler.partialUpdate(req, res));

// userRoutes.delete('/:id', (req, res) => userHandler.delete(req, res));

export default userRoutes;
