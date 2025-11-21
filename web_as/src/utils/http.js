export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const isSuccess = (status) => status >= 200 && status < 300;
export const isClientError = (status) => status >= 400 && status < 500;
export const isServerError = (status) => status >= 500 && status < 600;

export const getErrorMessage = (status) => {
  const messages = {
    [HTTP_STATUS.BAD_REQUEST]: 'Invalid request',
    [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized access',
    [HTTP_STATUS.FORBIDDEN]: 'Access forbidden',
    [HTTP_STATUS.NOT_FOUND]: 'Resource not found',
    [HTTP_STATUS.CONFLICT]: 'Conflict occurred',
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Server error',
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service unavailable',
  };
  return messages[status] || 'Unknown error';
};
