const getEnv = (key, defaultValue) => {
  return import.meta.env[key] || defaultValue;
};

export const ENV = {
  API_BASE_URL: getEnv('VITE_API_BASE_URL', 'http://localhost:5000'),
  NODE_ENV: getEnv('MODE', 'development'),
  ENABLE_LOGGING: getEnv('VITE_ENABLE_LOGGING', 'true') === 'true',
  ENABLE_ANALYTICS: getEnv('VITE_ENABLE_ANALYTICS', 'false') === 'true',
};

export const isDevelopment = ENV.NODE_ENV === 'development';
export const isProduction = ENV.NODE_ENV === 'production';
