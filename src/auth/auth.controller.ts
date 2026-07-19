import { Controller, Post, Body, Get, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller()
export class AuthController{
    constructor(private readonly authService:AuthService){}

    @Post('register')
    register(@Body() registerDto:RegisterDto){
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() logindto:LoginDto){
        return this.authService.login(logindto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('get')
    getProfile(@Req() req:any){
        return req.user;
    }

}