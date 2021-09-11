import { batchedPromiseAll } from 'batched-promise-all';
import localDevices from 'local-devices';
import { Socket } from 'net';

export const DEFAULT_PRINTER_PORT = 9100;
export const DEFAULT_DISCOVER_TIMEOUT = 750;

/**
 * Tries to establish a socket connection to the device on the ip
 * address and port provided returning the round trip latency if
 * successful.
 */
export function checkRemotePortOpen(
  address: string,
  port: number,
  timeout: number
): Promise<number | false> {
  const start = Date.now();

  return new Promise(resolve => {
    const socket = new Socket();

    // cancel the connection after the timeout and return false
    socket.setTimeout(timeout, () => {
      socket.destroy();
      resolve(false);
    });

    // if the connection is established return the total time in ms
    socket.connect(port, address, async () => {
      socket.destroy();
      resolve(Date.now() - start);
    });

    // if an error occurs return false
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

export interface DiscoveredPrinter {
  ip: string;
  mac: string;
  latency: number | false;
}

/**
 * Returns all printers discovered at the given address value.
 *
 * The minimum time required is:
 *    * ((`numLocalDevices` rounded up to next multiple of 10) / 10) * `timeout`
 *
 * @param address
 *    Override the default address condition (local network) when required for
 *    a multi vlan network configuration, access over vpn etc...
 *
 *      * `null` - local network
 *      * `192.168.1.10` - single ip
 *      * `192.168.1.0/24` - subnet
 *      * `192.168.1.10-192.168.1.20` - ip range
 */
export async function discoverPrinters(
  address?: string,
  timeout = DEFAULT_DISCOVER_TIMEOUT,
  port = DEFAULT_PRINTER_PORT
): Promise<DiscoveredPrinter[]> {
  let devices = await localDevices(address);

  if (!Array.isArray(devices)) {
    devices = [devices];
  }

  const portTests = await batchedPromiseAll(
    devices,
    async device => checkRemotePortOpen(device.ip, port, timeout),
    10
  );

  const discovered: DiscoveredPrinter[] = [];

  for (let i = 0; i < devices.length; i++) {
    const latency = portTests[i];

    if (latency !== false) {
      const { ip, mac } = devices[i];

      discovered.push({ ip, mac, latency });
    }
  }

  return discovered;
}

/**
 * @param macAddress
 *    the mac address to look for
 * @param address
 *    Override the default address condition (local network) when required for
 *    a multi vlan network configuration, access over vpn etc...
 *
 *      * `null` - local network
 *      * `192.168.1.10` - single ip
 *      * `192.168.1.0/24` - subnet
 *      * `192.168.1.10-192.168.1.20` - ip range
 */
export async function getIpFromMacAddress(
  macAddress: string,
  searchAddress?: string
): Promise<string | null> {
  const devices = await localDevices(searchAddress);

  const match = devices.find(device => device.mac === macAddress);

  if (!match) {
    return null;
  }

  return match.ip;
}

/**
 * Checks the printer is online and has port open.
 */
export async function checkPrinterConnection(
  ip: string,
  mac: string,
  port = DEFAULT_PRINTER_PORT,
  timeout = DEFAULT_DISCOVER_TIMEOUT
): Promise<boolean> {
  let devices = await localDevices(ip);

  if (!devices) {
    return false;
  }

  // ensure type is correct (return object with single ip)
  !Array.isArray(devices) && (devices = [devices]);

  const match = devices.find(device => device.mac === mac);

  if (!match || match.ip !== ip) {
    return false;
  }

  const isPortOpen = await checkRemotePortOpen(ip, port, timeout);

  return isPortOpen !== false;
}
