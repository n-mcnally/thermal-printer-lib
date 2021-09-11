import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';

export class ReceiptVatNumber extends PrinterComponentBase {
  constructor(private readonly vatNumber?: string) {
    super();
  }

  apply(instance: PrinterInstance) {
    if (!this.vatNumber) {
      return;
    }

    const printer = instance.getPrinter();

    instance.spacer();
    printer.alignCenter();
    printer.print('VAT Number: ');
    printer.bold(true);
    printer.print(this.vatNumber);
    printer.bold(false);
    instance.spacer();

    printer.alignLeft();
  }
}
