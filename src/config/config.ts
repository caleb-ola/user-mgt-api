interface ENV {
  NODE_ENV: string;
  PORT: number;

  DATABASE: string;
  DATABASE_PASSWORD: string;

  JWT_SECRET: string;
  JWT_EXPIRES: string;

  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;

  APP_CLIENT: string;
}

const Config = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: +(process.env.PORT as string),

    DATABASE: process.env.DATABASE as string,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD as string,

    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES: process.env.JWT_EXPIRES as string,

    EMAIL_HOST: process.env.EMAIL_HOST as string,
    EMAIL_PORT: process.env.EMAIL_PORT as string,
    EMAIL_USER: process.env.EMAIL_USER as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,

    APP_CLIENT: process.env.APP_CLIENT as string,
  };
};

const sanitizeConfig = (config: ENV): ENV => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Cannot locate key ${key} in config.env`);
    }
  }
  return config;
};

const config = sanitizeConfig(Config());
export default config;
