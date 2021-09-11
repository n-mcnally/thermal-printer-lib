import PrinterInstance from './printer';

export abstract class PrinterComponentBase {
  abstract apply(instance: PrinterInstance): void;
}

export default PrinterComponentBase;
