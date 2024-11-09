import { ActionData } from './action_data';

export type Params = {
  [key: string]: string;
};

export type InputParams = Params;

export type OutputParams = Params;

export type OutputResult = {
  params: OutputParams;
  required_params?: (string | undefined | null)[];
};

export interface ServiceReaction {
  name: string;
  description: string;
  required_fields: string[];
  handleReaction: (data: ActionData, output_params: OutputParams, provided: any) => Promise<void>;
}

export interface ServiceReactions {
  [name: string]: ServiceReaction;
}
