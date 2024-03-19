import { PaletteColor } from "..";

declare global {
  interface GlobalEventHandlersEventMap {
    'cp-select-color': CpSelectColorEvent;
  }
}

export type CpSelectColorEvent = CustomEvent<PaletteColor>;
