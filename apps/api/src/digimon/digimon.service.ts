import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DigimonService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q?: string, stage?: string, attribute?: string, type?: string, dlc?: string, takeRaw?: string) {
    const take = Math.min(Math.max(Number(takeRaw ?? 100), 1), 500);
    return this.prisma.digimon.findMany({
      where: {
        ...(q ? { OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { type: { contains: q, mode: 'insensitive' as const } }
        ] } : {}),
        ...(stage ? { stage } : {}),
        ...(attribute ? { attribute } : {}),
        ...(type ? { type: { contains: type, mode: 'insensitive' as const } } : {}),
        ...(dlc === 'true' ? { isDlc: true } : dlc === 'false' ? { isDlc: false } : {})
      },
      orderBy: [{ fieldGuideNo: 'asc' }, { name: 'asc' }], take
    });
  }

  async bySlug(slug: string) {
    const found = await this.prisma.digimon.findUnique({
      where: { slug },
      include: {
        fromEdges: { include: { toDigimon: true }, orderBy: { toDigimonId: 'asc' } },
        toEdges: { include: { fromDigimon: true }, orderBy: { fromDigimonId: 'asc' } }
      }
    });
    if (!found) throw new NotFoundException('Digimon not found');
    return found;
  }

  async facets() {
    const [stageRows, attrRows, types, total, dlc] = await Promise.all([
      this.prisma.digimon.groupBy({ by:['stage'], _count:true }),
      this.prisma.digimon.groupBy({ by:['attribute'], _count:true }),
      this.prisma.digimon.groupBy({ by:['type'], _count:true, where:{ type:{ not:null } } }),
      this.prisma.digimon.count(), this.prisma.digimon.count({ where:{ isDlc:true } })
    ]);
    return {
      total, dlc,
      stages: stageRows.map(x=>({value:x.stage,count:x._count})),
      attributes: attrRows.map(x=>({value:x.attribute,count:x._count})),
      types: types.filter(x=>x.type).map(x=>({value:x.type!,count:x._count})).sort((a,b)=>a.value.localeCompare(b.value))
    };
  }

  async snapshot() {
    const [digimon, evolutions, version] = await Promise.all([
      this.prisma.digimon.findMany({ orderBy:{fieldGuideNo:'asc'} }),
      this.prisma.evolution.findMany({ orderBy:{id:'asc'} }),
      this.prisma.datasetVersion.findFirst({ where:{isActive:true}, orderBy:{createdAt:'desc'} })
    ]);
    return { generatedAt:new Date().toISOString(), version, digimon, evolutions };
  }

  async status() {
    const [version,total,evolutions,withImages,dlc] = await Promise.all([
      this.prisma.datasetVersion.findFirst({where:{isActive:true},orderBy:{createdAt:'desc'}}),
      this.prisma.digimon.count(), this.prisma.evolution.count(),
      this.prisma.digimon.count({where:{imageUrl:{not:null}}}),
      this.prisma.digimon.count({where:{isDlc:true}})
    ]);
    return {version,total,evolutions,withImages,dlc,checkedAt:new Date().toISOString()};
  }
}
