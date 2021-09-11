import PrinterInstance from '../classes/printer';
import debugReceiptPreset from '../presets/debug';

export async function printDebugExample(address: string) {
  const instance = new PrinterInstance(address);

  await instance.connect();

  instance.apply(
    debugReceiptPreset({
      title: 'Debug Example',
      records: {
        ipAddress: '192.168.1.10',
        version: '1.0',
        lastSync: '19/04/2021 14:32',
        queueLength: 'empty',
      },
    })
  );

  await instance.flush(true, true, true);
}
