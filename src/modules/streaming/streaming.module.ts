import {Logger, Module,} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {StreamingController} from "./streaming.controller";
import {CreateStreamingService} from "./service/create.streaming.service";
import {UpdateStreamingService} from "./service/update.streaming.service";
import {FindStreamingService} from "./service/find.streaming.service";
import {GetStreamingService} from "./service/get.streaming.service";
import {DeleteStreamingService} from "./service/delete.streaming.service";
import {StreamingPostgresDaoImpl} from "./dao/impl/streaming.postgres.dao.impl";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Streaming} from "./entity/Streaming.entity";


@Module({
    controllers: [StreamingController],
    providers: [
        CreateStreamingService,
        UpdateStreamingService,
        FindStreamingService,
        GetStreamingService,
        DeleteStreamingService,
        StreamingPostgresDaoImpl,
        Logger,
        {
            provide: 'streamingDaoImpl',
            useExisting:StreamingPostgresDaoImpl
        }
    ],
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Streaming])
    ],
    exports: [],
})
export class StreamingModule {
}
