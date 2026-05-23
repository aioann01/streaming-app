import {UserRole} from "../model/UserRoles";
import {ApiProperty} from "@nestjs/swagger";

export class UserResponseDto {
    @ApiProperty({ description: 'Id of User', example: 1231,required: true, type:Number  })
    id: number;

    @ApiProperty({ description:'Email for user', example: 'andreaio@gmail.com', required: true, type:String })
    email: string;

    @ApiProperty({ description: 'Role Of User', enum : UserRole, example: UserRole.AGENT,required: true, type:String  })
    role: UserRole;
}