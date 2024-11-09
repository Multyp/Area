// Global imports
import { Router, Request, Response } from 'express';

// Scoped imports
import { getUserConnections } from '../../utils/get_user_connections';
import { verifyToken } from '../../utils/verify_token';
import { createAllApplets } from '../creator';
import { Applet, Applets } from '@/types/applet';

const routes: Router = Router();

routes.post('/api/connections', async (request: Request, response: Response) => {
  const userId: number | undefined = await verifyToken(request.body.token as string);

  if (!userId) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  return response.status(200).json({
    result: {
      connections: await getUserConnections(userId),
    },
  });
});

routes.post('/api/connections/:appletName', async (request: Request, response: Response) => {
  const applets: Applets | undefined = await createAllApplets();
  const userId: number | undefined = await verifyToken(request.body.token as string);

  if (!userId) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  const connections = await getUserConnections(userId);
  const { appletName } = request.params;

  if (!applets || !applets.hasOwnProperty(appletName)) {
    return response.status(404).json({ message: 'Applet not found' });
  }

  const applet: Applet = applets[appletName];
  const missingConnections: string[] = [];

  if (!connections.some((connection) => applet.action.serviceName === connection.serviceName)) {
    missingConnections.push(applet.action.serviceName);
  }

  if (!connections.some((connection) => applet.reaction.serviceName === connection.serviceName)) {
    missingConnections.push(applet.reaction.serviceName);
  }

  return response.status(200).json({
    success: true,
    missingConnections,
  });
});

routes.post('/api/connections/:customAppletName', async (request: Request, response: Response) => {
  const { token, customAppletName } = request.body;
  const userId: number | undefined = await verifyToken(token);

  if (!userId) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  const applets: Applets | undefined = await createAllApplets(userId);
  const connections = await getUserConnections(userId);

  if (!applets || !applets.hasOwnProperty(customAppletName)) {
    return response.status(404).json({ message: 'Applet not found' });
  }

  const applet: Applet = applets[customAppletName];
  const missingConnections: string[] = [];

  if (!connections.some((connection) => applet.action.serviceName === connection.serviceName)) {
    missingConnections.push(applet.action.serviceName);
  }

  return response.status(200).json({
    success: true,
    missingConnections,
  });
});

export default routes;
