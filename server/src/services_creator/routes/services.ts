// Global imports
import { Router, Request, Response } from 'express';

// Scoped imports
import { createAllServices } from '../creator';

const routes: Router = Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Retrieve all available services
 *     description: Returns a list of all services with their basic information
 *     responses:
 *       200:
 *         description: List of services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/service/{service}:
 *   get:
 *     summary: Retrieve detailed information about a specific service
 *     parameters:
 *       - in: path
 *         name: service
 *         required: true
 *         schema:
 *           type: string
 *         description: Service identifier
 *     responses:
 *       200:
 *         description: Service details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 actions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                 reactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/services/{service_name}/{type}:
 *   get:
 *     summary: Retrieve actions or reactions for a specific service
 *     parameters:
 *       - in: path
 *         name: service_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Service identifier
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [actions, reactions]
 *         description: Type of items to retrieve
 *     responses:
 *       200:
 *         description: List of actions or reactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 actions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceItem'
 *                 reactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceItem'
 *       400:
 *         description: Invalid type parameter
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
routes.get('/api/services/:service_name/:type', async (request: Request, response: Response) => {
  const { service_name, type } = request.params;

  const services = await createAllServices();
  if (!services) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  if (!services[service_name]) {
    return response.status(404).json({ message: 'Service not found' });
  }

  if (type !== 'actions' && type !== 'reactions') {
    return response.status(400).json({ message: 'Invalid type. Must be "actions" or "reactions"' });
  }

  const service = services[service_name];
  const items = Object.values(service[type]).map((item) => ({
    name: item.name,
    description: item.description,
    required_fields: 'required_fields' in item ? item.required_fields : {},
  }));

  return response.status(200).json({ [type]: items });
});

/**
 * @swagger
 * /api/services/{service_name}/{type}/{name}/params:
 *   get:
 *     summary: Retrieve parameters for a specific action or reaction
 *     parameters:
 *       - in: path
 *         name: service_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Service identifier
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [actions, reactions]
 *         description: Type of item
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the action or reaction
 *     responses:
 *       200:
 *         description: Parameters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 required_fields:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                 params:
 *                   type: object
 *       400:
 *         description: Invalid type parameter
 *       404:
 *         description: Service or item not found
 *       500:
 *         description: Internal server error
 */
routes.get('/api/services/:service_name/:type/:name/params', async (request: Request, response: Response) => {
  const { service_name, type, name } = request.params;

  const services = await createAllServices();
  if (!services) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  if (!services[service_name]) {
    return response.status(404).json({ message: 'Service not found' });
  }

  if (type !== 'actions' && type !== 'reactions') {
    return response.status(400).json({ message: 'Invalid type. Must be "actions" or "reactions"' });
  }

  const service = services[service_name];
  const item = service[type][name];
  if (!item) {
    return response.status(404).json({ message: `${type === 'actions' ? 'Action' : 'Reaction'} not found` });
  }

  if (type === 'reactions' && 'required_fields' in item) {
    return response.status(200).json({
      required_fields: item.required_fields,
    });
  }

  return response.status(200).json({
    params: {},
  });
});

/**
 * @swagger
 * /api/services/{service_name}:
 *   post:
 *     summary: Create a new service instance
 *     parameters:
 *       - in: path
 *         name: service_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Service identifier
 *     responses:
 *       500:
 *         description: Internal server error
 */
routes.post('/api/services/:service_name', async (request: Request, response: Response) => {
  const { service_name } = request.params;

  const services = await createAllServices();
  if (!services) {
    return response.status(500).json({ message: 'Internal server error' });
  }

  const service = services[service_name];
});

export default routes;
