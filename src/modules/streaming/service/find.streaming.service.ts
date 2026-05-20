import {Inject, Injectable} from '@nestjs/common';
import {ListStreamingDto} from "../dto/ListStreaming.dto";
import {FindOptions} from "../../../api/model/FindOptions";
import {StreamingDao} from "../dao/streaming.dao";

@Injectable()
export class FindStreamingService {
    constructor(
        @Inject('streamingDaoImpl')
        private readonly streamingDaoImpl: StreamingDao
    ) {
    }

    async find(options:FindOptions): Promise<ListStreamingDto> {
        return this.streamingDaoImpl.find(options)
    }
}

