package com.mady.backend.controller

import com.mady.backend.entities.Produit
import com.mady.backend.repository.ProduitRepository
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
@RequestMapping("/api/produits")
@Api(description = "Controlleur de l'entité produit ")
class ProduitController {


    private val logger = LoggerFactory.getLogger(ProduitController::class.java)

    @Autowired
    private lateinit var produitRepository: ProduitRepository


    @Autowired
    lateinit var userConnected: UserConnected

    @Autowired
    lateinit var apiService: ApiService



    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les produits ")
    fun index(@RequestParam(defaultValue = "0") page: Int,
              @RequestParam(defaultValue = "10") size: Int,
              @RequestParam nom: String? = null,
              @RequestParam groupement : String? = null): ResponseEntity<Any> {
        val pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))


//        return if (true) {
        when {
            userConnected.getAutorisation(Permissions.CAN_VIEW_GROUPEMENT_LIST) -> return when {
                nom != null -> ResponseEntity.ok().body(apiService.myTreePage(produitRepository.findByNomAndIsDelete(nom, Delete.No, pageRequest)))
                groupement != null -> ResponseEntity.ok().body(apiService.myTreePage(produitRepository.findByGroupementNomAndIsDelete(groupement, Delete.No, pageRequest)))
                else -> ResponseEntity.ok().body(apiService.myTreePage(produitRepository.findAllByIsDeleteOrderByNomAsc(Delete.No, pageRequest)))

            }
            else -> return ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }
    }



    @GetMapping("{id}")
    @ApiOperation("Recuperation d'une produit")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_CATEGORIE_INFO) ->{
                ResponseEntity(produitRepository.findById(id).filter { produit -> produit.isDelete == Delete.No }, HttpStatus.OK)
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une produit ")
    fun save(@Valid @RequestBody produit: Produit): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_ADD_CATEGORIE) -> {
//                produit.marqueAt =
                ResponseEntity.ok().body(produitRepository.save(produit))
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }

    }

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'une liste de Produit ")
    fun saveAll(@Valid @RequestBody list: List<Produit>) =
            ResponseEntity.ok().body(produitRepository.saveAll(list))

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un Produit")
    fun update(@PathVariable id: Long, @Valid @RequestBody produit: Produit): ResponseEntity<Produit> {
        return produitRepository.findById(id).map { existType ->
            val newType = existType.copy(
                    nom = produit.nom,
                    poids = produit.poids,
                    prixUnit = produit.prixUnit,
                    description = produit.description,
                    groupement = produit.groupement,
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(produitRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une produit ")
    fun delete(@PathVariable id: Long): ResponseEntity<Produit> {
        return produitRepository.findById(id).map { existProduit ->
            val newType = existProduit.copy(
                    isDelete = userConnected.updateDelete(existProduit.isDelete),
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(produitRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'une produit en fonction du nom ")
    fun findByNom(@RequestParam nom: String) = produitRepository.findByNom(nom).filter { produit -> produit.isDelete == Delete.No }

    @GetMapping("all")
    @ApiOperation("Recuperation de la liste des produits")
    fun getAll(): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_GROUPEMENT_LIST) ->{
                ResponseEntity.ok(produitRepository.findAll().filter { produit -> produit.isDelete == Delete.No })
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

}