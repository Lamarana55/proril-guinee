package com.mady.backend.controller


import com.mady.backend.entities.Commune
import com.mady.backend.repository.CommuneRepository
import com.mady.backend.repository.PrefectureRepository
import com.mady.backend.utils.CROSS_ORIGIN
import com.mady.backend.utils.ResponseException
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.util.*
import javax.validation.Valid

@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/communes")
@Api(description = "Controlleur de l'entité commune ")
class CommuneController {
    @Autowired
    private lateinit var communeRepository: CommuneRepository

    @Autowired
    private lateinit var prefectureRepository: PrefectureRepository


    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les communes ")
    fun index(): ResponseEntity<List<Commune>> = ResponseEntity.ok(communeRepository.findAll())

    @GetMapping("{id}")
    @ApiOperation("Récuperation d'une commune en fonction de son id ")
    fun show(@PathVariable id: Long): Optional<Commune> = communeRepository.findById(id)

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une commune ")
    fun save(@Valid @RequestBody commune: Commune) = communeRepository.save(commune)

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement une liste des communes ")
    fun saveAll(@Valid @RequestBody listCommune: List<Commune>): ResponseEntity<Any>{
        val list = communeRepository.saveAll(listCommune)
        return when {
            list.isEmpty() -> ResponseEntity(ResponseException("Echec"), HttpStatus.BAD_REQUEST)
            else -> ResponseEntity(list, HttpStatus.CREATED)
        }
    }

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'une commune  ")
    fun update(@PathVariable id:Long, @RequestBody commune: Commune): ResponseEntity<Commune> {
        return communeRepository.findById(id).map { existCommune ->
            val newCommune = existCommune
                    .copy(  nom = commune.nom,
                            code = commune.code,
                            description = commune.description,
                            prefecture = commune.prefecture,
                            updatedAt = Instant.now())
            ResponseEntity.ok().body(communeRepository.save(newCommune))
        }.orElse(ResponseEntity.notFound().build())
    }

   /* @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une commune ")
    fun delete(@PathVariable id: Long): MessageResponse {
        return communeRepository.findById(id).map {
            communeRepository.deleteById(id)
            MessageResponse("L'element qui a pour $id a été supprimer ", "success")
        }.orElse(MessageResponse("Echec de la suppression ", "Echec"))
    }
*/
    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'une commune en fonction du nom")
    fun findByNom(@RequestParam nom: String) = communeRepository.findByNom(nom)

    @GetMapping("findByCode")
    @ApiOperation("Récuperation d'une commune en fonction du code")
    fun findByCode(@RequestParam code: String): Commune = communeRepository.findByCode(code)

    @GetMapping("findByPrefecture/{idPrefecture}")
    @ApiOperation("Récuperation des communes en fonction du préfecture ")
    fun findByPrefecture(@PathVariable idPrefecture: Long): List<Commune>{
        val prefecture = prefectureRepository.findById(idPrefecture).get()
        return communeRepository.findByPrefecture(prefecture)
    }


}