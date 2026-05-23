import {IsString, IsNotEmpty, Length, IsEmail} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Length(5, 100)
    @ApiProperty({ description:'Email for user', example: 'andreaio@gmail.com', required: true, type:String })
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 100)
    @ApiProperty({ description: 'Password for user', example:'xxxxxx', required: true, type:String })
    password: string;
}
