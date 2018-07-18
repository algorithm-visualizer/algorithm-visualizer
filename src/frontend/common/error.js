class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class CompileError extends ApplicationError {
}

class RuntimeError extends ApplicationError {
}

export {
  ApplicationError,
  CompileError,
  RuntimeError,
};