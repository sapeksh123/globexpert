export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
  TIMEOUT: 20000,
  RETRY_ATTEMPTS: 3,
};

export const APP_CONFIG = {
  APP_NAME: 'Globexpert Admin',
  VERSION: '1.0.0',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CATALOG: '/catalog',
  ORDERS: '/orders',
  SELLERS: '/sellers',
  USERS: '/users',
  PROFILE: '/profile',
};

export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  ERROR_NETWORK: 'Network error. Please check your connection.',
  ERROR_SERVER: 'Server error. Please try again later.',
  ERROR_INVALID_CREDENTIALS: 'Invalid email or password.',
  SUCCESS_CREATED: 'Created successfully',
  SUCCESS_UPDATED: 'Updated successfully',
  SUCCESS_DELETED: 'Deleted successfully',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};
