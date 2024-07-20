export default class ApiError extends Error {
  readonly message: string;

  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);

    this.message = message;
    this.status = status;
  }
}
