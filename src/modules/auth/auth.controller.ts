import {
    Controller,
    Post,
    Body,
    HttpCode, HttpStatus, Header,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiForbiddenResponse, ApiInternalServerErrorResponse
    , ApiOkResponse,
    ApiOperation, ApiTags
} from "@nestjs/swagger";
import {APPLICATION_JSON_CONTENT_TYPE, HTTP_HEADERS} from "../../utils/Constants";
import {AuthService} from "./auth.service";
import {UserRegisterDto} from "./dto/UserRegister.dto";
import {UserLoginDto} from "./dto/UserLogin.dto";
import {UserResponseDto} from "./dto/UserResponse.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        description: "Registers a new User",
        summary:'Registers a User'
    })
    @ApiOkResponse({
        description:'User Registered',
        type: UserResponseDto
    })
    @ApiBadRequestResponse({
        description:'Bad Request',
        type:Error
    })
    @ApiForbiddenResponse({
        description:'Forbidden',
        type:Error
    })
    @ApiInternalServerErrorResponse({
        description:'Internal Server Error',
        type:Error
    })
    @HttpCode(HttpStatus.OK)
    @Header(HTTP_HEADERS.CONTENT_TYPE, APPLICATION_JSON_CONTENT_TYPE)
    @ApiTags('Auth')
    @Post("register")
    async register(
        @Body() body: UserRegisterDto,
    ): Promise<UserResponseDto> {
        return this.authService.register(body);
    }


    @ApiOkResponse({
        description: 'Successfully logged in',
        schema: {
            example: { access_token: 'jewt token' }
        }
    })
    @ApiBadRequestResponse({
        description:'Bad Request',
        type:Error
    })
    @ApiForbiddenResponse({
        description:'Forbidden',
        type:Error
    })
    @ApiInternalServerErrorResponse({
        description:'Internal Server Error',
        type:Error
    })
    @HttpCode(HttpStatus.OK)
    @Header(HTTP_HEADERS.CONTENT_TYPE, APPLICATION_JSON_CONTENT_TYPE)
    @Post("login")
    @ApiTags('Auth')
    @ApiOperation({
        description:"User login for token",
        summary:'User login for token'
    })
    async login(
        @Body() body: UserLoginDto,

    ): Promise<{ access_token: string }> {
        return this.authService.login(body);
    }

}
