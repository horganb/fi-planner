import {
  ChakraProvider,
  HStack,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import { theme } from "./theme";
import { parse } from "csv-parse/sync";
const input = `
"key_1","key_2"
"value 1","value 2"
`;
let output = "hi";
// parse(input);

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <VStack>
        <HStack>
          <Text fontSize="xl">I am </Text>
          <NumberInput
            defaultValue={40}
            min={1}
            max={150}
            w={10}
            display="inline-block"
          >
            <NumberInputField p={1} textAlign="center" />
          </NumberInput>
          <Text fontSize="xl">years old</Text>
        </HStack>
        <Text fontSize="xl">I live in [state]</Text>
        {/* <Text fontSize="xl">{parse(input)}</Text> */}
      </VStack>
    </ChakraProvider>
  );
};
