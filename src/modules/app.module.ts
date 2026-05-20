import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamingModule } from './streaming/streaming.module';
import {PostgreConnectionModule} from "./PostgreConnectionModule";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PostgreConnectionModule,
        StreamingModule,
    ],
})
export class ApplicationModule {}