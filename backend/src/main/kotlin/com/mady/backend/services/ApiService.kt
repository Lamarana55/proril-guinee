package com.mady.backend.services

import com.byteowls.jopencage.JOpenCageGeocoder
import com.byteowls.jopencage.model.JOpenCageReverseRequest
import com.mady.backend.entities.Region
import com.mady.backend.entities.User
import com.mady.backend.entities.ValidationCode
import com.mady.backend.repository.*
import com.mady.backend.utils.Delete
import com.mady.backend.utils.Pagination
import com.mady.backend.utils.Response
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.data.domain.PageImpl as PageImpl1

@Service
class ApiService {

    @Value("\${ws.app.key}")
    private val key: String? = null

    @Autowired
    private lateinit var regionRepository: RegionRepository


    @Autowired
    private lateinit var prefectureRepository: PrefectureRepository

    @Autowired
    private lateinit var communeRepository: CommuneRepository


    @Autowired
    private lateinit var userRepository: UserRepository


    @Autowired
    private lateinit var validationCodeRepository: ValidationCodeRepository

    @Autowired
    private lateinit var userConnected: UserConnected




    fun myTreeUsers(page: Page<User>): Pagination{
        return pagination(page.totalPages, page.size, page.map { it })
    }

    fun treeUsers(users: List<User>, total: Long, pageable: Pageable): Pagination{
        val page = PageImpl1(users, pageable, total)
        return this.pagination(pageable.pageNumber, pageable.pageSize, page.map { it })

    }


    fun getRegion(): ResponseEntity<Any> {
        val listRegion: MutableList<DRegion> = mutableListOf()
        val list = regionRepository.findAll().filter { it.isDelete == Delete.No && it.isView }.sortedBy { it.id }

        for (data in list) {
            var region = DRegion(id = data.id, nom = data.nom)
            listRegion.add(region)
        }
        return when {
            listRegion.isNotEmpty() -> ResponseEntity.ok().body(listRegion)
            else -> ResponseEntity(Response(false, "La liste des types de cas est vide !"), HttpStatus.OK)
        }
    }

    fun getPrefectures(id: Long): ResponseEntity<Any> {
        val listPrefecture: MutableList<DPrefecture> = mutableListOf()
        val region = regionRepository.findById(id).get()
        val list = prefectureRepository.findByRegion(region).filter { it.isDelete == Delete.No && it.isView }

        for (data in list) {
            var prefecture = DPrefecture(id = data.id, nom = data.nom)
            listPrefecture.add(prefecture)
        }
        return when {
            listPrefecture.isNotEmpty() -> ResponseEntity.ok().body(listPrefecture)
            else -> ResponseEntity("La liste des prefectures pour la region de ${region.nom} est vide !", HttpStatus.OK)
        }
    }


    fun authentification(msisdn: String): Long {
        val validation = validationCodeRepository.findByPhone(msisdn)
        when {
            validation.isPresent -> validationCodeRepository.deleteById(validation.get().id!!)
        }
        val validationCode = validationCodeRepository.save(ValidationCode(code = userConnected.getCodeRandom(), phone = msisdn))
        return validationCode.code
    }


    fun pagination(page: Int, size: Int, elements: Page<Any>): Pagination {
        val lastPage = (elements.totalElements.toInt() / size)
        val totalPage = when {
            elements.totalPages == 0 -> 0
            else -> elements.totalPages - 1
        }
        return Pagination(data = elements.content, totalItem = elements.totalElements, totalPage = elements.totalPages, lastPage = lastPage, currentPage = page, isLast = elements.isLast, isFirst = elements.isFirst, dataIsEmpty = elements.isEmpty)
    }


    fun getCommuneByLatitudeAndLongitude(latitude: Double, longitude: Double): List<DCommune> {
        try {
            val jOpenCageGeocoder = JOpenCageGeocoder(key)
            val request = JOpenCageReverseRequest(latitude, longitude)
            request.language = "fr"
            request.isNoDedupe = true // don't return duplicate results
            request.limit = 5 // only return the first 5 results (default is 10)
            request.isNoAnnotations = true // exclude additional info such as calling code, timezone, and currency
            request.minConfidence = 3 // restrict to results with a confidence rating of at least 3 (out of 10)
//            val response = jOpenCageGeocoder.reverse(request).firstComponents.state.split(" ")
            val response = jOpenCageGeocoder.reverse(request)
            var list: MutableList<DCommune> = mutableListOf()
            var cityDistrict = response.firstComponents.cityDistrict
            var town = response.firstComponents.town
            var county = response.firstComponents.county
            var city = response.firstComponents.city
            println("Town: $town county: $county  city: $city")
            return when {
                cityDistrict != null -> {
                    var commune = communeRepository.findByNom(cityDistrict)
                    if (commune.isPresent) {
                        list.add(DCommune(id = commune.get().id, nom = commune.get().nom))
                    }
                    list
                }
                town != null -> {
                    var commune = communeRepository.findByNom(town)
                    if (commune.isPresent) {
                        list.add(DCommune(id = commune.get().id, nom = commune.get().nom))
                    }
                    list
                }
                county != null -> {
                    var prefecture = prefectureRepository.findByNom(county.split(" ")[2])
                    if (prefecture.isPresent) {
                        val communes = communeRepository.findByPrefectureId(prefecture.get().id)
                        for (data in communes) {
                            list.add(DCommune(id = data.id, nom = data.nom))
                        }
                    }
                    list
                }
                city != null -> {
                    var prefecture = prefectureRepository.findByNom(city)
                    if (prefecture.isPresent) {
                        val communes = communeRepository.findByPrefectureId(prefecture.get().id)
                        for (data in communes) {
                            list.add(DCommune(id = data.id, nom = data.nom))
                        }
                    }
                    list
                }
                else -> list
            }

        } catch (e: Exception) {
            println(e.message)
            throw Exception("Imposible de trouver la localisation ")
        }
    }


    fun getLocation(latitude: Double, longitude: Double): Region {

        try {
            val jOpenCageGeocoder = JOpenCageGeocoder(key)
            val request = JOpenCageReverseRequest(latitude, longitude)
            request.language = "fr"
            request.isNoDedupe = true // don't return duplicate results
            request.limit = 5 // only return the first 5 results (default is 10)
            request.isNoAnnotations = true // exclude additional info such as calling code, timezone, and currency
            request.minConfidence = 3 // restrict to results with a confidence rating of at least 3 (out of 10)
//            val response = jOpenCageGeocoder.reverse(request).firstComponents.state.split(" ")
            val response = jOpenCageGeocoder.reverse(request)
            val name = when {
                response.firstComponents.state != null -> {
                    response.firstComponents.state.split(" ")[2]
                }
                response.firstComponents.city != null -> {
                    response.firstComponents.city
                }
                else -> "Conakry"
            }

            var region = regionRepository.findByNom(name)
            return region.orElseGet(null)
        } catch (e: Exception) {
            println(e.message)
            throw Exception("Imposible de trouver la localisation ")
        }

    }

}




//data class DTypeCas(val id: Long, val type: String, val rapport: Boolean)
data class DRegion(val id: Long, val nom: String)
data class DPrefecture(val id: Long, val nom: String)
data class DCommune(val id: Long, val nom: String)
//data class DMois(val id: Long,val code: Int, val mois: String, val annee: Long)