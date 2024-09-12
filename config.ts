import dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  RestApiUrl: isProduction
    ? process.env.KV_REST_API_URL
    : process.env.KV_REST_API_URL || import.meta.env.VITE_KV_REST_API_URL,
  token: isProduction
    ? process.env.KV_REST_API_TOKEN
    : process.env.KV_REST_API_TOKEN || import.meta.env.VITE_KV_REST_API_TOKEN,
};

// export const config = {
//   RestApiUrl:
//     process.env.KV_REST_API_URL || import.meta.env.VITE_KV_REST_API_URL,
//   token: process.env.OTHER_DEV_VAR || import.meta.env.VITE_KV_REST_API_TOKEN,
// };

// token: import.meta.env.VITE_KV_REST_API_TOKEN,
