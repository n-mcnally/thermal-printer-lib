import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';

export class ReceiptCut extends PrinterComponentBase {
  apply(instance: PrinterInstance) {
    instance.getPrinter().cut();
  }
}

export default ReceiptCut;
