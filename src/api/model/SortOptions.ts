export enum SortOrder {
    ASC = "asc",
    DESC = "desc"

}

export type SortOptions = {
    field: string;
    order: SortOrder;
}