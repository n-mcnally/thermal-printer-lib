import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';

export type ReceiptQrCodeProps = {
  align?: 'left' | 'center' | 'right';
  /* value between 1-8 */
  cellSize?: number;
  /** L(7%), M(15%), Q(25%), H(30%) */
  correction?: 'L' | 'M' | 'Q' | 'H';
  /** the value to be encoded */
  value: string;
};

class ReceiptQrCode extends PrinterComponentBase {
  constructor(private props: ReceiptQrCodeProps) {
    super();
  }

  apply(instance: PrinterInstance) {
    const printer = instance.getPrinter();
    const props = this.props;

    switch (props.align ?? 'left') {
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

    printer.printQR(props.value, {
      cellSize: Math.min(8, Math.max(1, props.cellSize ?? 4)),
      correction: props.correction ?? 'H',
      model: 2,
    });

    printer.alignLeft();
  }
}

export default ReceiptQrCode;
