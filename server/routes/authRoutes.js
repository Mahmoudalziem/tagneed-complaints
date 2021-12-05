import express from 'express'
import { index, user, Login } from '../controllers/authController'

const Router = express.Router();

Router.post('/', index);

Router.post('/login', Login);

Router.get('/user', user);

export default Router;