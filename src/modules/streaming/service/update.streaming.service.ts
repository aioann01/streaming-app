import {Inject, Injectable} from '@nestjs/common';
import {StreamingDao} from "../dao/streaming.dao";
import {GetStreamingDetailsDto} from "../dto/GetStreamingDetails.dto";
import {UpdateStreamingDto} from "../dto/UpdateStreaming.dto";

@Injectable()
export class UpdateStreamingService {
    constructor(
        @Inject('streamingDaoImpl')
        private readonly streamingDaoImpl: StreamingDao
    ) {
    }

    async update(id:number, dto:UpdateStreamingDto): Promise<GetStreamingDetailsDto> {
        return this.streamingDaoImpl.update(id, dto);
    }
}

