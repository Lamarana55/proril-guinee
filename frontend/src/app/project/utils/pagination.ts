export interface Pagination{
    data: any[]
    totalItem: number
    totalPage: number
    lastPage: number
    currentPage: number
    isLast: boolean
    isFirst: boolean
    dataIsEmpty: boolean
}