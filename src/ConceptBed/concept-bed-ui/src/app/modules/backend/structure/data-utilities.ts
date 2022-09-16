import { DeepPartial } from "./deep-partial";

/**
 * Represents the constructor function for generic types to serve as generic type guard.
 */
type Constructor<T> = new (...args: any[]) => T;

/**
* Represents the container for type integrity validation methods and variables.
*/
export class DataUtilities {
  /** The list of types considered as primitive and exclided from deep ccomparison. */
  private static types: string[] = ['number', 'string', 'boolean', 'symbol'];

  /**
   * Checks if the object is of a primitive type and deep comparison should be used.
   * @param value The object value to check for compexity.
   */
  static isComplex(value: any): value is object {
    return value && !DataUtilities.types.includes(typeof value);
  }

  /**
   * Conditionally converts the string date and time representation into date and time value.
   * @param value The date and time string representation to convert.
   * @param fallback The date and time value converted if valid; otherwise, undefined.
   */
  static of(value: string | number | Date | DeepPartial<Date> | undefined, fallback?: Date): Date {
    if (typeof value === 'number' || typeof value === 'string') {
      return new Date(value);
    } else if (value) {
      return value as Date;
    } else {
      return fallback as Date;
    }
  }

  /**
   * Conditionally converts the generic type representation into the requested type value.
   * @param value The requested typeless representation to convert.
   * @param type The requested type to validate the value against.
   */
  static ofType<T>(value: T, type: Constructor<T>): T {
    return value instanceof type ? value : new type(value);
  }
}
