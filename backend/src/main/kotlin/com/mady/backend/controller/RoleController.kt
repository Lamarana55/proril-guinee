package com.mady.backend.controller

import com.mady.backend.entities.Role
import com.mady.backend.repository.PermissionRepository
import com.mady.backend.repository.RoleRepository
import com.mady.backend.services.UserConnected
import com.mady.backend.utils.*
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.util.*
import javax.validation.Valid

@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/roles")
@Api(description = "Controlleur de l'entité role ")
class RoleController {

    private val logger = LoggerFactory.getLogger(RoleController::class.java)

    @Autowired
    private lateinit var roleRepository: RoleRepository

    @Autowired
    private lateinit var permissionRepository: PermissionRepository

    @Autowired
    private lateinit var userConnected: UserConnected

    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les roles ")
    fun index(): ResponseEntity<Any> {
        return ResponseEntity.ok().body(roleRepository.findAll())

       /* return when {
            userConnected.getAutorisation(Permissions.CAN_VIEW_ROLE_LIST) -> {
                logger.info("le username ${userConnected.getUserConnected().username} a appellé l'index de role")
                ResponseEntity.ok().body(roleRepository.findAll().filter { role -> role.isDelete == Delete.No }.sortedByDescending { it.nom })
            }
            else -> ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }*/
    }

    @GetMapping("{id}")
    @ApiOperation("Récuperation d'un role en fonction de son id ")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
//        return ResponseEntity.ok().body(roleRepository.findById(id).filter { role -> role.isDelete == Delete.No  })
        return if (userConnected.getAutorisation(Permissions.CAN_VIEW_ROLE_INFO)) {
            ResponseEntity.ok().body(roleRepository.findById(id).filter { role -> role.isDelete == Delete.No })
        } else ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
    }

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'un role ")
    fun save(@Valid @RequestBody role: Role): ResponseEntity<Any> {
        return ResponseEntity.ok().body(roleRepository.save(role))
       /*
        return if (userConnected.getAutorisation(Permissions.CAN_ADD_ROLE)) {
            ResponseEntity.ok().body(roleRepository.save(role))
        } else ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
    */
    }

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'une liste de role ")
    fun saveAll(@Valid @RequestBody listRole: MutableList<Role>): ResponseEntity<Any> {
        return ResponseEntity.ok().body(roleRepository.saveAll(listRole))
        /* return if (userConnected.getAutorisation(Permissions.CAN_ADD_ROLE)) {
             ResponseEntity.ok().body(roleRepository.saveAll(listRole))
         } else ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
 */
    }

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un role  ")
    fun update(@PathVariable id: Long, @RequestBody role: Role): ResponseEntity<Any> {
        when {
            userConnected.getAutorisation(Permissions.CAN_UPDATE_ROLE) -> {
                val existRole = roleRepository.findById(id)
                return if (existRole.isPresent) {
                    val newRole = existRole.get()
                            .copy(nom = role.nom,
                                    permissions = role.permissions,
                                    description = role.description,
                                    updatedAt = Instant.now()
                            )
                    ResponseEntity.ok().body(roleRepository.save(newRole))
                } else
                    ResponseEntity.notFound().build()
            }
            else -> return ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }
    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer un role ")
    fun delete(@PathVariable id: Long): ResponseEntity<MessageResponse> {
        return when {
            userConnected.getAutorisation(Permissions.CAN_DELETE_ROLE) -> {
                roleRepository.findById(id).map {
                                        roleRepository.deleteById(id)
//                    roleRepository.updateDelete(Delete.Yes, id)
                    ResponseEntity(MessageResponse("L'element qui a pour $id a été supprimer ", "success"), HttpStatus.OK)
                }.orElse(ResponseEntity(MessageResponse("Echec de la suppression l'id $id donné n'existe pas", "Echec"), HttpStatus.NOT_FOUND))
            }
            else -> ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }
    }

    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'un role en fonction du nom")
    fun findByNom(@RequestParam nom: String): Optional<Role> = roleRepository.findByNom(nom).filter { role -> role.isDelete == Delete.No }

    @GetMapping("findByPermission")
    @ApiOperation("Récuperation des roles en fonction de l'id du permission donné ")
    fun findByPermission(@RequestParam id: Long): List<Role> {
        val permission = permissionRepository.findById(id).filter { permission -> permission.isDelete == Delete.No }
        return roleRepository.findByPermissions(permission.get()).filter { role -> role.isDelete == Delete.No }
    }


    @GetMapping("findByNomAndPermissions")
    @ApiOperation("Récuperation des roles en fonction de l'id du permission donné ")
    fun findByNomAndPermissions(@RequestParam nom: String, @RequestParam id: Long): ResponseEntity<Any> {
        val permission = permissionRepository.findById(id).get()
        return try {
            ResponseEntity.ok().body(roleRepository.findByNomAndPermissions(nom, permission))
        } catch (e: Exception) {
            println("Resultat Exception: $e")
            ResponseEntity(ResponseException(""), HttpStatus.FORBIDDEN)
        }
    }

}