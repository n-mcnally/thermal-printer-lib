import humanizeString from 'humanize-string';
import ReceiptHr from '../components/hr';
import { ReceiptLeftRight } from '../components/left-right';
import { ReceiptText } from '../components/text';

export type DebugPresetProps = {
  title: string;
  subtitle?: string;
  records: Record<string, string>;
};

export function debugReceiptPreset(props: DebugPresetProps) {
  const records = Object.entries(props.records).map(([key, value]) => {
    return new ReceiptLeftRight({
      left: humanizeString(`${key}: `),
      right: value,
    });
  });

  return [
    new ReceiptText({
      align: 'center',
      invert: true,
      size: 'tall',
      text: props.title,
    }),
    new ReceiptText({
      align: 'center',
      text: props.subtitle,
    }),
    new ReceiptHr(),
    ...records,
    new ReceiptHr(),
    new ReceiptText({
      align: 'center',
      text: `Generated at: ${new Date().toLocaleString()}`,
    }),
  ];
}

export default debugReceiptPreset;
