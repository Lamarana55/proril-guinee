package com.mady.backend.security

import com.mady.backend.utils.UserPrinciple
import io.jsonwebtoken.*
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component

import java.util.Date

@Component
class JwtProvider {

    @Value("\${ws.app.jwtSecret}")
    private val jwtSecret: String? = null

    @Value("\${ws.app.jwtExpiration}")
    private val jwtExpiration: Int = 0

    fun generateJwtToken(authentication: Authentication): String {

        val userPrincipal = authentication.principal as UserPrinciple

        return Jwts.builder()
                .setSubject(userPrincipal.username)
                .setIssuedAt( Date())
                .setExpiration(Date(Date().time + jwtExpiration * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact()
    }

    fun generateJwtTokenApp(authentication: Authentication, time: Long): String{
        val userPrincipal = authentication.principal as UserPrinciple

        return Jwts.builder()
                .setSubject(userPrincipal.username)
                .setIssuedAt( Date())
                .setExpiration(Date(Date().time + time))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact()

    }

    fun validateJwtToken(authToken: String): Boolean {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken)
            return true
        } catch (e: SignatureException) {
            logger.error("Invalid JWT signature -> Message: {} ", e)
        } catch (e: MalformedJwtException) {
            logger.error("Invalid JWT token -> Message: {}", e)
        } catch (e: ExpiredJwtException) {
            logger.error("Expired JWT token -> Message -> Token expired ")
        } catch (e: UnsupportedJwtException) {
            logger.error("Unsupported JWT token -> Message: {}", e)
        } catch (e: IllegalArgumentException) {
            logger.error("JWT claims string is empty -> Message: {}", e)
        }

        return false
    }

    fun getUserNameFromJwtToken(token: String): String {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .body.subject
    }

    companion object {

        private val logger = LoggerFactory.getLogger(JwtProvider::class.java)
    }
}
