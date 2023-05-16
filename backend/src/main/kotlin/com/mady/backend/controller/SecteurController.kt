package com.mady.backend.controller

import com.mady.backend.entities.Secteur
import com.mady.backend.repository.QuartierRepository
import com.mady.backend.repository.SecteurRepository
import com.mady.backend.utils.CROSS_ORIGIN
import com.mady.backend.utils.MessageResponse
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant
import java.util.*
import javax.validation.Valid

@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/secteurs")
@Api(description = "Controlleur de l'entité secteur ")
class SecteurController {
    @Autowired
    private lateinit var secteurRepository: SecteurRepository

    @Autowired
    lateinit var quartierRepository: QuartierRepository


    @GetMapping
    @ApiOperation("Récuperation de la liste de tous les secteurs ")
    fun index(): List<Secteur> = secteurRepository.findAll()

    @GetMapping("{id}")
    @ApiOperation("Récuperation d'une secteur en fonction de son id ")
    fun show(@PathVariable id: Long): Optional<Secteur> = secteurRepository.findById(id)

    @PostMapping
    @ApiOperation("Méthode qui permet l'enregistrement d'un secteur ")
    fun save(@Valid @RequestBody secteur: Secteur):Secteur {
        var code: Any
        var listSecteur = secteurRepository.findByQuartier(secteur.quartier)
        when {
            listSecteur.isNotEmpty() -> {
                var lastSecteur = listSecteur.last()
                println(lastSecteur)
                code = (lastSecteur.code?.substring(11, 13)!!.toInt() + 1).toString()
                if(code.length == 1) code = "0$code"
                code = "${secteur.quartier.code}$code"
                secteur.code = code
                println("code : $secteur")
            }
            else -> {
                println("Element introuvable  ")
                code = secteur.quartier.code + "01"
                secteur.code = code
                println("code : $secteur")
            }
        }
        return secteurRepository.save(secteur)
    }

    @PostMapping("/all")
    fun saveAll(@Valid @RequestBody secteurs: List<Secteur>): ResponseEntity<List<Secteur>> = ResponseEntity.ok(secteurRepository.saveAll(secteurs))

    @PutMapping("{id}")
    @ApiOperation("Méthode qui permet la mise à jour  d'un secteur  ")
    fun update(@PathVariable id: Long, @RequestBody secteur: Secteur): ResponseEntity<Secteur> {
        return secteurRepository.findById(id).map { existSecteur ->
            val newSecteur = existSecteur
                    .copy(nom = secteur.nom,
                            code = secteur.code,
                            description = secteur.description,
                            quartier = secteur.quartier,
                            updatedAt = Instant.now()
                    )
            ResponseEntity.ok().body(secteurRepository.save(newSecteur))
        }.orElse(ResponseEntity.notFound().build())
    }

    @DeleteMapping("{id}")
    @ApiOperation("Méthode qui permet de supprimer un secteur ")
    fun delete(@PathVariable id: Long): MessageResponse {
        return secteurRepository.findById(id).map {
            secteurRepository.deleteById(id)
            MessageResponse("L'element qui a pour $id a été supprimer ", "success")
        }.orElse(MessageResponse("Echec de la suppression ", "Echec"))
    }

    @GetMapping("findByNom")
    @ApiOperation("Récuperation d'un secteur en fonction du nom")
    fun findByNom(@RequestParam nom: String): List<Secteur> = secteurRepository.findByNom(nom)

    @GetMapping("findByCode")
    @ApiOperation("Récuperation d'un secteur en fonction du code")
    fun findByCode(@RequestParam code: String): Secteur = secteurRepository.findByCode(code)

    @GetMapping("findByQuartier/{idQuartier}")
    @ApiOperation("Récuperation des secteurs en fonction du quartier donné ")
    fun findByQuartier(@PathVariable idQuartier: Long): List<Secteur> {
        val quartier = quartierRepository.findById(idQuartier).get()
        return secteurRepository.findByQuartier(quartier)
    }




}