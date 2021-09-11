import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';

export type ReceiptLeftRightProps = {
  bold?: true;
  left: string;
  right: string;
};

export class ReceiptLeftRight extends PrinterComponentBase {
  constructor(private props: ReceiptLeftRightProps) {
    super();
  }

  apply(instance: PrinterInstance) {
    const printer = instance.getPrinter();

    const { bold, left, right } = this.props;

    bold && printer.bold(true);

    printer.leftRight(left, right);

    bold && printer.bold(false);
  }
}
