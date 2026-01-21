
export enum Framework {
  STANDALONE = 'Standalone',
  ESX = 'ESX',
  QBCORE = 'QBCore'
}

export interface ScriptFile {
  name: string;
  content: string;
  language: string;
}

export interface ScriptMarketing {
  shortDescription: string;
  fullDescription: string;
  keyFeatures: string[];
}

export interface GeneratedScript {
  id: string;
  title: string;
  description: string;
  framework: Framework;
  files: ScriptFile[];
  installationSteps?: string[];
  marketing?: ScriptMarketing;
  youtubeUrl?: string;
  createdAt: number;
}

export interface GenerationRequest {
  prompt: string;
  framework: Framework;
}
