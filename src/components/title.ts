import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';
import ReceiptHr from './hr';
import ReceiptMeta from './meta';

export type ReceiptTitleProps = {
  copyReceipt?: boolean;
  customerCopy?: boolean;
  locationAddress: string;
  locationName: string;
  plotNumber?: string;
  servedBy: string;
};

class ReceiptTitle extends PrinterComponentBase {
  constructor(private props: ReceiptTitleProps) {
    super();
  }

  apply(instance: PrinterInstance) {
    const printer = instance.getPrinter();
    const props = this.props;

    printer.alignCenter();

    // location name (variable height)
    props.locationName.length <= 16
      ? printer.setTextQuadArea()
      : printer.setTextDoubleHeight();
    printer.bold(true);
    printer.println(props.locationName);
    printer.setTextNormal();
    instance.spacer();

    // address
    if (props.customerCopy) {
      printer.println(props.locationAddress);
      instance.spacer();
    }

    // metadata row
    printer.alignLeft();
    instance.apply(new ReceiptMeta(props.servedBy));
    instance.spacer();

    // plot number
    if (props.plotNumber) {
      printer.alignCenter();
      printer.invert(true);
      printer.println(`< ${props.plotNumber} >`);
      printer.invert(false);
    }

    // copy receipt notice
    if (props.copyReceipt) {
      instance.spacer();
      printer.setTextDoubleHeight();
      printer.println('*** COPY RECEIPT ***');
      printer.setTextNormal();
      instance.spacer();
    }

    // hr
    instance.apply(new ReceiptHr());

    // reset alignment
    printer.alignLeft();
    printer.bold(false);
  }
}

export default ReceiptTitle;
