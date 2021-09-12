import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';
import ReceiptHr from './hr';
import { ReceiptLeftRight } from './left-right';
import { ReceiptText } from './text';

export type ReceiptBasketProps = {
  items: ReceiptBasketItem[];
  overview: {
    cash?: number;
    card?: number;
    cheque?: number;
    total: number;
    change?: number;
  };
};

export type ReceiptBasketItem = {
  title: string;
  details?: string;
  quantity: number;
  amount: number;
};

function formatPrice(penceValue = 0): string {
  const pence = penceValue % 100;
  const pounds = Math.floor((penceValue - pence) / 100);

  return `${pounds.toLocaleString()}.${pence.toString().padStart(2, '0')}`;
}

export class ReceiptBasket extends PrinterComponentBase {
  constructor(private props: ReceiptBasketProps) {
    super();
  }

  apply(instance: PrinterInstance) {
    const props = this.props;

    const items = [];

    items.push(
      new ReceiptLeftRight({
        bold: true,
        left: 'QTY   NAME',
        right: 'AMT',
      }),
      new ReceiptHr()
    );

    for (const row of props.items) {
      items.push(
        new ReceiptLeftRight({
          left: `${row.quantity.toString().padStart(3, '0')} x ${row.title}`,
          right: formatPrice(row.amount * row.quantity),
        })
      );

      if (row.details) {
        items.push(new ReceiptText({ text: `   - ${row.details}` }));
      }
    }

    items.push(new ReceiptHr());

    items.push(
      new ReceiptText({
        align: 'right',
        bold: true,
        text: `TOTAL £${formatPrice(props.overview.total).padStart(12, ' ')}`,
        size: 'tall',
      })
    );

    if (props.overview.card) {
      items.push(
        new ReceiptText({
          align: 'right',
          bold: true,
          text: `CARD £${formatPrice(props.overview.card).padStart(12, ' ')}`,
        })
      );
    }

    if (props.overview.cash) {
      items.push(
        new ReceiptText({
          align: 'right',
          bold: true,
          text: `CASH £${formatPrice(props.overview.cash).padStart(12, ' ')}`,
        })
      );
    }

    if (props.overview.cheque) {
      items.push(
        new ReceiptText({
          align: 'right',
          bold: true,
          text: `CHEQUE £${formatPrice(props.overview.cheque).padStart(
            12,
            ' '
          )}`,
        })
      );
    }

    items.push(
      new ReceiptText({
        align: 'right',
        bold: true,
        text: `CHANGE £${formatPrice(props.overview.change).padStart(12, ' ')}`,
      })
    );

    instance.apply(items);
  }
}

export default ReceiptBasket;
