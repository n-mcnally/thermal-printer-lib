import localDevices from 'local-devices';
import { checkRemotePortOpen } from './check-remote-port-open';
import {
  DEFAULT_DISCOVER_TIMEOUT,
  DEFAULT_PRINTER_PORT,
} from './discover-printers';

/**
 * Checks the printer is online and has port open.
 */
export async function checkPrinterConnection(
  ip: string,
  mac: string,
  port = DEFAULT_PRINTER_PORT,
  timeout = DEFAULT_DISCOVER_TIMEOUT
): Promise<number | false> {
  let devices = await localDevices(ip);

  if (!devices) {
    return false;
  }

  !Array.isArray(devices) && (devices = [devices]);

  const match = devices.find(device => device.mac === mac);

  if (!match || match.ip !== ip) {
    return false;
  }

  return checkRemotePortOpen(ip, port, timeout);
}
