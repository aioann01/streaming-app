import {GetStreamingDto} from "./GetStreaming.dto";


export const ALLOWED_SORT_FIELDS = ['created_at', 'title'];

export const ALLOWED_FILTER_FIELDS = ['genre', 'title', 'created_at'];


export class ListStreamingDto {
    streamings:GetStreamingDto[];

    total: number;


    constructor(streamings: GetStreamingDto[], total: number) {
        this.streamings = streamings;
        this.total = total;
    }

}
