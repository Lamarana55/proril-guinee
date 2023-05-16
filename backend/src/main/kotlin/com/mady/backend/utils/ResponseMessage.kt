package com.mady.backend.utils

import org.springframework.http.HttpStatus

class ResponseMessage <T> (var type: T?, var message: String?, var status: HttpStatus? = null)

class MessageResponse(val message: String, var status: String? = null)
