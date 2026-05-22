import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query, DefaultValuePipe, ParseIntPipe, HttpCode, HttpStatus, Header,
} from '@nestjs/common';
import {CreateStreamingService} from "./service/create.streaming.service";
import {DeleteStreamingService} from "./service/delete.streaming.service";
import { FindStreamingService } from "./service/find.streaming.service";
import {UpdateStreamingService} from "./service/update.streaming.service";
import {GetStreamingService} from "./service/get.streaming.service";
import {GetStreamingDetailsDto} from "./dto/GetStreamingDetails.dto";
import {ListStreamingDto} from "./dto/ListStreaming.dto";
import {UpdateStreamingDto} from "./dto/UpdateStreaming.dto";
import {CreateStreamingDto} from "./dto/CreateStreaming.dto";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse, ApiInternalServerErrorResponse,
    ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse,
    ApiOperation, ApiQuery, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {CreateLocationHeader} from "../../api/interceptor/location.interceptor";
import {AddTotalCountHeader} from "../../api/interceptor/totalCount.interceptor";
import {ParseSortCriteriaPipe} from "../../api/pipe/sort.pipe";
import {SortOptions} from "../../api/model/SortOptions";
import {ParseFiltersPipe} from "../../api/pipe/filters.pipe";
import {APPLICATION_JSON_CONTENT_TYPE, DEFAULT_LIMIT, HTTP_HEADERS} from "../../utils/Constants";
import {STREAMING_MODULE_CONSTANTS} from "./streaming.constants";
import {
    createStreamingDescription, deleteStreamingDescription,
    findStreamingsDescription, getStreamingDescription,
    queryParams, updateStreamingDescription
} from "./streamingSwaggerDocumentation";
import {GetStreamingDto} from "./dto/GetStreaming.dto";

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
    @Post()
    @CreateLocationHeader(STREAMING_MODULE_CONSTANTS.STREAMING_ROUTE)
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
    @Get()
    @ApiOperation({
        description:findStreamingsDescription,
        summary:'List or Find Streamings'
    })
    @AddTotalCountHeader('streamings')
    async findAll(
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
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<GetStreamingDetailsDto> {
        return this.getStreamingService.find(+id);
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
    @ApiNoContentResponse({description:'Deleted successfully'})
    async delete(@Param('id') id: string): Promise<void> {
        return this.deleteStreamingService.delete(+id);
    }
}
