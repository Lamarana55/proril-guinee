package com.mady.backend.controller

import com.mady.backend.entities.Categorie
import com.mady.backend.repository.CategorieRepository
import com.mady.backend.services.UserConnected
import com.mady.backend.utils.CROSS_ORIGIN
import com.mady.backend.utils.Delete
import com.mady.backend.utils.MessageResponse
import com.mady.backend.utils.Permissions
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant
import javax.validation.Valid

@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/categories")
@Api(description = "Controlleur de l'entité categorie ")
class CategorieController {


    private val logger = LoggerFactory.getLogger(CategorieController::class.java)

    @Autowired
    private lateinit var categorieRepository: CategorieRepository


    @Autowired
    lateinit var userConnected: UserConnected


    @GetMapping
    @ApiOperation("Recuperation de la liste des categories")
    fun index(): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_CATEGORIE_LIST) ->{
                ResponseEntity.ok(categorieRepository.findAll().filter { categorie -> categorie.isDelete == Delete.No })
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

    @GetMapping("{id}")
    @ApiOperation("Recuperation d'une categorie")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_CATEGORIE_INFO) ->{
                ResponseEntity(categorieRepository.findById(id).filter { categorie -> categorie.isDelete == Delete.No }, HttpStatus.OK)
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une categorie ")
    fun save(@Valid @RequestBody categorie: Categorie): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_ADD_CATEGORIE) -> {
                ResponseEntity.ok().body(categorieRepository.save(categorie))
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }

    }

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'une liste de Categorie ")
    fun saveAll(@Valid @RequestBody list: List<Categorie>) =
            ResponseEntity.ok().body(categorieRepository.saveAll(list))

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un Categorie")
    fun update(@PathVariable id: Long, @Valid @RequestBody categorie: Categorie): ResponseEntity<Categorie> {
        return categorieRepository.findById(id).map { existType ->
            val newType = existType.copy(
                    libelle = categorie.libelle,
                    description = categorie.description,
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(categorieRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une categorie ")
    fun delete(@PathVariable id: Long): ResponseEntity<Categorie> {
        return categorieRepository.findById(id).map { existCategorie ->
            val newType = existCategorie.copy(
                    isDelete = userConnected.updateDelete(existCategorie.isDelete),
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(categorieRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @GetMapping("findByLibelle")
    @ApiOperation("Récuperation d'une categorie en fonction du nom ")
    fun findByLibelle(@RequestParam libelle: String) = categorieRepository.findByLibelle(libelle).filter { categorie -> categorie.isDelete == Delete.No }


}