import {Inject, Injectable, Logger} from '@nestjs/common';
import {StreamingDao} from "../dao/streaming.dao";

@Injectable()
export class DeleteStreamingService {
    constructor(
        @Inject('streamingDaoImpl')
        private readonly streamingDaoImpl: StreamingDao,
        private readonly logger:Logger
    ) {}

    async delete(id:number): Promise<void> {
        await this.streamingDaoImpl.delete(id);
        this.logger.log(`Deleted streaming item with id ${id}`)
    }

}

