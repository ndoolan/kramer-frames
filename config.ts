import dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

export const config = {
  RestApiUrl:
    process.env.KV_REST_API_URL || import.meta.env.VITE_KV_REST_API_URL,
  token: process.env.OTHER_DEV_VAR || import.meta.env.VITE_KV_REST_API_TOKEN,
};

// token: import.meta.env.VITE_KV_REST_API_TOKEN,
