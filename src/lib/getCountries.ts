// lib/getCountries.ts
import countries from "world-countries";

export const getCountries = () => {
  return countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
  }));
};
