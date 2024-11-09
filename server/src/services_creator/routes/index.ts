// Global imports
import { Router } from 'express';

// Local imports
import oauth from './oauth';
import explore from './explore';
import connections from './connections';
import services from './services';
import applets from './applets';
import webhook from './webhook';

const routes: Router = Router();

routes.use(oauth);
routes.use(explore);
routes.use(connections);
routes.use(services);
routes.use(applets);
routes.use(webhook);

export default routes;
