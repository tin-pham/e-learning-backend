import * as Joi from 'joi';

export const configSchema = {
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
  API_KEY: Joi.string().required(),
  ELASTICSEARCH_NODE: Joi.string().required(),
  ELASTICSEARCH_USERNAME: Joi.string().required(),
  ELASTICSEARCH_PASSWORD: Joi.string().required(),
};
