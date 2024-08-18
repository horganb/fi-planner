export const formatAsCurrency = (val: number) =>
  `$` +
  val
    .toString()
    .split(/(?=(?:\d{3})+$)/)
    .join(",");
