import { readdir } from 'fs/promises';
import { join } from 'path';
import { Services } from '../types/service';
import { ServiceAction } from '../types/service_action';
import { Applets } from '../types/applet';
import { InputParams, OutputResult, ServiceReaction } from '../types/service_reaction';
import { pool } from '../utils/db';
import { formatName } from '../utils/format_name';
import { ActionData } from '../types/action_data';

const serviceDir: string = join(__dirname, './services');

const services: Services = {};
async function createAllServices() {
  try {
    const serviceFolders = await readdir(serviceDir, { withFileTypes: true });

    const promises: Promise<void>[] = serviceFolders.map(async (folder) => {
      if (folder.isDirectory()) {
        const oauthPath = join(serviceDir, folder.name, 'oauth');
        const actionsPath = join(serviceDir, folder.name, 'actions');
        const reactionsPath = join(serviceDir, folder.name, 'reactions');

        try {
          let oauthModule;
          let actionsModule;
          let reactionsModule;

          try {
            oauthModule = await import(oauthPath);
            actionsModule = await import(actionsPath);
            reactionsModule = await import(reactionsPath);
          } catch (error) {
            console.log(error);
            throw new Error('A service module was not found.');
          }

          services[folder.name] = {
            name: folder.name,
            description: oauthModule.serviceOAuth.description,
            oauth: oauthModule.serviceOAuth,
            actions: Object.fromEntries(actionsModule.serviceActions.map((action: ServiceAction) => [action.name, action])),
            reactions: Object.fromEntries(reactionsModule.serviceReactions.map((reaction: ServiceReaction) => [reaction.name, reaction])),
          };
        } catch (error) {
          console.error(`Error importing ${folder.name}/oauth.ts:`, error);
        }
      }
    });

    await Promise.all(promises);
    return services;
  } catch (error) {
    console.error('Error reading service directories:', error);
  }
}

const appletDir: string = join(__dirname, './applets');

const applets: Applets = {};
async function createAllApplets(userId?: number) {
  try {
    const appletFolders = await readdir(appletDir, { withFileTypes: true });

    const promises: Promise<void>[] = appletFolders.map(async (folder) => {
      if (!folder.isDirectory()) {
        const appletPath = join(appletDir, folder.name);
        let appletModule;

        try {
          appletModule = await import(appletPath);
        } catch {
          throw new Error('An applet module was not found.');
        }

        applets[appletModule.applet.name] = {
          ...appletModule.applet,
          is_custom: false,
        };
      }
    });

    await Promise.all(promises);

    if (!userId) {
      return applets;
    }

    const customApplets = await pool.query('SELECT * FROM custom_applets WHERE user_id = $1', [userId]);

    customApplets.rows.forEach((customApplet) => {
      applets[customApplet.name] = {
        name: customApplet.name,
        title: 'This is your custom applet',
        description: 'This is your custom applet',
        fields: Object.entries(customApplet.reaction_params).map(([key]) => ({
          name: key,
          title: key,
        })),
        action: {
          serviceName: customApplet.action_service_name,
          name: customApplet.action_name,
        },
        reaction: {
          serviceName: customApplet.reaction_service_name,
          name: customApplet.reaction_name,
          getOutputParams: async ({ input }: ActionData, input_params: InputParams): Promise<OutputResult> => {
            if (customApplet.reaction_params.message) {
              for (let input_param_name in input) {
                let input_param = input[input_param_name];

                customApplet.reaction_params.message = customApplet.reaction_params.message.replace(
                  new RegExp(`{{${input_param_name}}}`, 'g'),
                  input_param
                );
              }
            }

            return {
              params: customApplet.reaction_params,
            };
          },
        },
        is_custom: true,
      };
    });

    console.log(applets);

    return applets;
  } catch (error) {
    console.error('Error reading applet directories:', error);
  }
}

export { createAllServices, createAllApplets };
