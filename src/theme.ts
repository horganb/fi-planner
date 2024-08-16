import { numberInputAnatomy } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(numberInputAnatomy.keys);

export const theme = extendTheme({
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Georgia, serif",
    mono: "Menlo, monospace",
  },
  components: {
    Select: defineStyleConfig({
      defaultProps: { variant: "filled" },
    }),
    Text: defineStyleConfig({
      baseStyle: {
        fontSize: "xl",
      },
    }),
    NumberInput: defineMultiStyleConfig({
      defaultProps: {
        variant: "filled",
      },
      baseStyle: definePartsStyle({
        root: {
          display: "inline-block",
          w: 24,
        },
        field: {
          h: 8,
          p: 1,
        },
      }),
    }),
  },
});
