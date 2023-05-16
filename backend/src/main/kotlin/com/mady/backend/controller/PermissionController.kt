package com.mady.backend.controller

import com.mady.backend.entities.Permission
import com.mady.backend.repository.PermissionRepository
import com.mady.backend.utils.CROSS_ORIGIN
import com.mady.backend.utils.Delete
import com.mady.backend.utils.MessageResponse
import com.mady.backend.utils.Response
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.util.*
import javax.validation.Valid

@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/permissions")
@Api(description = "Controlleur de l'entité permission ")
class PermissionController {
    @Autowired
    private lateinit var permissionRepository: PermissionRepository

    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les permissions ")
    fun index(): List<Permission> = permissionRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).filter { permission -> permission.isDelete == Delete.No }

    @GetMapping("{id}")
    @ApiOperation("Récuperation d'une permission en fonction de son id ")
    fun show(@PathVariable id: Long): ResponseEntity<Any> {
        val existPermission = permissionRepository.findById(id).filter { permission -> permission.isDelete == Delete.No }
        return if(existPermission.isPresent){
            ResponseEntity(existPermission.get(), HttpStatus.OK)
        }else{
            ResponseEntity("Impossible de trouver l'elements", HttpStatus.NOT_FOUND)
        }
    }

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une permission ")
    fun save(@Valid @RequestBody permission: Permission) = permissionRepository.save(permission)

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement une liste des permissions ")
    fun saveAll(@Valid @RequestBody listPermission: List<Permission>) : ResponseEntity<Any>{
        var list: MutableList<Permission> = mutableListOf()
        for (permission in listPermission){
            if(!permissionRepository.findByLibelle(permission.libelle).isPresent){
                list.add(permissionRepository.save(permission))
            }
        }

        return ResponseEntity(Response(true, list), HttpStatus.OK)
    }

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'une permission  ")
    fun update(@PathVariable id:Long, @RequestBody permission: Permission): ResponseEntity<Permission> {
        return permissionRepository.findById(id).map { existPermission ->
            val newPermission = existPermission
                    .copy(  libelle = permission.libelle,
                            description = permission.description,
                            updatedAt = Instant.now()
                    )
            ResponseEntity.ok().body(permissionRepository.save(newPermission))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une permission ")
    fun delete(@PathVariable id: Long): MessageResponse {
        return permissionRepository.findById(id).map {
//            permissionRepository.deleteById(id)
            permissionRepository.updateDelete(Delete.Yes, id)
            MessageResponse("L'element qui a pour $id a été supprimer ", "success")
        }.orElse(MessageResponse("Echec de la suppression ", "Echec"))
    }

    @GetMapping("findByLibelle")
    @ApiOperation("Récuperation d'une permission en fonction du nom")
    fun findByLibelle(@RequestParam libelle: String): Optional<Permission> = permissionRepository.findByLibelle(libelle)


}