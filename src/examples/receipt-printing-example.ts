import PrinterInstance from '../classes/printer';
import { paymentReceiptPreset } from '../presets/payment-receipt';

export async function receiptPrinterExample(address: string) {
  const instance = new PrinterInstance(address);

  await instance.connect();

  instance.apply(
    paymentReceiptPreset({
      title: {
        copyReceipt: false,
        locationAddress: 'Demo Line 1, Demo Line 2, Town, Postcode',
        locationName: 'Location Name',
        plotNumber: 'Mr John Doe',
        servedBy: 'Nathan [Location]',
      },
      basket: {
        items: [
          {
            amount: 100,
            quantity: 500,
            title: 'Misc Sweets',
            details: 'Custom text here',
          },
          {
            amount: 125000,
            quantity: 1,
            title: '2021 Ground Rent',
            details: '£1,300.00 paid so far',
          },
          {
            amount: 12000,
            quantity: 1,
            title: 'Invoice Payment',
            details: 'Ref: Supply and fit slabs',
          },
        ],
        overview: {
          cash: 50000,
          card: 125500,
          total: 175000,
          change: 500,
        },
      },
      vatNumber: '18383039',
    })
  );

  await instance.flush(true, true, true);
}

export default receiptPrinterExample;
