import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();
const BASE='https://gamefaqs.gamespot.com/ps5/513530-digimon-story-time-stranger/faqs/82355';
const PAGES=[
  ['In-Training','in-training-i-and-ii-001-to-020'],['Rookie','rookie-021-to-080'],['Champion','champion-081-to-192'],
  ['Ultimate','ultimate-193-to-306'],['Mega','mega-307-to-426'],['Mega+','mega-plus-427-to-451'],['DLC','dlc-452-to-475']
] as const;

const slugify=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const clean=(s:string)=>s.replace(/\s+/g,' ').trim();
const num=(s:string,re:RegExp)=>{const m=s.match(re);return m?Number(m[1]):undefined};

function inferStage(no:number,name:string,page:string){
  if(no<=7)return 'In-Training I'; if(no<=20)return 'In-Training II'; if(no<=80)return 'Rookie';
  if(no<=178)return 'Champion'; if(no<=186)return 'Champion-Grade Armor'; if(no<=192)return 'Champion-Grade Hybrid';
  if(no<=304)return 'Ultimate'; if(no<=306)return 'Ultimate-Grade Hybrid'; if(no<=421)return 'Mega';
  if(no<=423)return 'Mega-Grade Armor'; if(no<=426)return 'Mega-Grade Hybrid'; if(no<=451)return 'Mega+';
  if(no<=475)return 'Mega+'; return name==='Terriermon Assistant'?'Update':page;
}

type Parsed={no:number;name:string;stage:string;attribute:string;type?:string;basePersonality?:string;ridable?:boolean;stats1?:number[];stats99?:number[];to:Array<{name:string,rank?:number,raw?:string}>;from:string[];isDlc:boolean};

function parsePage(html:string,pageLabel:string):Parsed[]{
  const $=cheerio.load(html); const out:Parsed[]=[];
  $('h4').each((_,h)=>{
    const name=clean($(h).text()); if(!name||/Overview|About|Full List/i.test(name))return;
    const section=$(h).nextUntil('h4'); const text=clean(section.text());
    const noMatch=text.match(/(?:No\.?|Field Guide)?\s*#?\s*(\d{1,3})/i);
    // GameFAQs detail pages often omit number inside each section. We assign later when missing.
    const tables=section.filter('table').add(section.find('table')); let attribute='Unknown',type: string|undefined;
    const firstText=clean(section.first().text()); const attr=firstText.match(/\b(Vaccine|Virus|Data|Free|Variable|Unknown|No Data)\b/i); if(attr)attribute=attr[1];
    const basePersonality=text.match(/Base Personality\s*([^|]+?)(?:Ridable|Traits|Skills)/i)?.[1]?.trim();
    const rid=text.match(/Ridable\s*(Yes|No)/i)?.[1];
    const traits=text.match(/Traits\s*(.+?)(?:Skills|Special Skill)/i)?.[1]?.trim(); if(traits)type=traits.split(/\s{2,}|\|/)[0].trim();
    const stats1Match=text.match(/Level 1\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);
    const stats99Match=text.match(/Level 99\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);
    const from:string[]=[]; const to:Array<{name:string,rank?:number,raw?:string}>=[];
    // Prefer links in rows labelled Evolves From/To because names with spaces remain intact.
    tables.find('tr').each((_,tr)=>{const cells=$(tr).find('th,td'); if(!cells.length)return; const label=clean($(cells[0]).text()); if(/^Evolves From/i.test(label))$(tr).find('a').each((_,a)=>{const n=clean($(a).text());if(n)from.push(n)}); if(/^Evolves To/i.test(label))$(tr).find('a').each((_,a)=>{const n=clean($(a).text());if(n)to.push({name:n})});});
    out.push({no:noMatch?Number(noMatch[1]):0,name,stage:pageLabel,attribute,type,basePersonality,ridable:rid?rid==='Yes':undefined,stats1:stats1Match?.slice(1).map(Number),stats99:stats99Match?.slice(1).map(Number),to,from,isDlc:pageLabel==='DLC'});
  });
  return out;
}

async function main(){
  const all:Parsed[]=[];
  for(const [label,path] of PAGES){const url=`${BASE}/${path}`;console.log('Fetching',url);const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 DTS-Companion-Importer/1.0'}});if(!r.ok)throw new Error(`${r.status} ${url}`);all.push(...parsePage(await r.text(),label));}
  // Field Guide ordering follows the section order in these seven pages.
  all.forEach((d,i)=>{if(!d.no)d.no=i+1;d.stage=inferStage(d.no,d.name,d.stage)});
  for(const d of all){const [hp1,sp1,atk1,def1,int1,spi1,speed1]=d.stats1??[];const[hp99,sp99,atk99,def99,int99,spi99,speed99]=d.stats99??[];await prisma.digimon.upsert({where:{slug:slugify(d.name)},update:{fieldGuideNo:d.no,name:d.name,stage:d.stage,attribute:d.attribute,type:d.type,basePersonality:d.basePersonality,ridable:d.ridable,hp1,sp1,atk1,def1,int1,spi1,speed1,hp99,sp99,atk99,def99,int99,spi99,speed99,isDlc:d.isDlc},create:{fieldGuideNo:d.no,name:d.name,slug:slugify(d.name),stage:d.stage,attribute:d.attribute,type:d.type,basePersonality:d.basePersonality,ridable:d.ridable,hp1,sp1,atk1,def1,int1,spi1,speed1,hp99,sp99,atk99,def99,int99,spi99,speed99,isDlc:d.isDlc}})}
  const byName=new Map((await prisma.digimon.findMany()).map(d=>[d.name.toLowerCase(),d])); let edges=0;
  for(const d of all){const from=byName.get(d.name.toLowerCase());if(!from)continue;for(const t of d.to){const target=byName.get(t.name.toLowerCase());if(!target)continue;await prisma.evolution.upsert({where:{fromDigimonId_toDigimonId:{fromDigimonId:from.id,toDigimonId:target.id}},update:{sourceNote:'GameFAQs Field Guide importer'},create:{fromDigimonId:from.id,toDigimonId:target.id,sourceNote:'GameFAQs Field Guide importer'}});edges++;}}
  await prisma.datasetVersion.updateMany({data:{isActive:false}});await prisma.datasetVersion.upsert({where:{version:'gamefaqs-live'},update:{isActive:true,sourceName:'GameFAQs Field Guide',sourceUrl:BASE,notes:`Imported ${all.length} entries; ${edges} evolution edges parsed.`},create:{version:'gamefaqs-live',isActive:true,sourceName:'GameFAQs Field Guide',sourceUrl:BASE,notes:`Imported ${all.length} entries; ${edges} evolution edges parsed.`}});
  console.log(`Imported ${all.length} Digimon and ${edges} evolution edges.`);
}
main().finally(()=>prisma.$disconnect());
