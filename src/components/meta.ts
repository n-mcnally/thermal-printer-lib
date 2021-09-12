import PrinterComponentBase from '../classes/component-base';
import PrinterInstance from '../classes/printer';

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function getDateString(): string {
  const now = new Date();

  return (
    `${pad(now.getDate())}/${pad(now.getMonth())}/${now.getFullYear()} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  );
}

export class ReceiptMeta extends PrinterComponentBase {
  constructor(private servedBy: string) {
    super();
  }

  apply(instance: PrinterInstance) {
    const printer = instance.getPrinter();
    const date = new Date();

    printer.tableCustom([
      {
        align: 'LEFT',
        text: getDateString(),
        width: 0.4,
      },
      {
        align: 'CENTER',
        text: Math.floor(date.getTime() / 1000).toString(),
        width: 0.25,
      },
      {
        align: 'RIGHT',
        text: this.servedBy,
        width: 0.35,
      },
    ]);
  }
}

export default ReceiptMeta;
