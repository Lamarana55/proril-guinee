package com.mady.backend.controller

import com.mady.backend.entities.Commande
import com.mady.backend.repository.CommandeRepository
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
@RequestMapping("/api/commandes")
@Api(description = "Controlleur de l'entité commande ")
class CommandeController {


    private val logger = LoggerFactory.getLogger(CommandeController::class.java)

    @Autowired
    private lateinit var categorieRepository: CommandeRepository


    @Autowired
    lateinit var userConnected: UserConnected


    @GetMapping
    @ApiOperation("Recuperation de la liste des commandes")
    fun index(): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_CATEGORIE_LIST) ->{
                ResponseEntity.ok(categorieRepository.findAll().filter { commande -> commande.isDelete == Delete.No })
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

    @GetMapping("{id}")
    @ApiOperation("Recuperation d'une commande")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_CATEGORIE_INFO) ->{
                ResponseEntity(categorieRepository.findById(id).filter { commande -> commande.isDelete == Delete.No }, HttpStatus.OK)
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une commande ")
    fun save(@Valid @RequestBody commande: Commande): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_ADD_CATEGORIE) -> {
                ResponseEntity.ok().body(categorieRepository.save(commande))
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }

    }

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'une liste de Commande ")
    fun saveAll(@Valid @RequestBody list: List<Commande>) =
            ResponseEntity.ok().body(categorieRepository.saveAll(list))

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un Commande")
    fun update(@PathVariable id: Long, @Valid @RequestBody commande: Commande): ResponseEntity<Commande> {
        return categorieRepository.findById(id).map { existType ->
            val newType = existType.copy(
                    libelle = commande.libelle,
                    description = commande.description,
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(categorieRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une commande ")
    fun delete(@PathVariable id: Long): ResponseEntity<Commande> {
        return categorieRepository.findById(id).map { existCategorie ->
            val newType = existCategorie.copy(
                    isDelete = userConnected.updateDelete(existCategorie.isDelete),
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(categorieRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @GetMapping("findByLibelle")
    @ApiOperation("Récuperation d'une commande en fonction du nom ")
    fun findByLibelle(@RequestParam libelle: String) = categorieRepository.findByLibelle(libelle).filter { commande -> commande.isDelete == Delete.No }


}