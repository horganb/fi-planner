import { NumberInput, NumberInputField } from "@chakra-ui/react";
import { formatAsCurrency } from "./utils";

export const CurrencyInput = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (val: number) => void;
}) => {
  const parse = (val: string) => {
    const parsedStr = val.replace(/\$|,|-/g, "") || "0";
    const beforeDecimal = parsedStr.split(".")[0];
    return parseFloat(beforeDecimal);
  };

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
