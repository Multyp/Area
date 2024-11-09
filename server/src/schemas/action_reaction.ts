import Joi from 'joi';

const actionReactionSchema = Joi.object({
  token: Joi.string().required(),
  name: Joi.string().required(),
  action: {
    service_name: Joi.string().required(),
    name: Joi.string().required(),
  },
  reaction: {
    service_name: Joi.string().required(),
    name: Joi.string().required(),
    fields: Joi.object(),
  },
});

export default actionReactionSchema;
