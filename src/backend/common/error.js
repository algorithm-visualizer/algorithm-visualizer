class ClientError extends Error {
}

class NotFoundError extends ClientError {
}

class ForbiddenError extends ClientError {
}

class UnauthorizedError extends ClientError {
}

export {
  ClientError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
};
