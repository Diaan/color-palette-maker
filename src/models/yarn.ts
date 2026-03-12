export type YarnBase = { 
  company: string;
  name: string; 
  folder: string 
  colorAmount: number;
};

export type Yarn = YarnBase & { 
  weight: YarnWeight;
  runningLength: number;
}
 
export type YarnWeight = 'dk'|'bulky'|'worsted'|'sport';

export type YarnColor = {
  image?: string;
  name: string;
  color: string;
  yarn: string;
}
