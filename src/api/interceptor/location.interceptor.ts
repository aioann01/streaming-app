import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler, UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {HTTP_HEADERS} from "../../utils/Constants";

export function CreateLocationHeader(resourceName:string){
    return UseInterceptors(new LocationInterceptor(resourceName))
}

@Injectable()
export class LocationInterceptor implements NestInterceptor {
    private resourceName:string;

    constructor(resourceName:string) {
        this.resourceName = resourceName
    }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            map((data: any) => {
                if (!data) return data;
                const response = context.switchToHttp().getResponse();
                if(data.id)
                    response.header(HTTP_HEADERS.LOCATION, `${process.env.API_URL}/${this.resourceName}/${data.id}`);
                return data;
            }),
        );
    }

}
