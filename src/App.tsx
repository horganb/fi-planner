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
import {
  getYearsToRetire,
  netWorthOverTimeInflationAdjusted,
} from "./calculate_age";
import { formatAsCurrency } from "./utils";

const ACCOUNT_INFO = [
  {
    taxRate: 0,
    yearlyReturn: 0.1,
    name: "Roth IRAs and 401(k)s",
  },
  {
    taxRate: 0.25,
    yearlyReturn: 0.1,
    name: "traditional IRAs and 401(k)s",
  },
  {
    taxRate: 0.15,
    yearlyReturn: 0.1,
    name: "standard brokerage accounts",
  },
  {
    taxRate: 0.25,
    yearlyReturn: 0.05,
    name: "savings accounts",
  },
];

export const App = () => {
  const allStateTaxBrackets = useStateData();
  const [age, setAge] = useState(40);
  const [state, setState] = useState("New York");
  const [spendingAmount, setSpendingAmount] = useState(80000);
  const [contributions, setContributions] = useState<Record<string, number>>(
    {}
  );
  const [currentTotals, setCurrentTotals] = useState<Record<string, number>>(
    {}
  );

  const accounts = ACCOUNT_INFO.map((a) => ({
    ...a,
    startingBalance: currentTotals[a.name] || 0,
    yearlyContribution: contributions[a.name] || 0,
  }));

  const amountSum = accounts.reduce(
    (total, account) => total + account.startingBalance,
    0
  );
  const contributionsSum = accounts.reduce(
    (total, account) => total + account.yearlyContribution,
    0
  );

  const retirementAge =
    spendingAmount > 0 && amountSum + contributionsSum > 0
      ? age + getYearsToRetire(accounts, spendingAmount)
      : null;

  const costFIretirementAge =
    spendingAmount > 0 && amountSum > 0
      ? age +
        getYearsToRetire(
          accounts.map((a) => ({ ...a, yearlyContribution: 0 })),
          spendingAmount
        )
      : null;

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
          <Text>I spend</Text>
          <CurrencyInput value={spendingAmount} setValue={setSpendingAmount} />
          <Text>every year</Text>
        </HStack>
        {accounts.map(({ name, startingBalance, yearlyContribution }, i) => (
          <HStack>
            <Text>I have</Text>
            <CurrencyInput
              value={startingBalance}
              setValue={(v) =>
                setCurrentTotals({ ...currentTotals, [name]: v })
              }
            />
            <Text>in {name}, contributing</Text>
            <CurrencyInput
              value={yearlyContribution}
              setValue={(v) =>
                setContributions({ ...contributions, [name]: v })
              }
            />
            <Text>yearly.</Text>
          </HStack>
        ))}
        {retirementAge &&
          (retirementAge <= age ? (
            <>
              <Text fontSize="xx-large">You can retire now.</Text>
              <Text fontSize="x-large">
                Your net worth is{" "}
                {formatAsCurrency(
                  Math.round(netWorthOverTimeInflationAdjusted(0, accounts))
                )}
                .
              </Text>
            </>
          ) : (
            <>
              <Text fontSize="xx-large">
                At this rate, you can retire at {Math.floor(retirementAge)}.
              </Text>
              <Text fontSize="x-large">
                Your net worth will be{" "}
                {formatAsCurrency(
                  Math.round(
                    netWorthOverTimeInflationAdjusted(
                      retirementAge - age,
                      accounts
                    )
                  )
                )}{" "}
                in today's dollars.
              </Text>
              {costFIretirementAge && (
                <Text fontSize="x-large">
                  You can retire at {Math.round(costFIretirementAge)} with just
                  your current savings.
                </Text>
              )}
            </>
          ))}
      </VStack>
    </ChakraProvider>
  );
};
