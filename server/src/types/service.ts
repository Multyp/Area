import { ServiceOAuth } from './service_oauth';
import { ServiceActions } from './service_action';
import { ServiceReactions } from './service_reaction';

export interface Service {
  name: string;
  description: string;
  oauth: ServiceOAuth;
  actions: ServiceActions;
  reactions: ServiceReactions;
}

export interface Services {
  [name: string]: Service;
}
