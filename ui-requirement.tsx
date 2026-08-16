type R={level?:number|null;hp?:number|null;sp?:number|null;atk?:number|null;def?:number|null;int?:number|null;spi?:number|null;speed?:number|null;talent?:number|null;bond?:number|null;agentRank?:number|null;special?:string|null};
type Partner={slug?:string;name?:string;personality?:string};
type Special={jogressPartners?:Partner[];requiredItem?:string|{name?:string};agentSkills?:unknown;[key:string]:unknown};

function parseSpecial(value?:string|null):Special|null{
  if(!value)return null;
  try{const parsed=JSON.parse(value);return parsed&&typeof parsed==='object'?parsed:null}catch{return null}
}
function readable(value:unknown):string{
  if(typeof value==='string')return value;
  if(Array.isArray(value))return value.map(readable).join(', ');
  if(value&&typeof value==='object')return Object.entries(value as Record<string,unknown>).map(([k,v])=>`${k}: ${readable(v)}`).join(', ');
  return String(value??'');
}

export default function Requirement({r}:{r:R}){
  const vals=[['Rank',r.agentRank],['Lv',r.level],['HP',r.hp],['SP',r.sp],['ATK',r.atk],['DEF',r.def],['INT',r.int],['SPI',r.spi],['SPD',r.speed],['Talent',r.talent],['Bond',r.bond]].filter(x=>x[1]!=null);
  const special=parseSpecial(r.special);
  const partners=special?.jogressPartners?.filter(p=>p?.name||p?.slug)??[];
  const item=special?.requiredItem;
  const agentSkills=special?.agentSkills;
  const other=special?Object.entries(special).filter(([k])=>!['jogressPartners','requiredItem','agentSkills'].includes(k)):[];
  const hasAny=vals.length||partners.length||item||agentSkills||other.length||(!special&&r.special);
  return <div className="requirements"><div className="req">{vals.map(([k,v])=><span key={String(k)}><b>{k}</b> {v}</span>)}</div>{partners.length>0&&<div className="jogress-requirement"><div className="jogress-label"><span className="jogress-icon">J</span><span><strong>Jogress required</strong><small>Combine these Digimon with the listed personalities</small></span></div><div className="jogress-partners">{partners.map((p,index)=><span className="jogress-partner" key={`${p.slug??p.name}-${index}`}><b>{p.name??p.slug}</b>{p.personality&&<small>{p.personality} personality</small>}{index<partners.length-1&&<i>+</i>}</span>)}</div></div>}{Boolean(item)&&<div className="special-requirement"><b>Required item</b><span>{typeof item==='string'?item:item?.name??readable(item)}</span></div>}{Boolean(agentSkills)&&<div className="special-requirement"><b>Agent Skills</b><span>{readable(agentSkills)}</span></div>}{other.map(([key,value])=><div className="special-requirement" key={key}><b>{key.replace(/([A-Z])/g,' $1')}</b><span>{readable(value)}</span></div>)}{!special&&r.special&&<div className="special-requirement"><b>Special requirement</b><span>{r.special}</span></div>}{!hasAny&&<div className="req"><span>No requirement recorded</span></div>}</div>
}
