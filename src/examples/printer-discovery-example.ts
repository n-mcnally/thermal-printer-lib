import discoverPrinters from '../core/discovery';

export const printerDiscoveryExample = async () => {
  const discoveredPrinters = await discoverPrinters();

  return {
    found: discoveredPrinters.length,
    devices: discoveredPrinters,
  };
};

export default printerDiscoveryExample;
