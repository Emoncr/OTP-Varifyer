export const throwError = (statusCode, errorMessage) => {
  const error = new Error();
  error.message = errorMessage;
  error.statusCode = statusCode;
  return error;
};
