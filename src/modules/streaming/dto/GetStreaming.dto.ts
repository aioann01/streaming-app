import { ApiProperty } from '@nestjs/swagger';

export class GetStreamingDto {

    @ApiProperty({ description:'Id of streaming', example: '123', required: true, type:String })
    id: number;

    @ApiProperty({ description:'Title of streaming', example: 'Breaking Bad', required: true, type:String })
    title: string;

    @ApiProperty({ description: 'Url of thumbnail of streaming resource', example: 'https://example.com/thumbnails/breaking-bad.png',required: true, type:String  })
    thumbnail_url: string;

    @ApiProperty({ description: 'Genre of streaming resource', example: 'Comedy', required: false, type:String  })
    genre?: string;

    @ApiProperty({ description: 'Creation date of streaming', example:'12/2/2023', required: true, type:Date })
    created_at: Date;

}
