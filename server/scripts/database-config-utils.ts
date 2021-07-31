import * as Joi from 'joi';
import { DriverUtils } from 'typeorm/driver/DriverUtils';

function buildDatabaseConfig(): any {
  /* use the database connection URL if available ( Heroku postgres addon uses connection URL ) */
  if (!process.env.DATABASE_URL) {
    return {
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_PASS: process.env.PG_PASS,
      PG_USER: process.env.PG_USER,
      PG_DB: process.env.PG_DB,
    };
  } else {
    const options = DriverUtils.buildDriverOptions({
      url: process.env.DATABASE_URL,
    });

    return {
      PG_HOST: options.host,
      PG_PORT: options.port,
      PG_PASS: options.password,
      PG_USER: options.username,
      PG_DB: options.database,
    };
  }
}

function validateDatabaseConfig(dbOptions: any): Joi.ValidationResult {
  const envVarsSchema = Joi.object()
    .keys({
      PG_HOST: Joi.string().default('localhost'),
      PG_PORT: Joi.number().positive().default(5432),
      PG_PASS: Joi.string().default(''),
      PG_USER: Joi.string().required(),
      PG_DB: Joi.string().default('tooljet_db'),
    })
    .unknown();

  return envVarsSchema.validate(dbOptions);
}

/**
 * Builds and validates connection configuration for postgres.
 * Either picks the exact settings or extracts settings from connection url
 */
export function buildAndValidateDatabaseConfig(): Joi.ValidationResult {
  const dbOptions: any = buildDatabaseConfig();

  return validateDatabaseConfig(dbOptions);
}
