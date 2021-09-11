# Thermal Printer Library

A set of useful utilities for working with ip thermal printers.

Provides abstractions for creating prop-driven, reusable presets and components and discovering printers on a network.

## Basic usage

---

Prints "Hello world" to a local thermal printer using the `ReceiptText` component.

```ts
const instance = new PrinterInstance('192.168.1.10');

await instance.connect();

instance.apply([
  new ReceiptText({
    align: 'center',
    bold: true,
    text: 'Hello world',
  }),
]);

await instance.flush(true, true);
```

### Usage with buffers

---

Creates an instance that stores the buffer to be printed later.

```ts
const bufferOnlyInstance = new PrinterInstance();

bufferOnlyInstance.apply([
  new ReceiptText({
    align: 'center',
    bold: true,
    text: 'Hello world',
  }),
]);

const encodedBuffer = bufferOnlyInstance.getBase64EncodedBuffer(true);

// then you can pass this string to a connected buffer later to be printed

const instance = new PrinterInstance('192.168.1.10');

await instance.connect();

instance.addBase64EncodedBuffer(encodedBuffer);

await instance.flush(true, true);
```

### Custom components

---

A component is a simple way to abstract code that may be called many times
across receipts. A few basic components are provided for you but you can create
custom ones for your use case.

When applied the components `apply` method is called passing with the current instance.

A component should always reset any changes it's applied.

```ts
class ReceiptBoldText extends PrinterComponentBase {
  constructor(private text: string) {}

  apply(instance: PrinterInstance) {
    const printer = instance.getPrinter();

    printer.bold(true);
    printer.printLn(this.text);
    printer.bold(false);
  }
}

// now can be applied like so
instance.apply([
  new ReceiptBoldText('Hello world'),
  new ReceiptBoldText('This is on the next line'),
]);
```

### Custom presets

---

A preset is just a pure function that returns an array of components.

```ts
interface SimpleReceiptPresetProps {
  items: string[];
}

function simpleEposReceiptPreset(props: SimpleReceiptPresetProps) {
  return [
    new ReceiptTitle({
      locationName: 'Test Shop',
      locationAddress: '1 Demo Street, Town, XX12 XXX',
      servedBy: 'Tom',
    }),
    ...items.map(item => new ReceiptText({ text: item })),
    new ReceiptFooter({
      customerCopy: false,
    }),
  ];
}
```

### Discover network printers

---

Easily search for printers on a network by providing an ip, subnet or ip-range.

```ts
const discovered = await discoverPrinters('192.168.1.0/24');

console.log(discovered);

// [ { ip: string, mac: string, latency: number }, ... ]
```
