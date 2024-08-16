import { NumberInput, NumberInputField } from "@chakra-ui/react";

export const CurrencyInput = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (val: number) => void;
}) => {
  const format = (val: number) =>
    `$` +
    val
      .toString()
      .split(/(?=(?:\d{3})+$)/)
      .join(",");
  const parse = (val: string) => parseFloat(val.replace(/\$|,/g, "") || "0");

  return (
    <NumberInput
      value={format(value)}
      onChange={(v) => setValue(parse(v))}
      defaultValue={25000}
    >
      <NumberInputField />
    </NumberInput>
  );
};
