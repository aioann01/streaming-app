import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StreamingModule } from './streaming/streaming.module';
import {PostgreConnectionModule} from "./PostgreConnectionModule";
import {HealthModule} from "./health/health.module";
import {AuthModule} from "./auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PostgreConnectionModule,
        StreamingModule,
        HealthModule,
        AuthModule
    ],
})
export class ApplicationModule {}