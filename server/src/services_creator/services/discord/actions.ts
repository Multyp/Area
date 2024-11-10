import axios from 'axios';
import { ServiceAction } from '../../../types/service_action';
import { Request, Response } from 'express';
import { pool } from '../../../utils/db';
import { InputParams, OutputParams } from '../../../types/service_reaction';

export const serviceActions: ServiceAction[] = [];
