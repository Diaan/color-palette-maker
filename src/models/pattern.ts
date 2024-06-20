import { PickedColor } from "./color";

export type PatternBase = { 
  name: string; 
  folder: string, 
  colorAmount?:string,
  thumbnail: string
};

export type Pattern = PatternBase & { 
  colors: PatternColor[], 
  patternFile:string, 
  designer: string, 
  url:string
};

export type PatternColor = {
  base64: string,
  id:string,
  name: string,
  required:number[],
  default: PickedColor,
  pickedColor:PickedColor
}
