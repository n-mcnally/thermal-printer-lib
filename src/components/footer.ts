import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';
import ReceiptHr from './hr';

export type ReceiptFooterProps = {
  customerCopy?: boolean;
  greetingText?: string;
  text?: string;
};

class ReceiptFooter extends PrinterComponentBase {
  constructor(private props?: ReceiptFooterProps) {
    super();
  }

  apply(instance: PrinterInstance) {
    const printer = instance.getPrinter();
    const props = this.props ?? {};

    printer.alignCenter();

    instance.apply(new ReceiptHr());

    instance.spacer();

    if (props.customerCopy) {
      // greeting
      printer.bold(true);
      printer.println(props.greetingText ?? 'Have a nice day!');
      printer.bold(false);
      instance.spacer();

      // optional text (contact details etc..)
      props.text && printer.println(props.text);

      instance.spacer();
    }

    printer.println(`${props.customerCopy ? 'CUSTOMER' : 'MERCHANT'} COPY`);

    // reset styles for good practice
    printer.bold(false);
    printer.alignLeft();
  }
}

export default ReceiptFooter;
