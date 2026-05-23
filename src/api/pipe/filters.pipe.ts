import { Injectable, PipeTransform } from '@nestjs/common';
import { FIND_OPTIONS_NOT_FILTER_QUERY_PARAMS } from '../../utils/Constants';

@Injectable()
export class ParseFiltersPipe implements PipeTransform {
    transform(value: any): Record<string, any> {
        if (!value) return {};

        return Object.keys(value)
            .filter(
                (key) => !FIND_OPTIONS_NOT_FILTER_QUERY_PARAMS.includes(key),
            )
            .reduce((acc, key) => {
                acc[key] = value[key];
                return acc;
            }, {} as Record<string, any>);
    }
}