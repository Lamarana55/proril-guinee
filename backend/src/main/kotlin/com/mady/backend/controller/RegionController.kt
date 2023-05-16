package com.mady.backend.controller


import com.mady.backend.entities.Region
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
@RequestMapping("/api/regions")
@Api(description = "Controlleur de l'entité region ")
class RegionController {
    @Autowired
    private lateinit var regionRepository: RegionRepository

    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les regions ")
    fun index(): List<Region> = regionRepository.findAll().sortedBy { it.id }

    @GetMapping("{id}")
    @ApiOperation("Récuperation d'une region en fonction de son id ")
    fun show(@PathVariable id: Long): Optional<Region> = regionRepository.findById(id)

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'une region ")
    fun save(@Valid @RequestBody region: Region) = regionRepository.save(region)

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement des region ")
    fun saveAll(@Valid @RequestBody listRegion: List<Region>): ResponseEntity<Any>{
        val list = regionRepository.saveAll(listRegion)
        return when {
            list.isEmpty() -> ResponseEntity(ResponseException("Echec"), HttpStatus.BAD_REQUEST)
            else -> ResponseEntity(list, HttpStatus.CREATED)
        }
    }

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'une region  ")
    fun update(@PathVariable id:Long, @RequestBody region: Region): ResponseEntity<Region> {
        return regionRepository.findById(id).map { existRegion ->
            val newRegion = existRegion
                    .copy(  nom = region.nom,
                            code = region.code,
                            description = region.description,
                            updatedAt = Instant.now()
                    )
            ResponseEntity.ok().body(regionRepository.save(newRegion))
        }.orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'une region en fonction du nom")
    fun findByNom(@RequestParam nom: String) = regionRepository.findByNom(nom)

    @GetMapping("findByCode")
    @ApiOperation("Récuperation d'un region en fonction du code")
    fun findByCode(@RequestParam code: String): Region = regionRepository.findByCode(code)


}