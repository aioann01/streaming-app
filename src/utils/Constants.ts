export enum HTTP_HEADERS {
    LOCATION = 'location',
    CONTENT_TYPE = 'content-type',
    AUTHORIZATION = 'authorization'
}

export const FIND_OPTIONS_NOT_FILTER_QUERY_PARAMS:string[] = ['limit', 'page', 'sort']

export const DEFAULT_LIMIT :number = 10
export const APPLICATION_JSON_CONTENT_TYPE :string = 'application/json'

export const THROTTLING_REQUESTS: number = Number(
    process.env.THROTTLING_REQUESTS ?? 10,
);

export const THROTTLING_REQUESTS_PERIOD: number = Number(
    process.env.THROTTLING_REQUESTS_PERIOD ?? 60,
);
