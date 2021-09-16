import localDevices from 'local-devices';

/**
 * @param mac
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
  mac: string,
  searchAddress?: string
): Promise<string | null> {
  let devices = await localDevices(searchAddress);

  if (!devices) {
    return null;
  }

  !Array.isArray(devices) && (devices = [devices]);

  const match = devices.find(device => device.mac === mac);

  if (!match) {
    return null;
  }

  return match.ip;
}
