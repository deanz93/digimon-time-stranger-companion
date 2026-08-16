import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sample = [
  ['Kapurimon', 'kapurimon', 'Baby II', 'Free', 'Lesser'],
  ['Hagurumon', 'hagurumon', 'Rookie', 'Virus', 'Machine'],
  ['Kokuwamon', 'kokuwamon', 'Rookie', 'Data', 'Machine'],
  ['ToyAgumon', 'toyagumon', 'Rookie', 'Vaccine', 'Puppet'],
  ['Solarmon', 'solarmon', 'Rookie', 'Vaccine', 'Machine']
] as const;

async function main() {
  for (const [name, slug, stage, attribute, type] of sample) {
    await prisma.digimon.upsert({
      where: { slug },
      update: {},
      create: { name, slug, stage, attribute, type }
    });
  }

  const kapurimon = await prisma.digimon.findUniqueOrThrow({ where: { slug: 'kapurimon' } });
  const targets = await prisma.digimon.findMany({ where: { slug: { in: ['hagurumon', 'kokuwamon', 'toyagumon', 'solarmon'] } } });

  for (const target of targets) {
    await prisma.evolution.upsert({
      where: { fromDigimonId_toDigimonId: { fromDigimonId: kapurimon.id, toDigimonId: target.id } },
      update: {},
      create: {
        fromDigimonId: kapurimon.id,
        toDigimonId: target.id,
        agentRank: 1,
        def: target.slug === 'hagurumon' ? 200 : undefined
      }
    });
  }
}

main().finally(() => prisma.$disconnect());
