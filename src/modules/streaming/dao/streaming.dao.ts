import {CreateStreamingDto} from "../dto/CreateStreaming.dto";
import {GetStreamingDetailsDto} from "../dto/GetStreamingDetails.dto";
import {ListStreamingDto} from "../dto/ListStreaming.dto";
import {UpdateStreamingDto} from "../dto/UpdateStreaming.dto";
import {FindOptions} from "../../../api/model/FindOptions";

export interface StreamingDao{

    create(dto:CreateStreamingDto):Promise<GetStreamingDetailsDto>;

    find(options:FindOptions):Promise<ListStreamingDto>;

    findOne(id:number):Promise<GetStreamingDetailsDto>;

    delete(id:number):Promise<void>;

    update(id:number, dto:UpdateStreamingDto):Promise<GetStreamingDetailsDto>;
}