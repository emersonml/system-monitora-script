export type IResponsePagination = {
    skip?: number;
    page?: number;
    take?: number;
    lastPage?: number;
    total?: number;
};

export type IRequestPagination = {
    page?: number;
    pageSize?: number;
};

export interface IPaginateData<T> {
    data: T[];
    pagination: IResponsePagination;
}

export interface IQueryPagination {
    skip?: number;
    pageSize?: number;
    page?: number;
}

export interface IDispatchObject<T, U> {
    type: T;
    payload: U;
}
