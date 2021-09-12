import { PrinterInstance } from '../classes/printer';
import { PrinterComponentBase } from '../classes/component-base';

/**
 * A good single interface for clients to create preset buffers
 * to send over a network or add to a queue etc...
 */
export function createEncodedBufferFromPreset(
  presetResult: PrinterComponentBase[]
): string {
  const instance = new PrinterInstance();

  instance.apply(presetResult);

  return instance.getBase64EncodedBuffer();
}
