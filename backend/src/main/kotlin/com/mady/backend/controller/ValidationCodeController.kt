package com.mady.backend.controller

import com.mady.backend.entities.ValidationCode
import com.mady.backend.repository.ValidationCodeRepository
import com.mady.backend.utils.CROSS_ORIGIN
import com.mady.backend.utils.MessageResponse
import io.swagger.annotations.ApiOperation
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*
import javax.validation.Valid


@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/validation-codes")
class ValidationCodeController {
    private val logger = LoggerFactory.getLogger(ValidationCodeController::class.java)

    @Autowired
    private lateinit var validationCodeRepository: ValidationCodeRepository

    @GetMapping
    @ApiOperation("Recuperation de la liste des validationCodes")
    fun index(): ResponseEntity<List<ValidationCode>> = ResponseEntity.ok(validationCodeRepository.findAll())

    @GetMapping("{id}")
    @ApiOperation("Recuperation d'un validationCode")
    fun show(@PathVariable id: Long): Optional<ValidationCode> = validationCodeRepository.findById(id)

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'un validationCode ")
    fun save(@Valid @RequestBody validationCode: ValidationCode) =
            ResponseEntity.ok().body(validationCodeRepository.save(validationCode))


    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer un validationCode ")
    fun delete(@PathVariable id: Long): MessageResponse {
        return validationCodeRepository.findById(id).map {
            validationCodeRepository.deleteById(id)
            MessageResponse("L'element qui a pour $id a été supprimer ", "success")
        }.orElse(MessageResponse("Echec de la suppression ", "Echec"))
    }
    
}