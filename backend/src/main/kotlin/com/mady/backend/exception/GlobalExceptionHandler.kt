package com.mady.backend.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus

@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(value = [NoSuchCustomerExistsException::class])
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    fun handleException(ex: NoSuchCustomerExistsException): ErrorResponse {
        return ErrorResponse(
                HttpStatus.NOT_FOUND.value(), ex.message)
    }
}
