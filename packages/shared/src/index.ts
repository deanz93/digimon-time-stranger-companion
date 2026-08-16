export const STAGE_ORDER = [
  'In-Training I','In-Training II','Rookie','Champion','Champion-Grade Armor','Champion-Grade Hybrid',
  'Ultimate','Ultimate-Grade Hybrid','Mega','Mega-Grade Armor','Mega-Grade Hybrid','Mega+','Update'
] as const;

export type DigimonStage = typeof STAGE_ORDER[number] | string;
export type DigimonAttribute = 'Vaccine'|'Data'|'Virus'|'Free'|'Variable'|'Unknown'|'No Data'|string;

export interface DigimonSummary {
  id:number; fieldGuideNo?:number|null; name:string; slug:string; stage:DigimonStage;
  attribute:DigimonAttribute; type?:string|null; imageUrl?:string|null; isDlc?:boolean;
}

export interface EvolutionRequirement {
  level?:number|null; hp?:number|null; sp?:number|null; atk?:number|null; def?:number|null;
  int?:number|null; spi?:number|null; speed?:number|null; talent?:number|null; bond?:number|null;
  agentRank?:number|null; special?:string|null;
}
