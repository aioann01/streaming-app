import {CreateStreamingDto} from "../../../src/modules/streaming/dto/CreateStreaming.dto";
import {UpdateStreamingDto} from "../../../src/modules/streaming/dto/UpdateStreaming.dto";

//// Create

export const createStreamingValidRequest : CreateStreamingDto = {
    video_url:'https:/example.com/resources/breakingBad',
    thumbnail_url:'https:/example.com/thumbnails/breakingBad',
    title:'Breaking Bad',
    genre:'drama',
    description:'description'
}

export const createStreamingRequestWithoutVideoUrl : CreateStreamingDto = {
    thumbnail_url:'https:/example.com/thumbnails/breakingBad',
    title:'Breaking Bad',
    genre:'drama'
} as CreateStreamingDto

export const createStreamingRequestWithoutThumbnailUrl : CreateStreamingDto = {
    video_url:'https:/example.com/resources/breakingBad',
    title:'Breaking Bad',
    genre:'drama'
}  as CreateStreamingDto

export const createStreamingRequestWithInvalidThumbnailUrl : CreateStreamingDto = {
    video_url:'https:/example.com/resources/breakingBad',
    thumbnail_url:'http:/example.com/thumbnails/breakingBad',
    title:'Breaking Bad',
    genre:'drama'
}


export const createStreamingRequestWithInvalidVideoUrl : CreateStreamingDto = {
    video_url:'https:/example.com/resources/breakingBad',
    thumbnail_url:'test',
    title:'Breaking Bad',
    genre:'drama'
}

export const createStreamingRequestWithoutTitle : CreateStreamingDto = {
    video_url:'https:/example.com/resources/breakingBad',
    thumbnail_url:'https:/example.com/thumbnails/breakingBad',
    genre:'drama'
}  as CreateStreamingDto


// Update

export const updateStreamingValidRequest :UpdateStreamingDto = {
    thumbnail_url: 'https:/example2.com'
}
