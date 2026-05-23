import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Header,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, UseGuards,
} from '@nestjs/common';
import {CreateStreamingService} from "./service/create.streaming.service";
import {DeleteStreamingService} from "./service/delete.streaming.service";
import {FindStreamingService} from "./service/find.streaming.service";
import {UpdateStreamingService} from "./service/update.streaming.service";
import {GetStreamingService} from "./service/get.streaming.service";
import {GetStreamingDetailsDto} from "./dto/GetStreamingDetails.dto";
import {ListStreamingDto} from "./dto/ListStreaming.dto";
import {UpdateStreamingDto} from "./dto/UpdateStreaming.dto";
import {CreateStreamingDto} from "./dto/CreateStreaming.dto";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery, ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {CreateLocationHeader} from "../../api/interceptor/location.interceptor";
import {AddTotalCountHeader} from "../../api/interceptor/totalCount.interceptor";
import {ParseSortCriteriaPipe} from "../../api/pipe/sort.pipe";
import {SortOptions} from "../../api/model/SortOptions";
import {ParseFiltersPipe} from "../../api/pipe/filters.pipe";
import {APPLICATION_JSON_CONTENT_TYPE, DEFAULT_LIMIT, HTTP_HEADERS} from "../../utils/Constants";
import {STREAMING_MODULE_CONSTANTS} from "./streaming.constants";
import {
    createStreamingDescription,
    deleteStreamingDescription,
    findStreamingsDescription,
    getStreamingDescription,
    queryParams,
    updateStreamingDescription
} from "./streamingSwaggerDocumentation";
import {GetStreamingDto} from "./dto/GetStreaming.dto";
import {AdvGuard} from "../../api/guards/auth.guard";
import {UserRole} from "../auth/model/UserRoles";

@Controller(STREAMING_MODULE_CONSTANTS.STREAMING_ROUTE)
export class StreamingController {
    constructor(private readonly createStreamingService: CreateStreamingService,
                private readonly deleteStreamingService: DeleteStreamingService,
                private readonly updateStreamingService: UpdateStreamingService,
                private readonly getStreamingService: GetStreamingService,
                private readonly findStreamingService: FindStreamingService) {}

    @ApiOperation({
        description: createStreamingDescription,
        summary:'Creates a Streaming'
    })
    @ApiCreatedResponse({
        description:'Created',
        type: GetStreamingDetailsDto
    })
    @ApiBadRequestResponse({
        description:'Bad Request',
        type:Error
    })
    @ApiForbiddenResponse({
        description:'Forbidden',
        type:Error
    })
    @ApiUnauthorizedResponse({
        description:'Unauthorized',
        type:Error
    })
    @ApiInternalServerErrorResponse({
        description:'Internal Server Error',
        type:Error
    })
    @HttpCode(HttpStatus.CREATED)
    @Header(HTTP_HEADERS.CONTENT_TYPE, APPLICATION_JSON_CONTENT_TYPE)
    @ApiBearerAuth('jwt')
    @ApiTags('Streaming')
    @Post()
    @CreateLocationHeader(STREAMING_MODULE_CONSTANTS.STREAMING_ROUTE)
    @UseGuards(AdvGuard([UserRole.ADMIN]))
    async create(
        @Body() body: CreateStreamingDto,
    ): Promise<GetStreamingDetailsDto> {
        return this.createStreamingService.create(body);
    }


