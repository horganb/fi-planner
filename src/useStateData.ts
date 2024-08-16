import { useEffect, useState } from "react";
import { useCsv } from "./useCsv";
import { TaxBracket } from "./types";

type StateBracketData = {
  State: string;
  "Single Filer Brackets": string;
  "Single Filer Rates": string;
};

type AllStateData = Record<string, TaxBracket>;

const convertToNum = (currency: string) => {
  return Number(currency.replace(/[^0-9.-]+/g, ""));
};

export const useStateData = () => {
  const stateTaxBrackets: null | Array<StateBracketData> =
    useCsv("state_tax.csv");
  const [allStateData, setAllStateData] = useState<AllStateData>();
  useEffect(() => {
    const stateData: AllStateData = {};
    stateTaxBrackets?.forEach((stateTaxBracket) => {
      const stateName = stateTaxBracket.State.split(" (")[0];
      if (!stateData[stateName]) stateData[stateName] = {};
      stateData[stateName][
        convertToNum(stateTaxBracket["Single Filer Brackets"])
      ] = convertToNum(stateTaxBracket["Single Filer Rates"]);
    });
    setAllStateData(stateData);
  }, [stateTaxBrackets]);
  return allStateData;
};
