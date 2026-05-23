import { ApiProperty } from '@nestjs/swagger';

export class GetStreamingDetailsDto {

    @ApiProperty({ description:'Id of streaming', example: 123, required: true, type:String })
    id: number;

    @ApiProperty({ description:'Title of streaming', example: 'Breaking Bad', required: true, type:String })
    title: string;

    @ApiProperty({ description: 'Description of streaming', example:'A high school chemistry teacher turned methamphetamine producer navigates the dangers of the drug trade.', required: false, type:String })
    description?: string;

    @ApiProperty({ description: 'Url of thumbnail of streaming resource', example: 'https://example.com/thumbnails/breaking-bad.png',required: true, type:String  })
    thumbnail_url: string;

    @ApiProperty({ description: 'Url of streaming video resource', example: 'https://example.com/resources/breaking-bad.mkv',required: true, type:String  })
    video_url: string;

    @ApiProperty({ description: 'Genre of streaming resource', example: 'Comedy', required: false, type:String  })
    genre?: string;

    @ApiProperty({ description: 'Creation date of streaming', example:'12/2/2023', required: true, type:Date })
    created_at: Date;

    @ApiProperty({ description: 'Last updated date of streaming', example:'12/2/2023', required: true, type:Date })
    updated_at: Date;
}
