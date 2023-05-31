package com.mady.backend.controller


import com.mady.backend.repository.UserRepository
import com.mady.backend.security.JwtProvider
import com.mady.backend.services.SendMailService
import com.mady.backend.services.UserConnected
import com.mady.backend.utils.*
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.time.temporal.ChronoUnit
import javax.validation.Valid

@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/auth")
@Api(description = "Controlleur d'authentification")
class AuthController {

    @Autowired lateinit var authenticationManager: AuthenticationManager

    @Autowired lateinit var encoder: PasswordEncoder

    @Autowired lateinit var userRepository: UserRepository

    @Autowired
    lateinit var jwtProvider: JwtProvider

    @Autowired
    lateinit var sendMailService: SendMailService

    @Autowired
    lateinit var userConnected: UserConnected

    @Value("\${ws.app.frontend.url}")
    private val link: String? = null



    @ApiOperation(value = "Methode d'authentification de l'utilisateur")
    @PostMapping("/signin")
    fun login(@RequestBody loginInfo: LoginInfo): ResponseEntity<Any> {

        userRepository.findByTelephoneAndIsDelete(loginInfo.telephone, Delete.No)
                ?: return  ResponseEntity(ResponseException("le compte ${loginInfo.telephone} n'existe pas dans la base, veillez contacter l'administrateur "), HttpStatus.FORBIDDEN)

        val user = userRepository.findByTelephoneAndStatut(loginInfo.telephone, Statut.Activated)
                ?: return ResponseEntity(ResponseException("le compte ${loginInfo.telephone} est bloqué, veillez contacter l'administrateur"), HttpStatus.FORBIDDEN)


        val authentication: Authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(user.username, loginInfo.password))

        SecurityContextHolder.getContext().authentication = authentication

        val jwt = jwtProvider.generateJwtToken(authentication)
        val userDetails = authentication. principal as UserDetails

        return ResponseEntity.ok().body(JwtResponse(user.username!!, "success", jwt, userDetails.authorities))

    }

    @ApiOperation(value = "Methode qui envoi l'email pour la renitialisation du password")
    @GetMapping("/send-email")
    fun send(@RequestParam email: String): ResponseEntity<Any>{
        var user = userRepository.findByEmail(email.trim())
        return if(user.isPresent){
            val resetPasswordToken = userConnected.getRandomString(25)
            val lien = "$link/login/update-password/$resetPasswordToken"
            val userUpdate = userRepository.save(user.get().copy(resetPasswordToken = resetPasswordToken, updatedAt = Instant.now().plus(30, ChronoUnit.MINUTES)))
            sendMailService.sendEmailHtmlReset("${userUpdate.nom}  ${userUpdate.prenom}", userUpdate.email, lien = lien )
            ResponseEntity(Response(true, "mail envoyer "), HttpStatus.OK)
        }else ResponseEntity(Response(false, "l'email n'existe pas dans la base "), HttpStatus.NOT_FOUND)
    }

    @ApiOperation(value = "Methode qui permet la modification du password ")
    @PostMapping("/reset-password")
    fun updatePassword(@Valid @RequestBody resetPassword: ResetPassword): ResponseEntity<Any> {
        val user = userRepository.findByResetPasswordToken(resetPassword.token)
        val response = if(user.isPresent){
            if (user.get().updatedAt.isAfter(Instant.now())){
                userRepository.save(user.get().copy(password = encoder.encode(resetPassword.password), resetPasswordToken = null))
                ResponseEntity(Response(true, "Password changé avec succès "), HttpStatus.OK)
            }else ResponseEntity(ErrorResponse(HttpStatus.FORBIDDEN.value(), "le token a expiré "), HttpStatus.FORBIDDEN)

        }else ResponseEntity(ErrorResponse(HttpStatus.NOT_FOUND.value(), "le user n'existe pas"), HttpStatus.NOT_FOUND)
        return ResponseEntity(response.body, response.statusCode)
    }




}

data class ResetPassword(val token: String, val password: String)
data class LoginInfo(val telephone: String, val password: String)
data class JwtResponse(val username: String, val status: String, val token: String? = null, val authorities: Collection<GrantedAuthority>? = null)

