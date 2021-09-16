import discoverPrinters from '../core/discover-printers';

export const printerDiscoveryExample = async () => {
  const discoveredPrinters = await discoverPrinters();

  return {
    found: discoveredPrinters.length,
    devices: discoveredPrinters,
  };
};

export default printerDiscoveryExample;
