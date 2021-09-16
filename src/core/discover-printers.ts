import { batchedPromiseAll } from 'batched-promise-all';
import localDevices from 'local-devices';
import { checkRemotePortOpen } from './check-remote-port-open';

export const DEFAULT_PRINTER_PORT = 9100;
export const DEFAULT_DISCOVER_TIMEOUT = 750;

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

  if (!devices) {
    return [];
  }

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
