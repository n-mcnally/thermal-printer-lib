import {
  printer as ThermalPrinter,
  types as PrinterTypes,
} from 'node-thermal-printer';
import {
  DEFAULT_DISCOVER_TIMEOUT,
  DEFAULT_PRINTER_PORT,
} from '../core/discover-printers';
import PrinterComponentBase from './component-base';
import { PrinterError, PRINTER_ERROR } from './error';

export { ThermalPrinter };

export class PrinterInstance {
  private printer: ThermalPrinter;

  isConnected = false;

  constructor(
    private address?: string,
    private name: string = 'Receipt Printer 1',
    private timeout: number = DEFAULT_DISCOVER_TIMEOUT,
    type: PrinterTypes = PrinterTypes.EPSON,
    port = DEFAULT_PRINTER_PORT
  ) {
    this.printer = new ThermalPrinter({
      interface: `tcp://${address ?? 'BUFFER_USE_ONLY'}:${port}`,
      type,
      options: { timeout },
    });
  }

  async connect() {
    if (this.isConnected) {
      return true;
    }

    const result = await this.printer.isPrinterConnected();

    if (result) {
      this.isConnected = true;
    }

    return result;
  }

  getBuffer(clear = false): Buffer {
    const buffer = this.printer.getBuffer();

    if (!buffer) {
      throw new PrinterError(
        PRINTER_ERROR.NULL_BUFFER,
        'trying to retrieve empty buffer'
      );
    }

    if (clear) {
      this.clear();
    }

    return buffer;
  }

  getBase64EncodedBuffer(clear = false): string {
    const buffer = this.printer.getBuffer();

    if (!buffer) {
      throw new PrinterError(
        PRINTER_ERROR.NULL_BUFFER,
        'trying to retrieve empty buffer'
      );
    }

    if (clear) {
      this.clear();
    }

    return buffer.toString('base64');
  }

  addBuffer(buffer: Buffer): void {
    this.printer.add(buffer);
  }

  addBase64EncodedBuffer(encodedBuffer: string): void {
    this.printer.add(Buffer.from(encodedBuffer, 'base64'));
  }

  getPrinter(): ThermalPrinter {
    return this.printer;
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      address: this.address,
      name: this.name,
      timeout: this.timeout,
    };
  }

  getText() {
    return this.printer.getText();
  }

  // utility functions

  apply(component: PrinterComponentBase | PrinterComponentBase[]) {
    if (Array.isArray(component)) {
      component.forEach(c => this.apply(c));
    } else {
      if (component) {
        component.apply(this);
      }
    }
  }

  async flush(cut = true, openDrawer = false, beep = true) {
    if (!this.printer.getBuffer()) {
      throw new PrinterError(
        PRINTER_ERROR.NULL_BUFFER,
        'trying to retrieve empty buffer'
      );
    }

    if (!this.isConnected) {
      throw new PrinterError(
        PRINTER_ERROR.NO_CONNECTION,
        'cannot flush, instance is not connected'
      );
    }

    if (cut) {
      this.printer.cut();
    }

    if (beep) {
      this.printer.beep();
    }

    if (openDrawer) {
      this.printer.openCashDrawer();
    }

    return this.printer.execute();
  }

  clear(): void {
    this.printer.clear();
  }

  spacer(lines = 1): void {
    for (let i = 0; i < lines; i++) {
      this.printer.newLine();
    }
  }
}

export default PrinterInstance;
