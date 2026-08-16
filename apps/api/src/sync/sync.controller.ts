import { Body, Controller, Get, Headers, Put } from '@nestjs/common';import {PrismaService} from '../prisma/prisma.service';import {AuthService} from '../auth/auth.service';
@Controller('sync')
export class SyncController{
 constructor(private readonly prisma:PrismaService,private readonly auth:AuthService){}
 @Get() async get(@Headers('authorization') a?:string){const {user}=await this.auth.authenticate(a);return this.prisma.userState.upsert({where:{userId:user.id},create:{userId:user.id},update:{}})}
 @Put() async put(@Headers('authorization') a:string|undefined,@Body() b:{collection?:unknown;team?:unknown;favorites?:unknown;settings?:unknown}){const {user}=await this.auth.authenticate(a);return this.prisma.userState.upsert({where:{userId:user.id},create:{userId:user.id,collection:(b.collection??[]) as any,team:(b.team??[]) as any,favorites:(b.favorites??[]) as any,settings:(b.settings??{}) as any},update:{...(b.collection!==undefined?{collection:b.collection as any}:{}),...(b.team!==undefined?{team:b.team as any}:{}),...(b.favorites!==undefined?{favorites:b.favorites as any}:{}),...(b.settings!==undefined?{settings:b.settings as any}:{})}})}
}
