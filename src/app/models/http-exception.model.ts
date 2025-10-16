class HttpException extends Error {
  errorCode: number;
  constructor(
    errorCode: number,
    public override message: string | any,
  ) {
    super(message);
    this.errorCode = errorCode;
  }
}

export default HttpException;
