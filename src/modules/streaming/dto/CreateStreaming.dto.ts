import { IsString, IsNotEmpty, IsUrl, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStreamingDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 255)
    @ApiProperty({ description:'Title of streaming', example: 'Breaking Bad', required: true, type:String })
    title: string;

    @IsString()
    @IsOptional()
    @Length(0, 1000)
    @ApiProperty({ description: 'Description of streaming', example:'A high school chemistry teacher turned methamphetamine producer navigates the dangers of the drug trade.', required: false, type:String })
    description?: string;

    @IsUrl({ protocols: ['https'] }, { message: 'thumbnail_url must be a valid HTTPS URL' })
    @IsNotEmpty()
    @ApiProperty({ description: 'Url of thumbnail of streaming resource', example: 'https://example.com/thumbnails/breaking-bad.png',required: true, type:String  })
    thumbnail_url: string;

    @IsUrl({ protocols: ['https'] }, { message: 'video_url must be a valid HTTPS URL' })
    @IsNotEmpty()
    @ApiProperty({ description: 'Url of streaming video resource', example: 'https://example.com/resources/breaking-bad.mkv',required: true, type:String  })
    video_url: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Genre of streaming resource', example: 'Comedy', required: false, type:String  })
    genre?: string;
}