    @ApiOkResponse({
        description: 'Success',
        type: GetStreamingDto,
        isArray:true
    })
    @ApiBadRequestResponse({
        description:'Bad Request',
        type:Error
    })
    @ApiForbiddenResponse({
        description:'Forbidden',
        type:Error
    })
    @ApiUnauthorizedResponse({
        description:'Unauthorized',
        type:Error
    })
    @ApiInternalServerErrorResponse({
        description:'Internal Server Error',
        type:Error
    })
    @HttpCode(HttpStatus.OK)
    @ApiQuery(queryParams.Page)
    @ApiQuery(queryParams.Sort)
    @ApiQuery(queryParams.Limit)
    @Header(HTTP_HEADERS.CONTENT_TYPE, APPLICATION_JSON_CONTENT_TYPE)
    @UseGuards(AdvGuard([UserRole.ADMIN, UserRole.AGENT]))
    @ApiBearerAuth('jwt')
    @ApiTags('Streaming')
    @Get()
    @ApiOperation({
        description:findStreamingsDescription,
        summary:'List or Find Streamings'
    })
    @AddTotalCountHeader('streamings')
    async find(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page:number,
        @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe) limit:number,
        @Query(ParseFiltersPipe) filters?:any,
        @Query('sort', ParseSortCriteriaPipe ) sort?:SortOptions,
    ): Promise<ListStreamingDto> {
        return this.findStreamingService.find({
            query: filters,
            sort:sort,
            page:page,
            limit:limit
        });
    }

    @ApiOkResponse({
        description: 'Retrieved successfully',
        type: GetStreamingDetailsDto
    })
    @ApiNotFoundResponse({
        description:'Not Found',
        type:Error
    })
    @ApiForbiddenResponse({
        description:'Forbidden',
        type:Error
    })
    @ApiUnauthorizedResponse({
        description:'Unauthorized',
        type:Error
    })
    @ApiInternalServerErrorResponse({
        description:'Internal Server Error',
        type:Error
    })
    @ApiOperation({
        description:getStreamingDescription,
        summary:'Get a Streaming'
    })
    @HttpCode(HttpStatus.OK)
    @Header(HTTP_HEADERS.CONTENT_TYPE, APPLICATION_JSON_CONTENT_TYPE)
    @UseGuards(AdvGuard([UserRole.ADMIN, UserRole.AGENT]))
    @ApiTags('Streaming')
    @Get(':id')
    async get(@Param('id') id: string): Promise<GetStreamingDetailsDto> {
        return this.getStreamingService.get(+id);
    }

    @ApiOkResponse({
        description:'Updated Successfully',
        type:GetStreamingDetailsDto
    })
    @ApiNotFoundResponse({
        description:'Not Found',
        type:Error
    })
    @ApiForbiddenResponse({
        description:'Forbidden',
        type:Error
    })
    @ApiUnauthorizedResponse({
        description:'Unauthorized',
        type:Error
    })
    @ApiInternalServerErrorResponse({
        description:'Internal Server Error',
        type:Error
    })
    @ApiOperation({
        description:updateStreamingDescription,
        summary:'Updates partially a Streaming'
    })
    @HttpCode(HttpStatus.OK)
    @Header(HTTP_HEADERS.CONTENT_TYPE, APPLICATION_JSON_CONTENT_TYPE)
    @UseGuards(AdvGuard([UserRole.ADMIN]))
    @ApiBearerAuth('jwt')
    @ApiTags('Streaming')
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() body: UpdateStreamingDto,
    ): Promise<GetStreamingDetailsDto> {
        return this.updateStreamingService.update(+id, body);
    }


    @ApiNotFoundResponse({
        description:'Not Found',
        type:Error
    })
    @ApiForbiddenResponse({
        description:'Forbidden',
        type:Error
    })
    @ApiUnauthorizedResponse({
        description:'Unauthorized',
        type:Error
    })
    @ApiInternalServerErrorResponse({
        description:'Internal Server Error',
        type:Error
    })
    @ApiOperation({
        description:deleteStreamingDescription,
        summary:'Delete a Streaming'
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Header(HTTP_HEADERS.CONTENT_TYPE, APPLICATION_JSON_CONTENT_TYPE)
    @Delete(':id')
    @UseGuards(AdvGuard([UserRole.ADMIN]))
    @ApiBearerAuth('jwt')
    @ApiTags('Streaming')
    @ApiNoContentResponse({description:'Deleted successfully'})
    async delete(@Param('id') id: string): Promise<void> {
        return this.deleteStreamingService.delete(+id);
    }
}
