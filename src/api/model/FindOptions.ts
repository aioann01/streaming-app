import {SortOptions} from "./SortOptions";

export type FindOptions = {
    limit?:number;
    page?:number;
    fields?:string;
    query?:any;
    sort?:SortOptions;
}