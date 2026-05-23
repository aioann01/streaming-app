import {Inject, Injectable} from '@nestjs/common';
import {CreateStreamingDto} from "../dto/CreateStreaming.dto";
import {StreamingDao} from "../dao/streaming.dao";
import {GetStreamingDetailsDto} from "../dto/GetStreamingDetails.dto";

@Injectable()
export class CreateStreamingService {
    constructor(
        @Inject('streamingDaoImpl')
        private readonly streamingDaoImpl: StreamingDao
    ) {}

    async create(dto: CreateStreamingDto): Promise<GetStreamingDetailsDto> {
        return this.streamingDaoImpl.create(dto);
    }

}

