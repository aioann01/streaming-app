import {IsString, IsNotEmpty, Length, IsEmail, IsEnum, Matches} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {UserRole} from "../model/UserRoles";

export class UserRegisterDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Length(5, 100)
    @ApiProperty({ description:'Email for user', example: 'andreaio@gmail.com', required: true, type:String })
    email: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    @IsNotEmpty()
    @Length(6, 100)
    @ApiProperty({ description: 'Password for user', example:'xxxxxx', required: true, type:String })
    password: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    @ApiProperty({ description: 'Role Of User', enum : UserRole, example: UserRole.AGENT,required: true, type:String  })
    role: UserRole;

}
