class ApplicationError extends Error {
}

class NotFoundError extends ApplicationError {
}

class PermissionError extends ApplicationError {
}

class AuthorizationError extends ApplicationError {
}

export {
  ApplicationError,
  NotFoundError,
  PermissionError,
  AuthorizationError,
};