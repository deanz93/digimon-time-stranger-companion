import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvolutionService {
  constructor(private readonly prisma: PrismaService) {}

  async graph(slug:string, depth=3) {
    const start=await this.prisma.digimon.findUnique({where:{slug}});
    if(!start) throw new NotFoundException('Digimon not found');
    const nodes=new Map<number,unknown>([[start.id,start]]); const edgeMap=new Map<number,unknown>(); let frontier=[start.id]; const seen=new Set(frontier);
    for(let i=0;i<Math.min(Math.max(depth,1),7);i++){
      if(!frontier.length) break;
      const found=await this.prisma.evolution.findMany({where:{OR:[{fromDigimonId:{in:frontier}},{toDigimonId:{in:frontier}}]},include:{fromDigimon:true,toDigimon:true}});
      const next=new Set<number>();
      for(const e of found){ edgeMap.set(e.id,e); nodes.set(e.fromDigimon.id,e.fromDigimon); nodes.set(e.toDigimon.id,e.toDigimon); for(const id of [e.fromDigimon.id,e.toDigimon.id]) if(!seen.has(id)){seen.add(id);next.add(id);} }
      frontier=[...next];
    }
    return {nodes:[...nodes.values()],edges:[...edgeMap.values()]};
  }

  async shortestPath(fromSlug:string,toSlug:string,allowDevolution=true){
    const [from,to]=await Promise.all([this.prisma.digimon.findUnique({where:{slug:fromSlug}}),this.prisma.digimon.findUnique({where:{slug:toSlug}})]);
    if(!from||!to) throw new NotFoundException('Start or target Digimon not found');
    const all=await this.prisma.evolution.findMany(); const adj=new Map<number,Array<{id:number,edgeId:number,direction:'up'|'down'}>>();
    const add=(a:number,b:number,edgeId:number,direction:'up'|'down')=>adj.set(a,[...(adj.get(a)??[]),{id:b,edgeId,direction}]);
    for(const e of all){add(e.fromDigimonId,e.toDigimonId,e.id,'up'); if(allowDevolution)add(e.toDigimonId,e.fromDigimonId,e.id,'down');}
    const q=[from.id]; const prev=new Map<number,{id:number|null,edgeId?:number,direction?:'up'|'down'}>([[from.id,{id:null}]]);
    while(q.length){const cur=q.shift()!; if(cur===to.id)break; for(const n of adj.get(cur)??[]) if(!prev.has(n.id)){prev.set(n.id,{id:cur,edgeId:n.edgeId,direction:n.direction});q.push(n.id);}}
    if(!prev.has(to.id))return {path:[],steps:[]};
    const ids:number[]=[]; for(let cur:number|null=to.id;cur!==null;cur=prev.get(cur)?.id??null)ids.push(cur); ids.reverse();
    const digimon=await this.prisma.digimon.findMany({where:{id:{in:ids}}}); const byId=new Map(digimon.map(d=>[d.id,d]));
    const edgeIds=ids.slice(1).map(id=>prev.get(id)?.edgeId).filter((x):x is number=>!!x); const edges=await this.prisma.evolution.findMany({where:{id:{in:edgeIds}}}); const byEdge=new Map(edges.map(e=>[e.id,e]));
    return {path:ids.map(id=>byId.get(id)),steps:ids.slice(1).map((id,i)=>({from:byId.get(ids[i]),to:byId.get(id),direction:prev.get(id)?.direction,requirement:byEdge.get(prev.get(id)?.edgeId??-1)}))};
  }
}
