export type Goal={slug:string;name:string;completed:boolean;createdAt:string};
export type RecentItem={slug:string;name:string;viewedAt:string};
export type CheatWorkspace={platform?:'switch'|'ps5';switchBuild?:'retail'|'demo';switchCodes?:{id:string;name:string;code:string;buildId?:string}[];selectedSwitch?:string[];selectedPs5?:string[]};
export type CompanionSettings={goals?:Goal[];notes?:Record<string,string>;recent?:RecentItem[];missionProgress?:string[];cheatWorkspace?:CheatWorkspace};

function parse<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)??JSON.stringify(fallback))}catch{return fallback}}
export function getSettings():CompanionSettings{return parse('dts-settings-v1',{})}
export function setSettings(next:CompanionSettings){localStorage.setItem('dts-settings-v1',JSON.stringify(next));window.dispatchEvent(new Event('dts-state-changed'))}
export function getFavorites():string[]{return parse('dts-favorites-v1',[])}
export function toggleFavorite(slug:string){const next=new Set(getFavorites());next.has(slug)?next.delete(slug):next.add(slug);localStorage.setItem('dts-favorites-v1',JSON.stringify([...next]));window.dispatchEvent(new Event('dts-state-changed'));return next.has(slug)}
export function addGoal(slug:string,name:string){const settings=getSettings(),goals=settings.goals??[];if(!goals.some(g=>g.slug===slug))setSettings({...settings,goals:[...goals,{slug,name,completed:false,createdAt:new Date().toISOString()}]})}
export function trackRecent(slug:string,name:string){const settings=getSettings(),recent=(settings.recent??[]).filter(x=>x.slug!==slug);setSettings({...settings,recent:[{slug,name,viewedAt:new Date().toISOString()},...recent].slice(0,12)})}
