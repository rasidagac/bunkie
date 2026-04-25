type ParentRule = {
  pattern: RegExp;
  resolve: (match: RegExpMatchArray) => string;
};

const RULES: ParentRule[] = [
  {
    pattern: /^\/groups\/([^/]+)\/expenses\/[^/]+\/?$/,
    resolve: (m) => `/groups/${m[1]}`,
  },
  {
    pattern: /^\/groups\/([^/]+)\/expenses\/?$/,
    resolve: (m) => `/groups/${m[1]}`,
  },
  {
    pattern: /^\/groups\/([^/]+)\/create\/?$/,
    resolve: (m) => `/groups/${m[1]}`,
  },
  {
    pattern: /^\/groups\/create\/?$/,
    resolve: () => `/groups`,
  },
  {
    pattern: /^\/groups\/[^/]+\/?$/,
    resolve: () => `/groups`,
  },
];

export function resolveParent(pathname: string): null | string {
  for (const rule of RULES) {
    const match = pathname.match(rule.pattern);
    if (match) return rule.resolve(match);
  }
  return null;
}
