import { PartialType } from '@nestjs/mapped-types';
import { CreateStreamingDto } from "./CreateStreaming.dto";

export class UpdateStreamingDto extends PartialType(CreateStreamingDto) {}