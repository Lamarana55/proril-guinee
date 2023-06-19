package com.mady.backend.controller

import com.mady.backend.entities.Marque
import com.mady.backend.repository.MarqueRepository
import com.mady.backend.services.ApiService
import com.mady.backend.services.UserConnected
import com.mady.backend.utils.CROSS_ORIGIN
import com.mady.backend.utils.Delete
import com.mady.backend.utils.MessageResponse
import com.mady.backend.utils.Permissions
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant
import javax.validation.Valid


@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/marques")
@Api(description = "Controlleur de l'entité marques ")
class MarqueController {


    private val logger = LoggerFactory.getLogger(CommandeController::class.java)

    @Autowired
    private lateinit var marqueRepository: MarqueRepository


    @Autowired
    lateinit var userConnected: UserConnected


    @Autowired
    lateinit var apiService: ApiService

    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les groupements ")
    fun index(@RequestParam(defaultValue = "0") page: Int,
              @RequestParam(defaultValue = "10") size: Int,
              @RequestParam libelle: String? = null,
              @RequestParam groupement: String? = null): ResponseEntity<Any> {
        val pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))

//        return if (true) {
        when {
            userConnected.getAutorisation(Permissions.CAN_VIEW_MARQUE_LIST) -> return when {
                libelle != null -> ResponseEntity.ok().body(apiService.myTreePage(marqueRepository.findByLibelleAndIsDelete(libelle, Delete.No, pageRequest)))
                groupement != null -> ResponseEntity.ok().body(apiService.myTreePage(marqueRepository.findByGroupementNomAndIsDelete(groupement,Delete.No, pageRequest)))
                else -> ResponseEntity.ok().body(apiService.myTreePage(marqueRepository.findAllByIsDeleteOrderByLibelleAsc(Delete.No, pageRequest)))

            }
            else -> return ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }
    }


    @GetMapping("{id}")
    @ApiOperation("Recuperation d'une marque")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_MARQUE_INFO) ->{
                ResponseEntity(marqueRepository.findById(id).filter { marque -> marque.isDelete == Delete.No }, HttpStatus.OK)
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une marque ")
    fun save(@Valid @RequestBody marque: Marque): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_ADD_MARQUE) -> {
                ResponseEntity.ok().body(marqueRepository.save(marque))
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }

    }

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'une liste de Marque ")
    fun saveAll(@Valid @RequestBody list: List<Marque>) =
            ResponseEntity.ok().body(marqueRepository.saveAll(list))

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un Marque")
    fun update(@PathVariable id: Long, @Valid @RequestBody marque: Marque): ResponseEntity<Marque> {
        return marqueRepository.findById(id).map { existType ->
            val newType = existType.copy(
                    libelle = marque.libelle,
                    description = marque.description,
                    groupement = marque.groupement,
                    groupementAt = marque.groupement?.nom,
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(marqueRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une marque ")
    fun delete(@PathVariable id: Long): ResponseEntity<Marque> {
        return marqueRepository.findById(id).map { existCategorie ->
            val newType = existCategorie.copy(
                    isDelete = userConnected.updateDelete(existCategorie.isDelete),
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(marqueRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @GetMapping("findByLibelle")
    @ApiOperation("Récuperation d'une marque en fonction du nom ")
    fun findByLibelle(@RequestParam libelle: String) = marqueRepository.findByLibelle(libelle).filter { marque -> marque.isDelete == Delete.No }

    @GetMapping("all")
    @ApiOperation("Recuperation de la liste des marques")
    fun index(): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_MARQUE_LIST) ->{
                ResponseEntity.ok(marqueRepository.findAll().filter { marque -> marque.isDelete == Delete.No })
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

}