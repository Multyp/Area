// Global imports
import { Request } from 'express';

// Scoped imports
import { InputParams, OutputResult } from './service_reaction';
import { ActionData } from './action_data';

interface AppletAction {
  serviceName: string;
  name: string;
}

interface AppletReaction {
  serviceName: string;
  name: string;
  getOutputParams: (data: ActionData, inputParams: InputParams, request: Request) => Promise<OutputResult>;
}

type AppletField = {
  name: string;
  title: string;
};

export interface Applet {
  name: string;
  title: string;
  fields: AppletField[];
  description: string;
  action: AppletAction;
  reaction: AppletReaction;
  is_custom?: boolean;
  is_enabled?: boolean;
}

export interface Applets {
  [name: string]: Applet;
}
