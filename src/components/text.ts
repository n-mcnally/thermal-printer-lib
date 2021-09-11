import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';

export type ReceiptTextProps = {
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  invert?: boolean;
  newline?: boolean;
  size?: 'normal' | 'tall' | 'wide' | 'quad';
  text?: string;
};

export class ReceiptText extends PrinterComponentBase {
  constructor(private props: ReceiptTextProps) {
    super();
  }

  apply(instance: PrinterInstance) {
    if (!this.props.text) {
      return;
    }

    const printer = instance.getPrinter();

    const { align, bold, invert, newline, size, text } = this.props;

    // apply
    bold && printer.bold(true);
    invert && printer.invert(true);

    switch (align ?? 'left') {
      case 'left':
        printer.alignLeft();
        break;
      case 'center':
        printer.alignCenter();
        break;
      case 'right':
        printer.alignRight();
        break;
    }

    switch (size ?? 'normal') {
      case 'normal':
        printer.setTextNormal();
        break;
      case 'tall':
        printer.setTextDoubleHeight();
        break;
      case 'wide':
        printer.setTextDoubleWidth();
        break;
      case 'quad':
        printer.setTextQuadArea();
        break;
    }

    // print styled text
    newline ?? true ? printer.println(text) : printer.print(text);

    // reset
    bold && printer.bold(false);
    invert && printer.invert(false);
    (align ?? 'left') !== 'left' && printer.alignLeft();
    (size ?? 'normal') !== 'normal' && printer.setTextNormal();
  }
}
