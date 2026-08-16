import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

const SESSION_DAYS = 30;
function hashPassword(password:string, salt=randomBytes(16).toString('hex')) {
  const key=scryptSync(password,salt,64).toString('hex');
  return `${salt}:${key}`;
}
function verifyPassword(password:string, stored:string){
  const [salt,keyHex]=stored.split(':');
  if(!salt||!keyHex) return false;
  const actual=scryptSync(password,salt,64);
  const expected=Buffer.from(keyHex,'hex');
  return actual.length===expected.length && timingSafeEqual(actual,expected);
}
function tokenHash(token:string){return createHash('sha256').update(token).digest('hex')}

@Injectable()
export class AuthService {
  constructor(private readonly prisma:PrismaService){}
  private cleanUsername(v:string){const x=(v??'').trim().toLowerCase();if(!/^[a-z0-9_.-]{3,40}$/.test(x))throw new BadRequestException('Username must be 3-40 characters: letters, numbers, dot, dash or underscore.');return x}
  private validatePassword(v:string){if((v??'').length<10)throw new BadRequestException('Password must contain at least 10 characters.');}
  private async createSession(userId:string){
    const token=randomBytes(32).toString('base64url');
    const expiresAt=new Date(Date.now()+SESSION_DAYS*86400000);
    await this.prisma.session.create({data:{userId,tokenHash:tokenHash(token),expiresAt}});
    return {token,expiresAt};
  }
  async register(username:string,password:string){
    username=this.cleanUsername(username);this.validatePassword(password);
    if(await this.prisma.user.findUnique({where:{username}}))throw new BadRequestException('Username already exists.');
    const user=await this.prisma.user.create({data:{username,passwordHash:hashPassword(password),state:{create:{}}},select:{id:true,username:true,createdAt:true}});
    return {user,...await this.createSession(user.id)};
  }
  async login(username:string,password:string){
    username=this.cleanUsername(username);
    const user=await this.prisma.user.findUnique({where:{username}});
    if(!user||!verifyPassword(password,user.passwordHash))throw new UnauthorizedException('Invalid username or password.');
    return {user:{id:user.id,username:user.username,createdAt:user.createdAt},...await this.createSession(user.id)};
  }
  async authenticate(authHeader?:string){
    const token=authHeader?.startsWith('Bearer ')?authHeader.slice(7):'';
    if(!token)throw new UnauthorizedException('Missing bearer token.');
    const session=await this.prisma.session.findUnique({where:{tokenHash:tokenHash(token)},include:{user:{select:{id:true,username:true,createdAt:true}}}});
    if(!session||session.expiresAt<=new Date())throw new UnauthorizedException('Session expired or invalid.');
    return {token,session,user:session.user};
  }
  async me(authHeader?:string){return (await this.authenticate(authHeader)).user}
  async logout(authHeader?:string){const {session}=await this.authenticate(authHeader);await this.prisma.session.delete({where:{id:session.id}});return {ok:true}}
}
