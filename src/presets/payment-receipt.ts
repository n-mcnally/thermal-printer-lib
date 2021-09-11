import ReceiptBasket, { ReceiptBasketProps } from '../components/basket';
import ReceiptCut from '../components/cut';
import ReceiptFooter, { ReceiptFooterProps } from '../components/footer';
import ReceiptTitle, { ReceiptTitleProps } from '../components/title';
import { ReceiptVatNumber } from '../components/vat-number';

export type PaymentReceiptPresetProps = {
  title: ReceiptTitleProps;
  basket: ReceiptBasketProps;
  footer?: ReceiptFooterProps;
  vatNumber?: string;
};

export function paymentReceiptPreset(props: PaymentReceiptPresetProps) {
  return [
    new ReceiptTitle({ ...props.title, customerCopy: true }),
    new ReceiptBasket(props.basket),
    new ReceiptFooter({ ...(props.footer || {}), customerCopy: true }),
    new ReceiptVatNumber(props.vatNumber),
    new ReceiptCut(),
    new ReceiptTitle(props.title),
    new ReceiptBasket(props.basket),
    new ReceiptFooter({
      text: '01754 777777 | www.website-here.co.uk',
      ...props.footer,
    }),
  ];
}

export default paymentReceiptPreset;
