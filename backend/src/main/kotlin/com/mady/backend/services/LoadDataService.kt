package com.mady.backend.services

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.mady.backend.entities.*
import com.mady.backend.repository.*
import com.mady.backend.utils.Delete
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.io.IOException
import java.time.Instant


@Service
class LoadDataService {
    private val logger = LoggerFactory.getLogger(LoadDataService::class.java)

    @Value("\${ws.app.regions}")
    private val isNotViews: String? = null

    @Value("\${ws.app.rapport}")
    private val isNotRapport: String? = null

    @Autowired
    lateinit var encoder: PasswordEncoder


    @Autowired
    lateinit var userConnected: UserConnected

    @Autowired
    private lateinit var regionRepository: RegionRepository

    @Autowired
    private lateinit var prefectureRepository: PrefectureRepository


    @Autowired
    private lateinit var communeRepository: CommuneRepository

    @Autowired
    private lateinit var quartierRepository: QuartierRepository

    @Autowired
    private lateinit var secteurRepository: SecteurRepository


    @Autowired
    private lateinit var permissionRepository: PermissionRepository

    @Autowired
    private lateinit var roleRepository: RoleRepository

    @Autowired
    private lateinit var userRepository: UserRepository

    fun init() {
        logger.info("############### Loading Databases...!!!!!!!!!!! ")
        loadPermission()
        loadRole()
        loadRegion()
        loadPrefecture()
        loadCommune()
        loadQuartier()
        loadSecteur()
        loadUser()
        logger.info("############ End of Data loading...###########")
    }

    fun loadPermission() {
        logger.info("####... loading permissions....#######")
        logger.info("######## count-permission: ${permissionRepository.count()}")
        var count = 0
        val mapper = ObjectMapper()
        val typeReference: TypeReference<List<Permission>> = object : TypeReference<List<Permission>>() {}
        val inputStream = TypeReference::class.java.getResourceAsStream("/json/permission.json")
        try {
            val permissions = mapper.readValue(inputStream, typeReference)
            for (permission in permissions) {
                if (!permissionRepository.findById(permission.id).isPresent) {
                    val myPersion = Permission(id = permission.id, libelle = permission.libelle)
                    permissionRepository.save(myPersion)
                    count++
                }

            }
//                permissionRepository.saveAll(permissions)
            logger.info("$count Permissions Saved!")
        } catch (e: IOException) {
            logger.warn("######## Not save permissions ########")
            logger.info("Unable to save permissions: " + e.message)
        }

    }

    fun loadRegion() {
        logger.info("####... loading regions....#######")
        logger.info("######## count-region: ${regionRepository.count()}")
        var count = 0
        val notformations = isNotViews?.split(",").orEmpty()
        val mapper = ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        val typeReference: TypeReference<List<Region>> = object : TypeReference<List<Region>>() {}
        val inputStream = TypeReference::class.java.getResourceAsStream("/json/region.json")
        try {
            val regions = mapper.readValue(inputStream, typeReference)
            for (region in regions) {
                if (!regionRepository.findById(region.id).isPresent) {
                    val isView = !(notformations.isNotEmpty() && notformations.contains(region.id.toString()))
                    val myRegion = Region(id = region.id,
                            code = region.code, nom = region.nom,
                            latitude = region.latitude, longitude = region.longitude, isView = isView,
                            description = region.description)
                    regionRepository.save(myRegion)
                    count++
                }
            }
            logger.info("$count Regions Saved!")
        } catch (e: IOException) {
            logger.warn("######## Not save regions ########")
            logger.info("Unable to save regions: " + e.message)
        }

    }


    fun loadPrefecture() {
        logger.info("####... loading prefectures....#######")
        logger.info("######## count-prefecture: ${prefectureRepository.count()}")
        var count = 0
        val mapper = ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        val typeReference: TypeReference<List<Prefecture>> = object : TypeReference<List<Prefecture>>() {}
        val inputStream = TypeReference::class.java.getResourceAsStream("/json/prefecture.json")
        try {
            val prefectures = mapper.readValue(inputStream, typeReference)
            for (prefecture in prefectures) {
                if (!prefectureRepository.findById(prefecture.id).isPresent) {
                    val region = regionRepository.findById(prefecture.region.id)
                    val isView = when {
                        region.isPresent -> region.get().isView
                        else -> true
                    }

                    val myPrefecture = Prefecture(id = prefecture.id, code = prefecture.code,
                            nom = prefecture.nom, region = region.get(), longitude = prefecture.longitude,
                            latitude = prefecture.latitude, description = prefecture.description, isView = isView
                    )
                    prefectureRepository.save(myPrefecture)
                    count++
                }

            }
            logger.info("$count Prefectures Saved!")
        } catch (e: IOException) {
            logger.warn("######## Not save prefectures ########")
            logger.info("Unable to save prefectures: " + e.message)
        }

    }


