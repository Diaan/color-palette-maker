import { YarnColor, YarnBase } from "../models";

declare global {
  interface GlobalEventHandlersEventMap {
    'cp-select-color': CpSelectColorEvent;
    'cp-set-working-yarn': CpSetWorkingYarnEvent;
    'cp-select-yarn': CpSelectYarnEvent,
  }
}

export type CpSelectColorEvent = CustomEvent<YarnColor>;
export type CpSelectYarnEvent = CustomEvent<YarnBase>;
export type CpSetWorkingYarnEvent = CustomEvent<string>;
