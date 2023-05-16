package com.mady.backend.security


import org.slf4j.LoggerFactory
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component

import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.io.IOException
import kotlin.jvm.Throws

@Component
class JwtAuthEntryPoint : AuthenticationEntryPoint {

    @Throws(IOException::class, ServletException::class)
    override fun commence(request: HttpServletRequest,
                          response: HttpServletResponse,
                          e: AuthenticationException) {

        logger.error("Ip: ${request.remoteAddr} --> URL: ${request.requestURI}--> Unauthorized error. Message - {}", e.message)

        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error -> Unauthorized")
    }

    companion object {
        private val logger = LoggerFactory.getLogger(JwtAuthEntryPoint::class.java)
    }
}