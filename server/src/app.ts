import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './auth';
import cookieParser from 'cookie-parser';
import servicesRoutes from './services_creator/routes';
import { createAllServices } from './services_creator/creator';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

config();

const app: Express = express();
const port: number = 8081;

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./src/services_creator/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.WEB_BASE_URL as string, process.env.API_BASE_URL as string],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    credentials: true,
  })
);

app.use('/api', authRoutes);
app.use(servicesRoutes);

app.get('/api/status', async (req: Request, res: Response) => {
  res.json({ status: 'up', version: '1.0.1d' });
});

const aboutJson = async (req: Request, res: Response) => {
  const services = await createAllServices();
  if (!services) {
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }

  const servicesArray = Object.values(services).map((service) => ({
    name: service.name,
    actions: Object.entries(service.actions).map(([name, action]) => ({
      name,
      description: action.description,
    })),
    reactions: Object.entries(service.reactions).map(([name, reaction]) => ({
      name,
      description: reaction.description,
    })),
  }));

  res.json({
    client: {
      host: req.headers['cf-connecting-ip'] || req.socket.remoteAddress,
    },
    server: {
      current_time: new Date().getTime(),
      services: servicesArray,
    },
  });
};

app.get('/api/about.json', aboutJson);
app.get('/about.json', aboutJson);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at :${port}`);
});
