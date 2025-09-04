import { DialogPayloadMap } from "./dialog_type";

export type OrderDetailsSummary<
  K extends keyof DialogPayloadMap = keyof DialogPayloadMap
> = {
  [Key in K]: {
    type: Key;
    payload: DialogPayloadMap[Key];
  };
}[K]

export type DialogHandlers = {
  [K in keyof DialogPayloadMap]: (payload: DialogPayloadMap[K]) => DialogPayloadMap[keyof DialogPayloadMap] | null;
};

