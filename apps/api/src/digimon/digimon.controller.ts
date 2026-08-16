import { Controller, Get, Param, Query } from '@nestjs/common';
import { DigimonService } from './digimon.service';

@Controller('digimon')
export class DigimonController {
  constructor(private readonly digimon: DigimonService) {}
  @Get() list(@Query('q') q?:string,@Query('stage') stage?:string,@Query('attribute') attribute?:string,@Query('type') type?:string,@Query('dlc') dlc?:string,@Query('take') take?:string) { return this.digimon.list(q,stage,attribute,type,dlc,take); }
  @Get('facets') facets(){ return this.digimon.facets(); }
  @Get('status') status(){ return this.digimon.status(); }
  @Get('snapshot') snapshot(){ return this.digimon.snapshot(); }
  @Get(':slug') bySlug(@Param('slug') slug:string){ return this.digimon.bySlug(slug); }
}
