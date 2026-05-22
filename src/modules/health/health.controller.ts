import {
    Controller,
    Get,
} from '@nestjs/common';
@Controller('health')
export class HealthController {

    @Get()
    async health(): Promise<any> {
        return {'status':'Success'};
    }
}
