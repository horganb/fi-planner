import { NumberInput, NumberInputField } from "@chakra-ui/react";
import { formatAsCurrency } from "./utils";

export const CurrencyInput = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (val: number) => void;
}) => {
  const parse = (val: string) => parseFloat(val.replace(/\$|,/g, "") || "0");

  return (
    <NumberInput
      value={formatAsCurrency(value)}
      onChange={(v) => setValue(parse(v))}
      defaultValue={25000}
    >
      <NumberInputField />
    </NumberInput>
  );
};
