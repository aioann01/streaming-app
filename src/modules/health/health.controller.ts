import {
    Controller,
    Get,
} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
@Controller('health')
export class HealthController {

    @Get()
    @ApiTags('Health')
    async health(): Promise<any> {
        return {'status':'Success'};
    }
}
