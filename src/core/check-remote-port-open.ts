import { Socket } from 'net';

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
