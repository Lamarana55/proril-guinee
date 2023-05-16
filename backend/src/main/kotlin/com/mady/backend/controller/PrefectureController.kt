package com.mady.backend.controller

import com.mady.backend.entities.Prefecture
import com.mady.backend.repository.PrefectureRepository
import com.mady.backend.repository.RegionRepository
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
@RequestMapping("/api/prefectures")
@Api(description = "Controlleur de l'entité prefecture ")
class PrefectureController {
    @Autowired
    private lateinit var prefectureRepository: PrefectureRepository

    @Autowired lateinit var regionRepository: RegionRepository

    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les prefectures ")
    fun index(): List<Prefecture> = prefectureRepository.findAll()

    @GetMapping("{id}")
    @ApiOperation("Récuperation d'une prefecture en fonction de son id ")
    fun show(@PathVariable id: Long): Optional<Prefecture> = prefectureRepository.findById(id)

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une prefecture ")
    fun save(@Valid @RequestBody prefecture: Prefecture) = prefectureRepository.save(prefecture)

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'une prefecture ")
    fun saveAll(@Valid @RequestBody listPrefecture: List<Prefecture>): ResponseEntity<Any>{
        val list = prefectureRepository.saveAll(listPrefecture)
        return when {
            list.isEmpty() -> ResponseEntity(ResponseException("Echec"), HttpStatus.BAD_REQUEST)
            else -> ResponseEntity(list, HttpStatus.CREATED)
        }
    }

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'une prefecture  ")
    fun update(@PathVariable id:Long, @RequestBody prefecture: Prefecture): ResponseEntity<Prefecture> {
        return prefectureRepository.findById(id).map { existPrefecture ->
            val newPrefecture = existPrefecture
                    .copy(  nom = prefecture.nom,
                            code = prefecture.code,
                            description = prefecture.description,
                            region = prefecture.region,
                            updatedAt = Instant.now()
                    )
            ResponseEntity.ok().body(prefectureRepository.save(newPrefecture))
        }.orElse(ResponseEntity.notFound().build())
    }

    /*@DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer une prefecture ")
    fun delete(@PathVariable id: Long): MessageResponse {
        return prefectureRepository.findById(id).map {
            prefectureRepository.deleteById(id)
            MessageResponse("L'element qui a pour $id a été supprimer ", "success")
        }.orElse(MessageResponse("Echec de la suppression ", "Echec"))
    }
*/
    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'une prefecture en fonction du nom")
    fun findByNom(@RequestParam nom: String) = prefectureRepository.findByNom(nom)

    @GetMapping("findByCode")
    @ApiOperation("Récuperation d'un prefecture en fonction du code")
    fun findByCode(@RequestParam code: String): Prefecture = prefectureRepository.findByCode(code)



    @GetMapping("findByRegion/{idRegion}")
    @ApiOperation("Récuperation des prefectures en fonction de la région donné ")
    fun findByRegion(@PathVariable idRegion: Long): List<Prefecture>{
        val region = regionRepository.findById(idRegion).get()
        return prefectureRepository.findByRegion(region)
    }


}