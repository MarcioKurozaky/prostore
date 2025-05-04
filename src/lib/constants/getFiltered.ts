// lib/utils/url.utils.ts

interface FilterParams {
  q: string;
  category: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
}

interface FilterOverrides {
  c?: string;
  s?: string;
  p?: string;
  r?: string;
  pg?: string;
}

export function getFilterUrl(
  currentParams: FilterParams,
  overrides: FilterOverrides
): string {
  const params = { ...currentParams };

  if (overrides.c) params.category = overrides.c;
  if (overrides.p) params.price = overrides.p;
  if (overrides.r) params.rating = overrides.r;
  if (overrides.pg) params.page = overrides.pg;
  if (overrides.s) params.sort = overrides.s;

  return `/search?${new URLSearchParams(params).toString()}`;
}
