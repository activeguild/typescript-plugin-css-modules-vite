export type Options = {
  root: string;
};

export type AdditionalData =
  | string
  | ((source: string, filename: string) => string);

export type Log = (logText: string) => void;
