import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {StreamingDao} from "../streaming.dao";
import {Streaming} from "../../entity/Streaming.entity";
import {CreateStreamingDto} from "../../dto/CreateStreaming.dto";
import {FindOptions} from "../../../../api/model/FindOptions";
import {
    ALLOWED_FILTER_FIELDS,
    ALLOWED_SORT_FIELDS,
    ListStreamingDto
} from "../../dto/ListStreaming.dto";
import {GetStreamingDetailsDto} from "../../dto/GetStreamingDetails.dto";
import {UpdateStreamingDto} from "../../dto/UpdateStreaming.dto";
import {SortOrder} from "../../../../api/model/SortOptions";
import {STREAMING_MODULE_CONSTANTS} from "../../streaming.constants";
import {GetStreamingDto} from "../../dto/GetStreaming.dto";

@Injectable()
export class StreamingPostgresDaoImpl implements StreamingDao{
    constructor(
        @InjectRepository(Streaming)
        private readonly streamingRepository: Repository<Streaming>,
        private readonly logger: Logger
    ) {}

    async create(dto: CreateStreamingDto): Promise<GetStreamingDetailsDto> {
        const entity = this.streamingRepository.create(dto);
        const createdStreaming : GetStreamingDetailsDto = await this.streamingRepository.save(entity);
        this.logger.log(`Created new streaming item with id ${createdStreaming.id}`);
        return createdStreaming;
    }


    convertFiltersToWhereClause(filters:any):any{
        if (!filters) return {};

        const where: any = {};

        for (const key in filters) {
            if (filters.hasOwnProperty(key)) {
                if(ALLOWED_FILTER_FIELDS.includes(key)){
                    where[key] = filters[key];}
                else{
                    this.logger.warn(`Query ${key} is not valid filter. will be ignored`);
                }
            }
        }

        return where;
    }

    async find(options:FindOptions):Promise<ListStreamingDto> {

        let orderClause = {};

        if (options.sort && ALLOWED_SORT_FIELDS.includes(options.sort.field)) {
            orderClause = {
                [options.sort.field]: options.sort.order === SortOrder.ASC ? SortOrder.ASC : SortOrder.DESC,
            };
        }
        const selectClause = STREAMING_MODULE_CONSTANTS.STREAMING_LIST_FIELDS.reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {} as Record<string, boolean>);

        const [items, total] = await this.streamingRepository.findAndCount({
            where: this.convertFiltersToWhereClause(options.query),

            order: orderClause,

            select: selectClause,

            skip: (options.page - 1) * options.limit,

            take: options.limit,
        });


        const cleanedItemsWithOmittedNulls: GetStreamingDto[] = items.map((item) =>
            Object.fromEntries(
                Object.entries(item).filter(([_, v]) => v !== null),
            ) as GetStreamingDto,
        );

        return new ListStreamingDto(cleanedItemsWithOmittedNulls, total);
    }

    async findOne(id: number): Promise<GetStreamingDetailsDto> {
        const item = await this.streamingRepository.findOneBy({ id });

        if (!item) {
            throw new NotFoundException(`Streaming item with id ${id} not found`);
        }

        return item;
    }


    async update(id: number, dto: UpdateStreamingDto): Promise<GetStreamingDetailsDto> {
        const item :GetStreamingDetailsDto = await this.findOne(id);

        const updated = Object.assign(item, dto);
        const updatedStreaming:GetStreamingDetailsDto = await this.streamingRepository.save(updated);
        this.logger.log(`Updated streaming item with id ${id}`)
        return updatedStreaming;
    }

    async delete(id: number): Promise<void> {
        const result = await this.streamingRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Streaming item with id ${id} not found`);
        }
    }
}

