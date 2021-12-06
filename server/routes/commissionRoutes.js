import express from 'express'
import commission from '../controllers/commissionController'

const Router = express.Router();

Router.get('/', commission.index);

Router.get('/statistics', commission.statistics);

Router.get('/:id', commission.show);

Router.put('/:id', commission.update);

export default Router;