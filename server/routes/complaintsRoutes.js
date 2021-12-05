import express from 'express'
import complaints from '../controllers/complaintsController'


const Router = express.Router();

Router.get('/', complaints.index);

Router.post('/', complaints.store);

Router.get('/count', complaints.count);

Router.get('/:id', complaints.show);

Router.delete('/:id', complaints.destroy);

Router.put('/:id', complaints.update);

Router.post('/file', complaints.file);

/// Commission

export default Router;