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
import {CreateLocationHeader} from "../../api/interceptor/location.interceptor";
import {AddTotalCountHeader} from "../../api/interceptor/totalCount.interceptor";
import {ParseSortCriteriaPipe} from "../../api/pipe/sort.pipe";
import {SortOptions} from "../../api/model/SortOptions";
import {ParseFiltersPipe} from "../../api/pipe/filters.pipe";
import {STREAMING_MODULE_CONSTANTS} from "./streaming.constants";
@Controller(STREAMING_MODULE_CONSTANTS.STREAMING_ROUTE)
export class StreamingController {
    constructor(private readonly createStreamingService: CreateStreamingService,
                private readonly deleteStreamingService: DeleteStreamingService,
                private readonly updateStreamingService: UpdateStreamingService,
                private readonly getStreamingService: GetStreamingService,
                private readonly findStreamingService: FindStreamingService) {}

  
    @Post()
    @CreateLocationHeader(STREAMING_MODULE_CONSTANTS.STREAMING_ROUTE)
    async create(
        @Body() body: CreateStreamingDto,
    ): Promise<GetStreamingDetailsDto> {
        return this.createStreamingService.create(body);
    }

 
    @Get()
    @AddTotalCountHeader('streamings')
    async find(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page:number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit:number,
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

   
    @Get(':id')
    async getOne(@Param('id') id: string): Promise<GetStreamingDetailsDto> {
        return this.getStreamingService.get(+id);
    }

  
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() body: UpdateStreamingDto,
    ): Promise<GetStreamingDetailsDto> {
        return this.updateStreamingService.update(+id, body);
    }


    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.deleteStreamingService.delete(+id);
    }
}
