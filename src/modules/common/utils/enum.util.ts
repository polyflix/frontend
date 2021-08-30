export const getEnumValues = (enumeration: any) => {
  return Object.keys(enumeration).map((key) => enumeration[key]);
};

export const getEnumEntries = (enumeration: any): [string, any][] => {
  return Object.keys(enumeration)
    .filter((element) => isNaN(Number(element)))
    .map((element) => [element, enumeration[element]]);
};
