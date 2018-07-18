class ClientError extends Error {
  toJSON() {
    return { name: this.constructor.name, message: this.message };
  }
}

class NotFoundError extends ClientError {
}

class ForbiddenError extends ClientError {
}

class UnauthorizedError extends ClientError {
}

class CompileError extends ClientError {
}

class RuntimeError extends ClientError {
}

export {
  ClientError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  CompileError,
  RuntimeError,
};