import {readFile,writeFile} from"node:fs/promises";
export type Digimon={number:number;slug:string;name:string;generation:string;attribute:string;type:string;basePersonality:string|null;ridable:boolean;stats:Record<string,{lv1:number;lv99:number}>;evolutionCondition:Record<string,unknown>;evolvesTo:string[];evolvesFrom:string[];devolvesFrom:string[]};
export type Dataset={meta:Record<string,unknown>&{recordCount:number};digimon:Record<string,Digimon>};
export const OUTPUT=new URL("../data/dataset.json",import.meta.url);
export const readJson=async<T>(p:string|URL)=>JSON.parse(await readFile(p,"utf8")) as T;
export const writeJson=async(p:string|URL,v:unknown)=>writeFile(p,JSON.stringify(v,null,2)+"\n","utf8");
export const entries=(d:Dataset)=>Object.values(d.digimon).sort((a,b)=>a.number-b.number);
