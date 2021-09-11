export enum PRINTER_ERROR {
  NO_CONNECTION = 'NO_CONNECTION',
  NULL_BUFFER = 'NULL_BUFFER',
}

export class PrinterError extends Error {
  constructor(public code: PRINTER_ERROR, message: string) {
    super(message);
    Object.setPrototypeOf(this, PrinterError.prototype);
  }
}
