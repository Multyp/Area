import { Router } from 'express';
import login from './login';
import register from './register';

const routes: Router = Router();

routes.use(login);
routes.use(register);

export default routes;
