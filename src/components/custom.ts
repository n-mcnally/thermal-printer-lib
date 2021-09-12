import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';

export type ReceiptCustomCallback = (
  instance: PrinterInstance
) => void | Promise<void>;

export class ReceiptCustom extends PrinterComponentBase {
  constructor(private readonly callback: ReceiptCustomCallback) {
    super();
  }

  async apply(instance: PrinterInstance) {
    await this.callback(instance);
  }
}

export default ReceiptCustom;
