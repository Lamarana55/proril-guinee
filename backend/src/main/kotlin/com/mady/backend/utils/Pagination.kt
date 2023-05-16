package com.mady.backend.utils

data class Pagination(
        val data: List<Any>,
        val totalItem: Long,
        val totalPage: Int,
        val lastPage: Int,
        val currentPage: Int,
        val isLast: Boolean,
        val isFirst: Boolean,
        val dataIsEmpty: Boolean
)