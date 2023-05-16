package com.mady.backend.controller


import com.mady.backend.entities.Quartier
import com.mady.backend.repository.CommuneRepository
import com.mady.backend.repository.QuartierRepository
import com.mady.backend.utils.CROSS_ORIGIN
import com.mady.backend.utils.Delete
import com.mady.backend.utils.MessageResponse
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
@RequestMapping("/api/quartiers")
@Api(description = "Controlleur de l'entité quartier ")
class QuartierController {
    @Autowired
    private lateinit var quartierRepository: QuartierRepository

    @Autowired
    lateinit var communeRepository: CommuneRepository


    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les quartiers ")
    fun index(): List<Quartier> = quartierRepository.findAll()

    @GetMapping("{id}")
    @ApiOperation("Récuperation d'une quartier en fonction de son id ")
    fun show(@PathVariable id: Long): Optional<Quartier> = quartierRepository.findById(id)

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'un quartier ")
    fun save(@Valid @RequestBody quartier: Quartier): Quartier {
        var code: Any
        var listQuartier = quartierRepository.findByCommune(quartier.commune)

        when {
            listQuartier.isNotEmpty() -> {
                var lastQuartier = listQuartier.last()
                code = (lastQuartier.code?.substring(11, 13)!!.toInt() + 1).toString()
                if(code.length == 1) code = "0$code"
                code = "${quartier.commune.code}$code"
                quartier.code = code
                println("code : $quartier")
            }
            else -> {
                println("Element introuvable  ")
                code = quartier.commune.code + "01"
                quartier.code = code
                println("code : $quartier")
            }
        }
        return quartierRepository.save(quartier)

    }

    @PostMapping("/all")
    @ApiOperation("Méthode qui permet l'enregistrement d'un lot de quartier ")
    fun saveAll(@Valid @RequestBody listQuartier: List<Quartier>): ResponseEntity<Any>{
        val list = quartierRepository.saveAll(listQuartier)
        return when {
            list.isEmpty() -> ResponseEntity(ResponseException("Echec"), HttpStatus.BAD_REQUEST)
            else -> ResponseEntity(list, HttpStatus.CREATED)
        }
    }

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un quartier  ")
    fun update(@PathVariable id: Long, @RequestBody quartier: Quartier): ResponseEntity<Quartier> {
        return quartierRepository.findById(id).map { existQuartier ->
            val newQuartier = existQuartier
                    .copy(nom = quartier.nom,
                            code = quartier.code,
                            description = quartier.description,
                            commune = quartier.commune,
                            updatedAt = Instant.now()
                    )
            ResponseEntity.ok().body(quartierRepository.save(newQuartier))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer un quartier ")
    fun delete(@PathVariable id: Long): MessageResponse {
        return quartierRepository.findById(id).map {
            quartierRepository.deleteById(id)
            MessageResponse("L'element qui a pour $id a été supprimer ", "success")
        }.orElse(MessageResponse("Echec de la suppression ", "Echec"))
    }

    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'un quartier en fonction du nom")
    fun findByNom(@RequestParam nom: String): List<Quartier> = quartierRepository.findByNom(nom)

    @GetMapping("findByCode")
    @ApiOperation("Récuperation d'un quartier en fonction du code")
    fun findByCode(@RequestParam code: String): Quartier = quartierRepository.findByCode(code)


    @GetMapping("findByCommune/{id}")
    @ApiOperation("Récuperation des quartiers en fonction de la commune donné ")
    fun findByCommune(@PathVariable id: Long): List<Quartier> {
        val commune = communeRepository.findById(id).get()
        return  quartierRepository.findByCommune(commune)
    }


}