import {GetStreamingDetailsDto} from "../../../src/modules/streaming/dto/GetStreamingDetails.dto";
import {GetStreamingDto} from "../../../src/modules/streaming/dto/GetStreaming.dto";
import {createStreamingValidRequest} from "./requests";
import {ListStreamingDto} from "../../../src/modules/streaming/dto/ListStreaming.dto";

export const getStreamingBaseResponse1 : GetStreamingDto = {
    id:123,
    title : createStreamingValidRequest.title,
    genre: createStreamingValidRequest.genre,
    thumbnail_url: createStreamingValidRequest.thumbnail_url,
    created_at:new Date('12/2/2023')
}

export const getStreamingBaseResponse2 : GetStreamingDto = {
    id:13,
    title :'How i met your Mother',
    genre: createStreamingValidRequest.genre,
    thumbnail_url: createStreamingValidRequest.thumbnail_url,
    created_at:new Date('12/5/2023')
}

export const getStreamingWithDetailsResponse1 : GetStreamingDetailsDto = {
    ...getStreamingBaseResponse1,
    updated_at:new Date('1/7/2025'),
    video_url: 'url'
}

export const getStreamingWithDetailsResponse2 : GetStreamingDetailsDto = {
    ...getStreamingBaseResponse2,
    updated_at:new Date('1/7/2025'),
    video_url: 'url'
}


export const findStreamingsResponse :ListStreamingDto = createFindStreamingsResponse([getStreamingBaseResponse2]);

export function createFindStreamingsResponse(streamings:GetStreamingDto[]):ListStreamingDto{
    return new ListStreamingDto(streamings, streamings.length)
}