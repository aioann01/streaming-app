import {CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors} from '@nestjs/common';
import { Response } from 'express';
import { isArray } from 'lodash';
import { map, Observable } from 'rxjs';
import {LocationInterceptor} from "./location.interceptor";

export function AddTotalCountHeader(resourcesName:string){
    return UseInterceptors(new TotalCountInterceptor(resourcesName))
}

@Injectable()
export class TotalCountInterceptor implements NestInterceptor {
    private resourcesName;
    constructor(resourcesName) {
        this.resourcesName = resourcesName
    }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((body: Observable<any>) => {
                const response: Response = context.switchToHttp().getResponse();
                let xResultCount =  0;
                const xTotalCount = body['total'];
                const entities : any[] = body[this.resourcesName];
                if (isArray(entities)) {
                    xResultCount = entities.length;
                }

                response.setHeader('X-Total-Count', xTotalCount );
                response.setHeader('X-Result-Count',xResultCount);
                response.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')

                return entities;
            }),
        );
    }
}
