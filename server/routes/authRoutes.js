import express from 'express'
import { Index, Login } from '../controllers/authController'

const Router = express.Router();

Router.post('/', Index);

Router.post('/login', Login);

// Router.get('/user', user);

export default Router;