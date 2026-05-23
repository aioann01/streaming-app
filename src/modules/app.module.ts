import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StreamingModule } from './streaming/streaming.module';
import {PostgreConnectionModule} from "./PostgreConnectionModule";
import {HealthModule} from "./health/health.module";
import {AuthModule} from "./auth/auth.module";
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {THROTTLING_REQUESTS, THROTTLING_REQUESTS_PERIOD} from "../utils/Constants";
import { APP_GUARD} from '@nestjs/core/constants';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PostgreConnectionModule,
        StreamingModule,
        HealthModule,
        AuthModule,
        ThrottlerModule.forRoot({
            ttl: THROTTLING_REQUESTS_PERIOD,
            limit: THROTTLING_REQUESTS,
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        }
    ],
})
export class ApplicationModule {}