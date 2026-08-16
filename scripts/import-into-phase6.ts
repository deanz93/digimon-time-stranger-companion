import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';

type Req={op:string;value:number};
type SourceMon={number:number;slug:string;name:string;generation:string;attribute:string;type:string;basePersonality:string|null;ridable:boolean;stats:Record<string,{lv1:number;lv99:number}>;evolutionCondition:{agentRank?:Req;stats?:Record<string,Req>;talent?:Req;bond?:Req;requiredItem?:unknown;agentSkills?:unknown;jogressPartners?:unknown;[key:string]:unknown};evolvesTo:string[]};
type Dataset={meta:{recordCount:number;sourceUrl?:string};digimon:Record<string,SourceMon>};
const prisma=new PrismaClient();
async function main(){
const path=process.argv[2];if(!path)throw new Error('Usage: tsx scripts/import-structured.ts /path/to/dataset.json');
const dataset=JSON.parse(await readFile(path,'utf8')) as Dataset;
const mons=Object.values(dataset.digimon).sort((a,b)=>a.number-b.number);
if(mons.length!==475||dataset.meta.recordCount!==475)throw new Error(`Refusing incomplete dataset: ${mons.length}`);
const stat=(m:SourceMon,k:string,level:'lv1'|'lv99')=>m.stats[k]?.[level];
const val=(r?:Req)=>r?.value;

try{
  for(const m of mons){
    await prisma.digimon.upsert({where:{slug:m.slug},update:{fieldGuideNo:m.number,name:m.name,stage:m.generation,attribute:m.attribute,type:m.type,basePersonality:m.basePersonality,ridable:m.ridable,hp1:stat(m,'HP','lv1'),sp1:stat(m,'SP','lv1'),atk1:stat(m,'ATK','lv1'),def1:stat(m,'DEF','lv1'),int1:stat(m,'INT','lv1'),spi1:stat(m,'SPI','lv1'),speed1:stat(m,'SPD','lv1'),hp99:stat(m,'HP','lv99'),sp99:stat(m,'SP','lv99'),atk99:stat(m,'ATK','lv99'),def99:stat(m,'DEF','lv99'),int99:stat(m,'INT','lv99'),spi99:stat(m,'SPI','lv99'),speed99:stat(m,'SPD','lv99'),isDlc:m.number>=452},create:{fieldGuideNo:m.number,slug:m.slug,name:m.name,stage:m.generation,attribute:m.attribute,type:m.type,basePersonality:m.basePersonality,ridable:m.ridable,hp1:stat(m,'HP','lv1'),sp1:stat(m,'SP','lv1'),atk1:stat(m,'ATK','lv1'),def1:stat(m,'DEF','lv1'),int1:stat(m,'INT','lv1'),spi1:stat(m,'SPI','lv1'),speed1:stat(m,'SPD','lv1'),hp99:stat(m,'HP','lv99'),sp99:stat(m,'SP','lv99'),atk99:stat(m,'ATK','lv99'),def99:stat(m,'DEF','lv99'),int99:stat(m,'INT','lv99'),spi99:stat(m,'SPI','lv99'),speed99:stat(m,'SPD','lv99'),isDlc:m.number>=452}});
  }
  const rows=await prisma.digimon.findMany({select:{id:true,slug:true}});const bySlug=new Map(rows.map(x=>[x.slug,x.id]));
  await prisma.evolution.deleteMany();let edgeCount=0;
  for(const from of mons)for(const toSlug of from.evolvesTo){const fromId=bySlug.get(from.slug),toId=bySlug.get(toSlug),to=dataset.digimon[toSlug];if(!fromId||!toId||!to)throw new Error(`Orphan edge ${from.slug} -> ${toSlug}`);const c=to.evolutionCondition,s=c.stats??{};const extras=Object.fromEntries(Object.entries(c).filter(([k])=>!['agentRank','stats','talent','bond'].includes(k)));await prisma.evolution.create({data:{fromDigimonId:fromId,toDigimonId:toId,hp:val(s.HP),sp:val(s.SP),atk:val(s.ATK),def:val(s.DEF),int:val(s.INT),spi:val(s.SPI),speed:val(s.SPD),talent:val(c.talent),bond:val(c.bond),agentRank:val(c.agentRank),special:Object.keys(extras).length?JSON.stringify(extras):null,sourceNote:'Structured 475-entry Grindosaur-derived snapshot'}});edgeCount++}
  await prisma.datasetVersion.updateMany({data:{isActive:false}});await prisma.datasetVersion.upsert({where:{version:'structured-475-2026-07-11'},update:{isActive:true,sourceName:'Grindosaur structured snapshot',sourceUrl:dataset.meta.sourceUrl,notes:`Imported ${mons.length} Digimon and ${edgeCount} verified evolution edges.`},create:{version:'structured-475-2026-07-11',gameVersion:'base + current verified DLC',isActive:true,sourceName:'Grindosaur structured snapshot',sourceUrl:dataset.meta.sourceUrl,notes:`Imported ${mons.length} Digimon and ${edgeCount} verified evolution edges.`}});
  const [digimonCount,evolutionCount,dlcCount]=await Promise.all([prisma.digimon.count(),prisma.evolution.count(),prisma.digimon.count({where:{isDlc:true}})]);console.log({digimonCount,evolutionCount,dlcCount});
}finally{await prisma.$disconnect()}
}
main().catch(error=>{console.error(error);process.exitCode=1});
