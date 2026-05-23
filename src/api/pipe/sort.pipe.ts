import {
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { SortOptions, SortOrder } from '../model/SortOptions';

@Injectable()
export class ParseSortCriteriaPipe implements PipeTransform {
    transform(sortQuery: any): SortOptions | undefined {
        if (!sortQuery) return undefined;

        const normalized = sortQuery.toLowerCase();

        const match = normalized.match(/^(.*)\.(asc|desc)$/);

        if (!match) {
            throw new BadRequestException({
                error:
                    'Invalid sort format. Use: field.asc or field.desc',
            });
        }

        const [, field, order] = match;

        return {
            field,
            order: order === 'asc' ? SortOrder.ASC : SortOrder.DESC,
        };
    }
}