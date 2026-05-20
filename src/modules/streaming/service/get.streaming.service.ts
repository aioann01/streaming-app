import {Inject, Injectable} from '@nestjs/common';
import {StreamingDao} from "../dao/streaming.dao";
import {GetStreamingDetailsDto} from "../dto/GetStreamingDetails.dto";

@Injectable()
export class GetStreamingService {
    constructor(
        @Inject('streamingDaoImpl')
        private readonly streamingDaoImpl: StreamingDao
    ) {
    }

    async find(id:number): Promise<GetStreamingDetailsDto> {
        return this.streamingDaoImpl.findOne(id);
    }
}

