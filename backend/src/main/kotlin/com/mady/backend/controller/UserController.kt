package com.mady.backend.controller

import com.mady.backend.entities.User
import com.mady.backend.repository.UserRepository
import com.mady.backend.services.ApiService
import com.mady.backend.services.OrangeSMS
import com.mady.backend.services.SendMailService
import com.mady.backend.services.UserConnected
import com.mady.backend.utils.*
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.util.*
import java.util.function.Predicate
import javax.validation.Valid

@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/users")
@Api(description = "Controlleur de l'entité user ")
class UserController {
    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var encoder: PasswordEncoder

    @Autowired
    lateinit var sendMailService: SendMailService

    @Autowired
    lateinit var userConnected: UserConnected

    @Autowired
    lateinit var apiService: ApiService

    @Autowired
    lateinit var orangeSMS: OrangeSMS

    @Value("\${ws.app.frontend.url}")
    private val link: String? = null

    val predicate = Predicate<User> { user -> user.isDelete == Delete.No }

    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les users ")
    fun index(@RequestParam(defaultValue = "0") page: Int,
              @RequestParam(defaultValue = "10") size: Int,
              @RequestParam role: String? = null,
              @RequestParam idRegion: Long? = null,
              @RequestParam idPrefecture: Long? = null,
              @RequestParam idCommune: Long? = null,
              @RequestParam idQuartier: Long? = null,
              @RequestParam idSecteur: Long? = null): ResponseEntity<Any> {

        val pageRequest = PageRequest.of(page, size)

//        return if (true) {
         if (userConnected.getAutorisation(Permissions.CAN_VIEW_USER_LIST)) {
            if (role != null) {
                when {
                    idSecteur != null -> {
                        println("************* idSecteur: $idSecteur And role: $role ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findBySecteurIdAndRoleNomAndIsDeleteOrderByNomAsc(idSecteur,role, Delete.No, pageRequest)))
                    }
                    idQuartier != null -> {
                        println("************* idQuartier: $idQuartier And role: $role ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findByQuartierIdAndRoleNomAndIsDeleteOrderByNomAsc(idQuartier,role, Delete.No, pageRequest)))
                    }
                    idCommune != null -> {
                        println("************* idCommune: $idCommune And role: $role ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findByCommuneIdAndRoleNomAndIsDeleteOrderByNomAsc(idCommune,role, Delete.No, pageRequest)))
                    }
                    idPrefecture != null -> {
                        println("************* idPrefecture: $idPrefecture And role: $role ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findByPrefectureIdAndRoleNomAndIsDeleteOrderByNomAsc(idPrefecture,role, Delete.No, pageRequest)))
                    }
                    idRegion != null -> {
                        println("************* idRegion: $idRegion And role: $role ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findByRegionIdAndRoleNomAndIsDeleteOrderByNomAsc(idRegion,role, Delete.No, pageRequest)))
                    }
                    else -> {
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findByRoleNomAndIsDeleteOrderByNomAsc(role, Delete.No, pageRequest)))
                    }
                }
            } else {
                when {
                    idSecteur != null -> {
                        println("************* idSecteur: $idSecteur ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findBySecteurIdAndIsDeleteOrderByNomAsc(idSecteur, Delete.No, pageRequest)))
                    }
                    idQuartier != null -> {
                        println("************* idQuartier: $idQuartier ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findByQuartierIdAndIsDeleteOrderByNomAsc(idQuartier, Delete.No, pageRequest)))
                    }
                    idCommune != null -> {
                        println("************* idCommune: $idCommune ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findByCommuneIdAndIsDeleteOrderByNomAsc(idCommune, Delete.No, pageRequest)))
                    }
                    idPrefecture != null -> {
                        println("************* idPrefecture: $idPrefecture ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findByPrefectureIdAndIsDeleteOrderByNomAsc(idPrefecture, Delete.No, pageRequest)))
                    }
                    idRegion != null -> {
                        println("************* idRegion: $idRegion ***************")
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findByRegionIdAndIsDeleteOrderByNomAsc(idRegion, Delete.No, pageRequest)))
                    }
                    else -> {
                        return ResponseEntity.ok().body(apiService.myTreeUsers(userRepository.findAllByIsDeleteOrderByNomAsc(Delete.No, pageRequest)))
                    }
                }
            }


        } else return ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
    }



    @GetMapping("secteurs")
    fun secteur(@RequestParam idSecteur: Long): List<User> = userRepository.findBySecteurId(idSecteur)


    @GetMapping("{id}")
    @ApiOperation("Récupération d'un user en fonction de son id")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
//        return ResponseEntity.ok().body(userRepository.findById(id).filter { user -> user.isDelete == Delete.No })

         return if (userConnected.getAutorisation(Permissions.CAN_VIEW_USER_INFO)) {
             ResponseEntity.ok().body(userRepository.findById(id).filter { user -> user.isDelete == Delete.No })
         } else ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
    }

    @PostMapping
    @ApiOperation(value = "Methode d'enregistrement d'un nouvel utilisateur, qui reçoit un objet de type User")
    fun save(@Valid @RequestBody user: User): ResponseEntity<Any> {
        when {
            true -> {
//            userConnected.getAutorisation(Permissions.CAN_ADD_USER) -> {
                val myUser = userRepository.findByUsernameOrEmail(user.username, user.email).filter { user -> user.isDelete == Delete.No }
                when (myUser.isPresent) {
                    false -> {
                        var password = userConnected.getRandomString(10)

                        var userSave = userRepository.save(user.copy(password = encoder.encode(password), code = userConnected.getCodeUser(), username = user.telephone!!))
                        var message = "Bonjour ${userSave.prenom}, Votre login:${userSave.username} password: $password , lien: $link "
                        if (orangeSMS.sendMessage(userSave.telephone, message)) {
                            print("sms send")
                        }
                        sendMailService.sendEmailHtml("${userSave.nom}  ${userSave.prenom}", userSave.email, userSave.username, password, link!!)
                        return ResponseEntity(userSave, HttpStatus.OK)
                    }
                    true -> return ResponseEntity(MessageResponse("l'utilisateur existe déjà ", "Echec"), HttpStatus.CONFLICT)
                }
            }
            else -> return ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)

        }
    }

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un user  ")
    fun update(@PathVariable id: Long, @RequestBody user: User): ResponseEntity<Any> {
        if (userConnected.getAutorisation(Permissions.CAN_UPDATE_USER)) {
            val existUser = userRepository.findById(id)
            return if (existUser.isPresent) {
                val updateUser = existUser.get()
                        .copy(code = existUser.get().code,
                                nom = user.nom,
                                prenom = user.prenom,
                                username = user.username,
                                statut = user.statut,
                                telephone = user.telephone,
                                email = user.email,
                                role = user.role,
                                region = user.region,
                                prefecture = user.prefecture,
                                commune = user.commune,
                                quartier = user.quartier,
                                secteur = user.secteur,
                                updatedAt = Instant.now()
                        )
                val userSave = userRepository.save(updateUser)
//                localiteRepository.deleteById(existUser.get().localite.id!!)
                ResponseEntity.ok().body(userSave)
            } else {
                ResponseEntity(MessageResponse("Impossible de trouver l'id $id", "Echec"), HttpStatus.NOT_FOUND)
            }
        } else {
            return ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }

    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer un user ")
    fun delete(@PathVariable id: Long): ResponseEntity<MessageResponse> {
        return when {
//            true ->{
            userConnected.getAutorisation(Permissions.CAN_DELETE_USER) -> {
                userRepository.findById(id).map {
                    userRepository.deleteById(id)
//                    userRepository.updateDelete(Delete.Yes, id)
                    ResponseEntity(MessageResponse("L'element qui a pour $id a été supprimer ", "success"), HttpStatus.OK)
                }.orElse(ResponseEntity(MessageResponse("Echec de la suppression l'id $id donné n'existe pas", "Echec"), HttpStatus.NOT_FOUND))
            }
            else -> ResponseEntity(MessageResponse("le username n'est pas autorisé ", "Echec"), HttpStatus.FORBIDDEN)
        }
    }


    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'un user en fonction du nom")
    fun findByNom(@RequestParam nom: String): List<User> = userRepository.findByNom(nom).filter { user -> user.isDelete == Delete.No }

    @GetMapping("findByIsDelete")
    @ApiOperation("Récuperation d'un user en fonction du statut delete")
    fun findByIsDelete(@RequestParam isDelete: Delete): List<User> = userRepository.findByIsDelete(isDelete)

    @GetMapping("findByUsernameOrEmail")
    @ApiOperation("Récuperation d'un user en fonction du username ou de l'email ")
    fun findByUsernameOrEmail(@RequestParam username: String, @RequestParam email: String): Optional<User> = userRepository.findByUsernameOrEmail(username, email).filter { user -> user.isDelete == Delete.No }

    @GetMapping("findByPrenom")
    @ApiOperation("Récuperation d'un user en fonction du prenom")
    fun findByPrenom(@RequestParam prenom: String): List<User> = userRepository.findByPrenom(prenom).filter { user -> user.isDelete == Delete.No }

    @GetMapping("findByEmail")
    @ApiOperation("Récuperation d'un user en fonction de email")
    fun findByEmail(@RequestParam email: String): Optional<User> = userRepository.findByEmail(email).filter { user -> user.isDelete == Delete.No }

    @GetMapping("findByTelephone")
    @ApiOperation("Récuperation d'un user en fonction du numero de telephone")
    fun findByTelephone(@RequestParam telephone: String): Optional<User> = userRepository.findByTelephone(telephone).filter { user -> user.isDelete == Delete.No }

    @GetMapping("findByCode")
    @ApiOperation("Récuperation d'un user en fonction du code ")
    fun findByCode(@RequestParam code: String): Optional<User> = userRepository.findByCode(code).filter { user -> user.isDelete == Delete.No }

    @GetMapping("findByStatus")
    @ApiOperation("Récuperation d'un user en fonction du status")
    fun findByStatus(@RequestParam statut: Statut): List<User> = userRepository.findByStatut(statut).filter { user -> user.isDelete == Delete.No }

    @GetMapping("changeStatut/{id}")
    @ApiOperation("Modification du statut de l'utilisateur")
    fun changeStatut(@PathVariable id: Long): ResponseEntity<Any> {
        val user = userRepository.findById(id).filter { user -> user.isDelete == Delete.No }
        return if (user.isPresent) {
            if (user.get().statut == Statut.Activated) {
                userRepository.updateStatutUser(1, user.get().id)
            } else {
                userRepository.updateStatutUser(0, user.get().id)
            }
            ResponseEntity(MessageResponse("Modification effectuer !", "Success"), HttpStatus.OK)
        } else
            ResponseEntity(MessageResponse("Impossible de trouver l'id $id", "Echec"), HttpStatus.NOT_FOUND)
    }

    @PostMapping("changePassword")
    @ApiOperation("Modification du password ")
    fun changePassword(@Valid @RequestBody password: Password): ResponseEntity<String> {
        val userConnected = userConnected.getUserConnected()
        return when {
            encoder.matches(password.oldPassword, userConnected.password) -> {
                val updateUser = userConnected.copy(password = encoder.encode(password.newPassword))
                userRepository.save(updateUser)
                ResponseEntity.ok().body("Password change avec succès")
            }
            else -> ResponseEntity.badRequest().body("Echec de la modification du password ")
        }


    }

    @PostMapping("regenerePassword")
    @ApiOperation("Regenerer le password d'un utilisation")
    fun regenerePassword(@Valid @RequestBody regenerate: Regenerate): ResponseEntity<Any> {
        val user = userRepository.findById(regenerate.idUser)
        return when {
            user.isPresent -> {
                val password = userConnected.getRandomPassword()
                var updateUser = userRepository.save(user.get().copy(password = encoder.encode(password)))
                if (regenerate.option == OptionSender.EMAIL.value) {
                    sendMailService.sendEmailHtmlPasswordGenerate("${updateUser.nom}  ${updateUser.prenom}", updateUser.email, updateUser.username, password, link!!)
                } else {
                    val message = "Bonjour votre nouveau mots de passe est : $password "
                    orangeSMS.sendMessage(updateUser.telephone, message)
                }
                ResponseEntity(Response(true, "Password regenerer avec succès"), HttpStatus.OK)
            }
            else -> ResponseEntity(Response(false, "Echec de la regeneration du password "), HttpStatus.BAD_REQUEST)

        }

    }


    @GetMapping("region/{id}")
    fun findByRegion(@RequestParam(defaultValue = "0") page: Int,
                     @RequestParam(defaultValue = "10") size: Int,
                     @PathVariable id: Long): ResponseEntity<Any> {
        val pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"))
        val pageUser = userRepository.findAllByRegionIdAndIsDeleteOrderByNomAsc(id, Delete.No, pageRequest)
        val pagination = apiService.pagination(page, size, pageUser.map { it })
        return when {
            pagination.dataIsEmpty -> ResponseEntity(Response(false, "la liste est vide "), HttpStatus.NOT_FOUND)
            else -> ResponseEntity(pagination, HttpStatus.OK)
        }
    }



}

data class Regenerate(val idUser: Long, val option: String)
data class Password(val oldPassword: String, val newPassword: String)