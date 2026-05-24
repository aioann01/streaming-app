import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform {
    transform(value: string) {
        const val = Number(value);

        if (isNaN(val)) {
            throw new BadRequestException('Streaming Id must be a number');
        }

        return val;
    }
}