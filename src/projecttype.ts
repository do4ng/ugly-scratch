export interface ProjectJsonType {
  targets: sprite[];
  monitors: any[];
  extensions: any[];
  meta: {
    semver: string;
    vm: string;
    agent: string;
  };
}

export interface costume {
  assetId: string;
  name: string;
  md5ext: string;
  dataFormat: string;
  rotationCenterX: number;
  rotationCenterY: number;
}

export interface sound {
  assetId: string;
  name: string;
  dataFormat: string;
  format: string;
  rate: number;
  sampleCount: number;
  md5ext: string;
}

export interface blockObj {
  opcode: string;
  next: string | null;
  parent: string | null;
  inputs: object;
  fields: object;
  shadow: boolean;
  topLevel: boolean;
  x: number;
  y: number;
  mutation?: object;
}

export interface block {
  [key: string]: blockObj;
}

export interface sprite {
  isStage: boolean;
  name: string;
  variables: object;
  lists: object;
  broadcasts: object;
  blocks: block;
  comments: object;
  currentCostume: number;
  costumes: costume[];
  sounds: sound[];
  volume: number;
  layerOrder: number;
  tempo: number;
  videoState: string;
  textToSpeechLanguage: any;
}
