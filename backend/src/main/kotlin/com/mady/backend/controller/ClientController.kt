package com.mady.backend.controller

import com.mady.backend.entities.Client
import com.mady.backend.repository.ClientRepository
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
@RequestMapping("/api/clients")
@Api(description = "Controlleur de l'entité client ")
class ClientController {

    private val logger = LoggerFactory.getLogger(ClientController::class.java)

    @Autowired
    private lateinit var clientRepository: ClientRepository


    @Autowired
    lateinit var userConnected: UserConnected

    @Autowired
    lateinit var apiService: ApiService



    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les clients ")
    fun index(@RequestParam(defaultValue = "0") page: Int,
              @RequestParam(defaultValue = "10") size: Int,
              @RequestParam nom: String? = null,
              @RequestParam prenom : String? = null,
              @RequestParam telephone: String? = null): ResponseEntity<Any> {
        val pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))


//        return if (true) {
        when {
            userConnected.getAutorisation(Permissions.CAN_VIEW_CLIENT_LIST) -> return when {
                telephone != null -> ResponseEntity.ok().body(apiService.myTreePage(clientRepository.findByTelephoneAndIsDelete(telephone, Delete.No, pageRequest)))
                else -> ResponseEntity.ok().body(apiService.myTreePage(clientRepository.findAllByIsDeleteOrderByNomAsc(Delete.No, pageRequest)))

            }
            else -> return ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }
    }



    @GetMapping("{id}")
    @ApiOperation("Recuperation d'une client")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_CLIENT_INFO) ->{
                ResponseEntity(clientRepository.findById(id).filter { client -> client.isDelete == Delete.No }, HttpStatus.OK)
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une client ")
    fun save(@Valid @RequestBody client: Client): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_ADD_CLIENT) -> {
                val user = userConnected.getUserConnected()
                ResponseEntity.ok().body(clientRepository.save(client.copy(user = user)))
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }

    }

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'une liste de Client ")
    fun saveAll(@Valid @RequestBody list: List<Client>) =
            ResponseEntity.ok().body(clientRepository.saveAll(list))

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un Client")
    fun update(@PathVariable id: Long, @Valid @RequestBody client: Client): ResponseEntity<Client> {
        return clientRepository.findById(id).map { existType ->
            val newType = existType.copy(
                    nom = client.nom,
                    prenom = client.prenom,
                    telephone = client.telephone,
                    adresse = client.adresse,
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(clientRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une client ")
    fun delete(@PathVariable id: Long): ResponseEntity<Client> {
        return clientRepository.findById(id).map { existClient ->
            val newType = existClient.copy(
                    isDelete = userConnected.updateDelete(existClient.isDelete),
                    updatedAt = Instant.now()
            )
            ResponseEntity.ok().body(clientRepository.save(newType))
        }.orElse(ResponseEntity.notFound().build())

    }

    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'une client en fonction du nom ")
    fun findByNom(@RequestParam nom: String) = clientRepository.findByNom(nom).filter { client -> client.isDelete == Delete.No }

    @GetMapping("all")
    @ApiOperation("Recuperation de la liste des clients")
    fun getAll(): ResponseEntity<Any> {
        return when {
//            true -> {
            userConnected.getAutorisation(Permissions.CAN_VIEW_CLIENT_LIST) ->{
                ResponseEntity.ok(clientRepository.findAll().filter { client -> client.isDelete == Delete.No })
            }
            else -> ResponseEntity(MessageResponse("le user n'est pas autorisé "), HttpStatus.UNAUTHORIZED)
        }
    }


}