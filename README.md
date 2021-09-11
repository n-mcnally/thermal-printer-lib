# Thermal Printer Library

A set of useful utilities for working with ip thermal printers.

Provides abstractions for creating prop-driven, reusable presets and components and discovering printers on a network.

Uses the [node-thermal-printer](https://www.npmjs.com/package/node-thermal-printer) library for buffer creation and printing.

> You can get a reference to the underlying `node-thermal-printer` instance by calling the `getPrinter` method.

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

await instance.flush(true, true, true);
```

> The `flush` method provides optional parameters for _cut_, _open cash drawer_ and _beep_. (if available)

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

// then you can pass this string to a connected instance later to be printed

const instance = new PrinterInstance('192.168.1.10');

await instance.connect();

instance.addBase64EncodedBuffer(encodedBuffer);

await instance.flush(true, true);
```

### Using the `node-thermal-printer` instance

---

Access the underlying instance by calling the `getPrinter` method.

> The packages `printer` interface is re-exported as `ThermalPrinter`.

```ts
const instance = new PrinterInstance();

const printer: ThermalPrinter = instance.getPrinter();

// same output as the `ReceiptText` component in the above example
printer.alignTextCenter();
printer.bold(true);
printer.printLn('Hello world');
printer.bold(false);
printer.alignTextLeft();
```

### Custom components

---

A component is a simple way to abstract code that may be called many times
across receipts. A few basic components are provided for you but you can create
custom ones for your own use case.

When applied the components `apply` method is called passing it the current instance.

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

// the just pass the function result to `instance.apply` to use
instance.apply(simpleEposReceiptPreset({ items: ['Item one', 'Item two'] }));
```

### Discover network printers

---

Easily search for printers on a network by providing an ip, subnet or ip-range.

```ts
const discovered = await discoverPrinters('192.168.1.0/24');

discovered.forEach(discoveredPrinter => {
  console.log(discoveredPrinter);
});

// > { ip: '192.168.1.10', mac: "...", latency: 12 }
// > { ip: '192.168.1.11', mac: "...", latency: 114 }
// > { ip: '192.168.1.12', mac: "...", latency: 67 }
```
