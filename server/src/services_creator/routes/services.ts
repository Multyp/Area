// Global imports
import { Router, Request, Response } from 'express';

// Scoped imports
import { createAllServices } from '../creator';

const routes: Router = Router();

routes.get('/api/services', async (request: Request, response: Response) => {
  const services = await createAllServices();
  if (!services) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  const servicesArray = Object.values(services).map((service) => ({
    name: service.name,
    description: service.description,
  }));
  return response.status(200).json({ services: servicesArray });
});

routes.get('/api/service/:service', async (request: Request, response: Response) => {
  const services = await createAllServices();
  if (!services) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  if (!services[request.params.service]) {
    return response.status(404).json({ message: 'Service not found' });
  }

  const service = services[request.params.service];

  return response.status(200).json({
    name: service.name,
    description: service.description,
    actions: Object.values(service.actions).map((action) => ({
      name: action.name,
      description: action.description,
    })),
    reactions: Object.values(service.reactions).map((reaction) => ({
      name: reaction.name,
      description: reaction.description,
    })),
  });
});

routes.get('/api/services/:service_name/:type', async (request: Request, response: Response) => {
  const { service_name, type } = request.params;

  const services = await createAllServices();
  if (!services) {
    return response.status(500).json({ message: 'Erreur interne du serveur' });
  }

  if (!services[service_name]) {
    return response.status(404).json({ message: 'Service non trouvé' });
  }

  if (type !== 'actions' && type !== 'reactions') {
    return response.status(400).json({ message: 'Type invalide. Doit être "actions" ou "reactions"' });
  }

  const service = services[service_name];
  const items = Object.values(service[type]).map((item) => ({
    name: item.name,
    description: item.description,
    required_fields: 'required_fields' in item ? item.required_fields : {},
  }));

  return response.status(200).json({ [type]: items });
});

routes.get('/api/services/:service_name/:type/:name/params', async (request: Request, response: Response) => {
  const { service_name, type, name } = request.params;

  const services = await createAllServices();

  if (!services) {
    return response.status(500).json({ message: 'Erreur interne du serveur' });
  }

  if (!services[service_name]) {
    return response.status(404).json({ message: 'Service non trouvé' });
  }

  const service = services[service_name];

  if (type !== 'actions' && type !== 'reactions') {
    return response.status(400).json({ message: 'Type invalide. Doit être "actions" ou "reactions"' });
  }

  const item = service[type][name];

  if (!item) {
    return response.status(404).json({ message: `${type === 'actions' ? 'Action' : 'Reaction'} non trouvée` });
  }

  // Pour les réactions, on retourne les required_fields s'ils existent
  if (type === 'reactions' && 'required_fields' in item) {
    return response.status(200).json({
      required_fields: item.required_fields,
    });
  }

  // Pour les actions, on pourrait retourner d'autres paramètres spécifiques si nécessaire
  return response.status(200).json({
    params: {}, // À adapter selon vos besoins pour les actions
  });
});

routes.post('/api/services/:service_name', async (request: Request, response: Response) => {
  const { service_name } = request.params;

  const services = await createAllServices();
  if (!services) {
    return response.status(500).json({ message: 'Erreur interne du serveur' });
  }

  const service = services[service_name];
});

export default routes;
