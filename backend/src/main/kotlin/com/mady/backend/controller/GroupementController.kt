package com.mady.backend.controller

import com.mady.backend.entities.Groupement
import com.mady.backend.repository.GroupementRepository
import com.mady.backend.services.ApiService
import com.mady.backend.services.UserConnected
import com.mady.backend.utils.*
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
@RequestMapping("/api/groupements")
@Api(description = "Controlleur de l'entité groupement ")
class GroupementController {

    private val logger = LoggerFactory.getLogger(GroupementController::class.java)

    @Autowired
    private lateinit var groupementRepository: GroupementRepository


    @Autowired
    lateinit var userConnected: UserConnected

    @Autowired
    lateinit var apiService: ApiService



    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les groupements ")
    fun index(@RequestParam(defaultValue = "0") page: Int,
              @RequestParam(defaultValue = "10") size: Int,
              @RequestParam nom: String? = null,
              @RequestParam prenom : String? = null,
              @RequestParam role: String? = null,
              @RequestParam telephone: String? = null,
              @RequestParam idRegion: Long? = null,
              @RequestParam idPrefecture: Long? = null,
              @RequestParam idCommune: Long? = null,
              @RequestParam idQuartier: Long? = null): ResponseEntity<Any> {
        val pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))


//        return if (true) {
        when {
            userConnected.getAutorisation(Permissions.CAN_VIEW_GROUPEMENT_LIST) -> return when {
                telephone != null -> ResponseEntity.ok().body(apiService.myTreePage(groupementRepository.findByTelephoneAndIsDelete(telephone, Delete.No, pageRequest)))
                else -> ResponseEntity.ok().body(apiService.myTreePage(groupementRepository.findAllByIsDeleteOrderByNomAsc(Delete.No, pageRequest)))

            }
            else -> return ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }
    }



    @GetMapping("{id}")
    @ApiOperation("Recuperation d'une groupement")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_GROUPEMENT_INFO) ->{
                ResponseEntity(groupementRepository.findById(id).filter { groupement -> groupement.isDelete == Delete.No }, HttpStatus.OK)
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une groupement ")
    fun save(@Valid @RequestBody groupement: Groupement): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_ADD_GROUPEMENT) -> {
                ResponseEntity.ok().body(groupementRepository.save(groupement))
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }

    }

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'une liste de Groupement ")
    fun saveAll(@Valid @RequestBody list: List<Groupement>) =
            ResponseEntity.ok().body(groupementRepository.saveAll(list))

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un Groupement")
    fun update(@PathVariable id: Long, @Valid @RequestBody groupement: Groupement): ResponseEntity<Groupement> {
        return groupementRepository.findById(id).map { existType ->
            val newType = existType.copy(
                    nom = groupement.nom,
                    telephone = groupement.telephone,
                    marque = groupement.marque,
                    description = groupement.description,
                    region = groupement.region,
                    prefecture = groupement.prefecture,
                    commune = groupement.commune,
                    quartier = groupement.quartier,
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(groupementRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une groupement ")
    fun delete(@PathVariable id: Long): ResponseEntity<Groupement> {
        return groupementRepository.findById(id).map { existGroupement ->
            val newType = existGroupement.copy(
                    isDelete = userConnected.updateDelete(existGroupement.isDelete),
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(groupementRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'une groupement en fonction du nom ")
    fun findByNom(@RequestParam nom: String) = groupementRepository.findByNom(nom).filter { groupement -> groupement.isDelete == Delete.No }

    @GetMapping("all")
    @ApiOperation("Recuperation de la liste des groupements")
    fun getAll(): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_GROUPEMENT_LIST) ->{
                ResponseEntity.ok(groupementRepository.findAll().filter { groupement -> groupement.isDelete == Delete.No })
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }


}