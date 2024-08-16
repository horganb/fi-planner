import { parse } from "csv-parse/sync";
import { useEffect, useState } from "react";

export const useCsv = (filename: string) => {
  const [parsedCsv, setParsedCsv] = useState<Array<any> | null>(null);

  useEffect(() => {
    fetch(filename).then((r) =>
      r.text().then((t) =>
        setParsedCsv(
          parse(t, {
            columns: true,
            skip_empty_lines: true,
          })
        )
      )
    );
  }, [filename]);

  return parsedCsv;
};
