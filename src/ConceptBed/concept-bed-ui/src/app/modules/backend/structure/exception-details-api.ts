export interface ExceptionDetailsApi {
  /**
   * The message associated with error response.
   */
  message: string;

  /**
   * The type of an error.
   */
  category: string;

  /**
   * The stack trace of an error.
   */
  stackTrace?: string;

  /**
   * The inner serializeable error details if present.
   */
  inner?: ExceptionDetailsApi;

  /**
   * The aggregated serializeable error details if present.
   */
  inners?: ExceptionDetailsApi[];
}
