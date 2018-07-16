class ApplicationError extends Error {
  toJSON() {
    return { message: this.message };
  }
}

class NotFoundError extends ApplicationError {
}

class PermissionError extends ApplicationError {
}

class AuthorizationError extends ApplicationError {
}

class CompileError extends ApplicationError {
}

class RuntimeError extends ApplicationError {
}

export {
  ApplicationError,
  NotFoundError,
  PermissionError,
  AuthorizationError,
  CompileError,
  RuntimeError,
};