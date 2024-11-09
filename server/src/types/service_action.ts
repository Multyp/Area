import { Request, Response } from 'express';
import { ActionResult } from './action_data';

export interface ServiceAction {
  name: string;
  description: string;
  onSubscribe: (provided_id: string, oauth_token: string) => Promise<boolean>;
  onWebhook: (request: Request, response: Response) => Promise<ActionResult | undefined>;
}

export interface ServiceActions {
  [name: string]: ServiceAction;
}
