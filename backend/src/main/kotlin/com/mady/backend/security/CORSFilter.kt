package com.mady.backend.security

import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

import javax.servlet.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.io.IOException
import kotlin.jvm.Throws

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class CORSFilter : Filter {

    @Throws(ServletException::class)
    override fun init(fg: FilterConfig?) {
        // TODO Auto-generated method stub

    }

    @Throws(IOException::class, ServletException::class)
    override fun doFilter(req: ServletRequest, resp: ServletResponse, chain: FilterChain) {


        val response = resp as HttpServletResponse
        val request = req as HttpServletRequest
        response.setHeader("Access-Control-Allow-Origin", "*")
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE,PUT")
        response.setHeader("Access-Control-Allow-Max-Age", "3600")
        response.setHeader("Access-Control-Allow-Credentials", "true")
        response.setHeader("Access-Control-Allow-Headers",
                "x-requested-with, authorization,Content-Type, Authorization, credential, X-XSRF-TOKEN")

        if ("OPTIONS".equals(request.method, ignoreCase = true)) {

            response.status = HttpServletResponse.SC_OK
        } else {

            chain.doFilter(req, resp)
        }

    }

    override fun destroy() {
        // TODO Auto-generated method stub

    }


}
