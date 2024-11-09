// Global imports
import { Router, Request, Response } from 'express';

// Scoped imports
import { createAllServices, createAllApplets } from '../creator';
import { verifyToken } from '../../utils/verify_token';

const routes: Router = Router();

routes.get('/api/explore', async (request: Request, response: Response) => {
  const services = await createAllServices();
  const { token } = request.query;
  let userId: number | undefined;

  if (token) {
    userId = await verifyToken(token as string);
  }

  const applets = await createAllApplets(userId);

  if (!services || !applets) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  const servicesArray = Object.values(services).map((service) => ({
    name: service.name,
    description: service.description,
    actions: Object.values(service.actions).map((action) => ({
      name: action.name,
      description: action.description,
    })),
    reactions: Object.values(service.reactions).map((reaction) => ({
      name: reaction.name,
      description: reaction.description,
      required_fields: reaction.required_fields,
    })),
    type: 'service',
  }));

  const appletsArray = Object.values(applets).map((applet) => ({
    name: applet.name,
    action: applet.action,
    reaction: applet.reaction,
    type: 'applet',
  }));

  const data = [...servicesArray, ...appletsArray].sort((a: any, b: any) => a.name.localeCompare(b.name));

  return response.status(200).json({
    data,
  });
});

export default routes;
