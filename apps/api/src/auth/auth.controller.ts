import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController{
  constructor(private readonly auth:AuthService){}
  @Post('register') register(@Body() b:{username:string,password:string}){return this.auth.register(b.username,b.password)}
  @Post('login') login(@Body() b:{username:string,password:string}){return this.auth.login(b.username,b.password)}
  @Get('me') me(@Headers('authorization') a?:string){return this.auth.me(a)}
  @Post('logout') logout(@Headers('authorization') a?:string){return this.auth.logout(a)}
}
