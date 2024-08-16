import {
  ChakraProvider,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { theme } from "./theme";
import { useStateData } from "./useStateData";
import { useState } from "react";
import { CurrencyInput } from "./CurrencyInput";

const stockGrowth = 0.1;
const safeWithdrawalRate = 0.04;
const inflationRate = 0.0328;

const getBaseLog = (val: number, base: number) => {
  return Math.log(val) / Math.log(base);
};

export const App = () => {
  const allStateTaxBrackets = useStateData();
  const [age, setAge] = useState(40);
  const [state, setState] = useState("New York");
  const [rothAmount, setRothAmount] = useState(25000);
  const [traditionalAmount, setTraditionalAmount] = useState(50000);
  const [brokerageAmount, setBrokerageAmount] = useState(5000);
  const [spendingAmount, setSpendingAmount] = useState(40000);

  // total at retirement age = currentTotal * 1.1^(retirement age - age)
  // spendingAmount * 1.03^(retirement age - age) / (1 - withdrawalTax) = total at retirement age * safeWithdrawalRate
  // spendingAmount * 1.03^(retirement age - age) = currentTotal * 1.1^(retirement age - age) * safeWithdrawalRate
  // 1.1^(retirement age - age) / 1.03^(retirement age - age) = spendingAmount / (safeWithdrawalRate * currentTotal)
  // (1.1/1.03)^(retirement age - age) = spendingAmount / (safeWithdrawalRate * currentTotal)

  // total A at retirement age = currentTotalA * 1.1^(retirement age - age)
  // total B at retirement age = currentTotalB * 1.1^(retirement age - age)
  // spendingAmount * 1.03^(retirement age - age) / (1 - withdrawalTaxA) = total A at retirement age * safeWithdrawalRate
  // spendingAmount * 1.03^(retirement age - age) / (1 - withdrawalTaxB) = total B at retirement age * safeWithdrawalRate
  // totalSpendingAmount = [total A at retirement age * (1 - withdrawalTaxA) + total B at retirement age * (1 - withdrawalTaxB)] * safeWithdrawalRate / 1.03^(retirement age - age)
  // totalSpendingAmount = [currentTotalA * (1 - withdrawalTaxA) + currentTotalB * (1 - withdrawalTaxB)] * 1.1^(retirement age - age) * safeWithdrawalRate / 1.03^(retirement age - age)

  const retirementAge =
    age +
    getBaseLog(
      spendingAmount /
        (safeWithdrawalRate *
          (brokerageAmount * (1 - 0.15) +
            traditionalAmount * (1 - 0.25) +
            rothAmount)),
      (1 + stockGrowth) / (1 + inflationRate)
    );

  return (
    <ChakraProvider theme={theme}>
      <VStack p={4}>
        <HStack>
          <Text>I am</Text>
          <NumberInput
            value={age}
            onChange={(_, a) => {
              setAge(a || 0);
            }}
            max={150}
            w={10}
          >
            <NumberInputField textAlign="center" />
          </NumberInput>
          <Text>years old</Text>
        </HStack>
        <HStack whiteSpace="nowrap">
          <Text>I live in </Text>
          {allStateTaxBrackets && (
            <Select
              h={8}
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              {Object.keys(allStateTaxBrackets).map((stateName) => (
                <option value={stateName} key={stateName}>
                  {stateName}
                </option>
              ))}
            </Select>
          )}
        </HStack>
        <HStack>
          <Text>I have</Text>
          <CurrencyInput value={rothAmount} setValue={setRothAmount} />
          <Text>in my Roth IRAs and 401(k)s</Text>
        </HStack>
        <HStack>
          <Text>I have</Text>
          <CurrencyInput
            value={traditionalAmount}
            setValue={setTraditionalAmount}
          />
          <Text>in my Traditional IRAs and 401(k)s</Text>
        </HStack>
        <HStack>
          <Text>I have</Text>
          <CurrencyInput
            value={brokerageAmount}
            setValue={setBrokerageAmount}
          />
          <Text>in my standard brokerage accounts</Text>
        </HStack>
        <HStack>
          <Text>I spend</Text>
          <CurrencyInput value={spendingAmount} setValue={setSpendingAmount} />
          <Text>every year</Text>
        </HStack>
        <Text fontSize="xx-large">
          You can retire at {Math.round(retirementAge)} with your current
          savings
        </Text>
      </VStack>
    </ChakraProvider>
  );
};
