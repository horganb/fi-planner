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
import { getYearsToRetire } from "./calculate_age";

export const App = () => {
  const allStateTaxBrackets = useStateData();
  const [age, setAge] = useState(40);
  const [state, setState] = useState("New York");
  const [rothAmount, setRothAmount] = useState(25000);
  const [traditionalAmount, setTraditionalAmount] = useState(0);
  const [brokerageAmount, setBrokerageAmount] = useState(0);
  const [spendingAmount, setSpendingAmount] = useState(80000);
  const [rothContributions, setRothContributions] = useState(0);
  const [traditionalContributions, setTraditionalContributions] = useState(0);
  const [brokerageContributions, setBrokerageContributions] = useState(0);

  const retirementAge =
    age +
    getYearsToRetire(
      [
        {
          taxRate: 0,
          startingBalance: rothAmount,
          yearlyContribution: rothContributions,
          yearlyReturn: 0.1,
        },
        {
          taxRate: 0.25,
          startingBalance: traditionalAmount,
          yearlyContribution: traditionalContributions,
          yearlyReturn: 0.1,
        },
        {
          taxRate: 0.15,
          startingBalance: brokerageAmount,
          yearlyContribution: brokerageContributions,
          yearlyReturn: 0.1,
        },
      ],
      spendingAmount
    );

  const costFIretirementAge =
    age +
    getYearsToRetire(
      [
        {
          taxRate: 0,
          startingBalance: rothAmount,
          yearlyContribution: 0,
          yearlyReturn: 0.1,
        },
        {
          taxRate: 0.25,
          startingBalance: traditionalAmount,
          yearlyContribution: 0,
          yearlyReturn: 0.1,
        },
        {
          taxRate: 0.15,
          startingBalance: brokerageAmount,
          yearlyContribution: 0,
          yearlyReturn: 0.1,
        },
      ],
      spendingAmount
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
          <Text>in my traditional IRAs and 401(k)s</Text>
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
          <Text>I contribute</Text>
          <CurrencyInput
            value={rothContributions}
            setValue={setRothContributions}
          />
          <Text>yearly to my Roth IRAs and 401(k)s</Text>
        </HStack>
        <HStack>
          <Text>I contribute</Text>
          <CurrencyInput
            value={traditionalContributions}
            setValue={setTraditionalContributions}
          />
          <Text>yearly to traditional IRAs and 401(k)s</Text>
        </HStack>
        <HStack>
          <Text>I contribute</Text>
          <CurrencyInput
            value={brokerageContributions}
            setValue={setBrokerageContributions}
          />
          <Text>yearly to my standard brokerage accounts</Text>
        </HStack>
        <HStack>
          <Text>I spend</Text>
          <CurrencyInput value={spendingAmount} setValue={setSpendingAmount} />
          <Text>every year</Text>
        </HStack>
        <Text fontSize="xx-large">
          At this rate, you can retire at {Math.round(retirementAge)}.
        </Text>
        <Text fontSize="x-large">
          You can retire at {Math.round(costFIretirementAge)} with just your
          current savings.
        </Text>
      </VStack>
    </ChakraProvider>
  );
};
