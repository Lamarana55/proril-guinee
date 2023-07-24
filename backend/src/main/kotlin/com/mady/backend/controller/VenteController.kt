package com.mady.backend.controller

import com.mady.backend.entities.Client
import com.mady.backend.entities.Vente
import com.mady.backend.repository.ClientRepository
import com.mady.backend.repository.VenteRepository
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
@RequestMapping("/api/ventes")
@Api(description = "Controlleur de l'entité vente ")
class VenteController {

    private val logger = LoggerFactory.getLogger(VenteController::class.java)


    @Autowired
    private lateinit var venteRepository: VenteRepository


    @Autowired
    lateinit var userConnected: UserConnected

    @Autowired
    lateinit var apiService: ApiService



    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les ventes ")
    fun index(@RequestParam(defaultValue = "0") page: Int,
              @RequestParam(defaultValue = "10") size: Int,
              @RequestParam nom: String? = null): ResponseEntity<Any> {
        val pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))


//        return if (true) {
        when {
            userConnected.getAutorisation(Permissions.CAN_VIEW_PRODUIT_LIST) -> return when {
                nom != null -> ResponseEntity.ok().body(apiService.myTreePage(venteRepository.findByProduitNomAndIsDelete(nom, Delete.No, pageRequest)))
                else -> ResponseEntity.ok().body(apiService.myTreePage(venteRepository.findAllByIsDeleteOrderByCreatedAtAsc(Delete.No, pageRequest)))

            }
            else -> return ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }
    }



    @GetMapping("{id}")
    @ApiOperation("Recuperation d'une vente")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_CATEGORIE_INFO) ->{
                ResponseEntity(venteRepository.findById(id).filter { vente -> vente.isDelete == Delete.No }, HttpStatus.OK)
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une vente ")
    fun save(@Valid @RequestBody vente: Vente): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_ADD_CATEGORIE) -> {
//                vente.marqueAt =
                ResponseEntity.ok().body(venteRepository.save(vente))
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }

    }

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'une liste de Vente ")
    fun saveAll(@Valid @RequestBody list: List<Vente>) =
            ResponseEntity.ok().body(venteRepository.saveAll(list))

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un Vente")
    fun update(@PathVariable id: Long, @Valid @RequestBody vente: Vente): ResponseEntity<Vente> {
        return venteRepository.findById(id).map { existType ->
            val newType = existType.copy(
                    prixVente = vente.prixVente,
                    produit = vente.produit,
                    quantite = vente.quantite,
                    description = vente.description,
                    commande = vente.commande,
                    produitAt = vente.produitAt,
                    commandeAt = vente.commandeAt,
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(venteRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une vente ")
    fun delete(@PathVariable id: Long): ResponseEntity<Vente> {
        return venteRepository.findById(id).map { existVente ->
            val newType = existVente.copy(
                    isDelete = userConnected.updateDelete(existVente.isDelete),
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(venteRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @GetMapping("all")
    @ApiOperation("Recuperation de la liste des ventes")
    fun getAll(): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_PRODUIT_LIST) ->{
                ResponseEntity.ok(venteRepository.findAll().filter { vente -> vente.isDelete == Delete.No })
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }


}