import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';

export class ReceiptHr extends PrinterComponentBase {
  apply(instance: PrinterInstance) {
    instance.getPrinter().drawLine();
  }
}

export default ReceiptHr;
