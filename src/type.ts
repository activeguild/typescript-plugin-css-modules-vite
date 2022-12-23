export type Options = {
  root: string;
};

export type AdditionalData =
  | string
  | ((source: string, filename: string) => string);

export type Log = (logText: string) => void;

export type CSSJSObj = Record<
  string,
  string | Record<string, string> | Record<string, Record<string, string>>[]
>;

export type GetParseCaseFunction = ((target: string) => string) | undefined;