    fun loadCommune() {
        logger.info("####... loading communes....#######")
        logger.info("######## count-commune: ${communeRepository.count()}")
        var count = 0
        val mapper = ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        val typeReference: TypeReference<List<Commune>> = object : TypeReference<List<Commune>>() {}
        val inputStream = TypeReference::class.java.getResourceAsStream("/json/commune.json")
        try {
            val communes = mapper.readValue(inputStream, typeReference)
            for (commune in communes) {
                if (!communeRepository.findById(commune.id).isPresent) {
                    val prefecture = prefectureRepository.findById(commune.prefecture.id)
                    val isView = when {
                        prefecture.isPresent -> prefecture.get().isView
                        else -> true
                    }
                    val myCommune = Commune(id = commune.id, code = commune.code, nom = commune.nom, prefecture = commune.prefecture,
                            isView = isView, description = commune.description, latitude = commune.latitude,
                            longitude = commune.longitude)
                    communeRepository.save(myCommune)
                    count++
                }

            }
//                communeRepository.saveAll(communes)
            logger.info("$count Communes Saved!")
        } catch (e: IOException) {
            logger.warn("######## Not save communes ########")
            logger.info("Unable to save communes: " + e.message)
        }

    }

    fun loadSecteur() {
        logger.info("####... loading secteurs....#######")
        logger.info("######## count-secteur: ${secteurRepository.count()}")
        var count = 0
        val mapper = ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        val typeReference: TypeReference<List<Secteur>> = object : TypeReference<List<Secteur>>() {}
        val inputStream = TypeReference::class.java.getResourceAsStream("/json/secteur.json")
        try {
            val secteurs = mapper.readValue(inputStream, typeReference)
            for (secteur in secteurs) {
                if (!secteurRepository.findById(secteur.id).isPresent) {
                    val mySecteur = Secteur(id = secteur.id, code = secteur.code, nom = secteur.nom, quartier = secteur.quartier,
                             description = secteur.description, latitude = secteur.latitude,
                            longitude = secteur.longitude)
                    secteurRepository.save(mySecteur)
                    count++
                }

            }
//                secteurRepository.saveAll(secteurs)
            logger.info("$count Secteur Saved!")
        } catch (e: IOException) {
            logger.warn("######## Not save secteurs ########")
            logger.info("Unable to save secteurs: " + e.message)
        }

    }

    fun loadQuartier() {
        logger.info("####... loading quartiers....#######")
        logger.info("######## count-quartier: ${quartierRepository.count()}")
        var count = 0
        val mapper = ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        val typeReference: TypeReference<List<Quartier>> = object : TypeReference<List<Quartier>>() {}
        val inputStream = TypeReference::class.java.getResourceAsStream("/json/quartier.json")
        try {
            val quartiers = mapper.readValue(inputStream, typeReference)
            for (quartier in quartiers) {
                if (!quartierRepository.findById(quartier.id).isPresent) {
                    val myQuartier = Quartier(id = quartier.id, code = quartier.code, nom = quartier.nom,
                            longitude = quartier.longitude, latitude = quartier.latitude,
                            description = quartier.description, isView = true,
                            commune = quartier.commune)
                    quartierRepository.save(myQuartier)
                    count++
                }

            }
//                quartierRepository.saveAll(quartiers)
            logger.info("$count Quartiers Saved!")
        } catch (e: IOException) {
            logger.warn("######## Not save quartiers ########")
            logger.info("Unable to save quartiers: " + e.message)
        }


    }



    fun loadRole() {
        logger.info("####... loading roles....#######")
        logger.info("######## count-role: ${roleRepository.count()}")
        var count = 0
        val mapper = ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        val typeReference: TypeReference<List<Role>> = object : TypeReference<List<Role>>() {}
        val inputStream = TypeReference::class.java.getResourceAsStream("/json/role.json")
        try {
            val roles = mapper.readValue(inputStream, typeReference)
            for (r in roles) {
                if (!roleRepository.findById(r.id).isPresent) {
                    val myRole = Role(id = r.id, nom = r.nom, permissions = r.permissions, description = r.description)
                    roleRepository.save(myRole)
                    count++
                }
            }
            logger.info("$count Roles Saved!")
        } catch (e: IOException) {
            logger.warn("######## Not save roles ########")
            logger.info("Unable to save roles: " + e.message)
        }


    }

    fun loadUser() {
        logger.info("####... loading users....#######")
        logger.info("######## count-user: ${userRepository.count()}")
        var count = 0
        val mapper = ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        val typeReference: TypeReference<List<User>> = object : TypeReference<List<User>>() {}
        val inputStream = TypeReference::class.java.getResourceAsStream("/json/user.json")
        try {
            val users = mapper.readValue(inputStream, typeReference)
            for (user in users) {
                if(!userRepository.findById(user.id).isPresent || !userRepository.findByEmail(user.email).isPresent){
                    /*val localite = when{
                        user.localite?.id != null -> localiteRepository.findById(user.localite.id)
                        else ->  null
                    }*/
                    userRepository.save(user.copy(password = encoder.encode(user.password), code = userConnected.getCodeUser(),  isDelete = Delete.No, createdAt = Instant.now(), updatedAt = Instant.now()))
                    count++
                }
            }
            logger.info("$count Users Saved!")
        } catch (e: IOException) {
            logger.warn("######## Not save users ########")
            logger.info("Unable to save users: " + e.message)
        }

    }


}