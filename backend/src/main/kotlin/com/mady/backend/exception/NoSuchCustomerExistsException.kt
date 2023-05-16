package com.mady.backend.exception


class NoSuchCustomerExistsException(message: String, ex: Exception?) : RuntimeException(message, ex)

