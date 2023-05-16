import { Cas } from "../gestion-cas/models/cas.model"

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