import { Controller, Get, Param, Query } from '@nestjs/common';
import { EvolutionService } from './evolution.service';
@Controller('evolution')
export class EvolutionController{
  constructor(private readonly evolution:EvolutionService){}
  @Get('graph/:slug') graph(@Param('slug')slug:string,@Query('depth')depth?:string){return this.evolution.graph(slug,Number(depth??3));}
  @Get('path') path(@Query('from')from:string,@Query('to')to:string,@Query('devolve')devolve?:string){return this.evolution.shortestPath(from,to,devolve!=='false');}
}
