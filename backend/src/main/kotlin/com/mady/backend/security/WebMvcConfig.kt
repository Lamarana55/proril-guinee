package com.mady.backend.security

import com.mady.backend.utils.CROSS_ORIGIN
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebMvcConfig : WebMvcConfigurer {

    private val MAX_AGE_SECS: Long = 3600

    override fun addCorsMappings(registry: CorsRegistry) {
        registry!!.addMapping("/**")
                .allowedOrigins(CROSS_ORIGIN)
               .allowedMethods("HEAD", "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE")
                .maxAge(MAX_AGE_SECS)
   }
}
