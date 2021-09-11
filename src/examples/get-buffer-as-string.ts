import PrinterInstance from '../classes/printer';
import debugReceiptPreset from '../presets/debug';

export async function getBufferAsString(address: string) {
  const instance = new PrinterInstance('0.0.0.0');

  instance.apply(
    debugReceiptPreset({
      title: 'Debug Example',
      records: {
        ipAddress: address,
        version: '1.0',
        lastSync: '19/04/2021 14:32',
        queueLength: 'empty',
      },
    })
  );

  const buffer = instance.getBase64EncodedBuffer();

  instance.clear();
  instance.addBase64EncodedBuffer(buffer);

  console.log(instance.getBase64EncodedBuffer());
}
