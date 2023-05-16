package com.mady.backend.services

import com.mady.backend.entities.Commune
import com.mady.backend.entities.Region
import com.mady.backend.entities.User
import com.mady.backend.repository.CommuneRepository
import com.mady.backend.repository.PermissionRepository
import com.mady.backend.repository.RoleRepository
import com.mady.backend.repository.UserRepository
import com.mady.backend.security.JwtProvider
import com.mady.backend.utils.Delete
import com.mady.backend.utils.Delete.*
import com.mady.backend.utils.Statut
import com.mady.backend.utils.Statut.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId


@Service
class UserConnected {

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired lateinit var roleRepository: RoleRepository

    @Autowired lateinit var permissionRepository: PermissionRepository

    @Autowired lateinit var communeRepository: CommuneRepository

    @Autowired
    lateinit var jwtProvider: JwtProvider


    fun getUserConnected(): User {
        val username = SecurityContextHolder.getContext().authentication.name
        return userRepository.findByUsername(username).filter { user -> (user.isDelete == No && user.statut == Activated) }.get()
    }

    fun updateStatut(statut: Statut) = if (statut == Activated) Desactivated else Activated
    fun updateDelete(isDelete: Delete) = if(isDelete == Yes) No else Yes
    fun updateVedette(isVedette: Boolean) = !isVedette


    fun getUsernameFromToken(token: String): User{
        val username = jwtProvider.getUserNameFromJwtToken(token)
        return userRepository.findByUsername(username).filter { user -> (user.isDelete == No && user.statut == Activated) }.get()
    }


    fun getAutorisation(myPermission: String ): Boolean {
        val user = getUserConnected()
        val permission = permissionRepository.findByLibelle(myPermission)
        return roleRepository.findByNomAndPermissions(user.role.nom, permission.get()).map { true
        }.orElse(false)
    }

    fun getRandomString(length: Int): String {
        val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
        return (1..length)
                .map { allowedChars.random() }
                .joinToString("")
    }

    fun getRandomPassword(): String{
        val allowedChars = ('A'..'Z')  + ('1'..'9')
        return (1..6)
                .map { allowedChars.random()}
                .joinToString("")
    }

    fun getCodeUser(): String {
        val allowedChars = ('A'..'Z')  + ('1'..'9')
        return (1..5)
                .map { allowedChars.random() }
                .joinToString("")
    }

    fun getCodeRandom():Long{
        val allowedChars = ('1'..'9')
        return (1..4)
                .map { allowedChars.random() }
                .joinToString("").toLong()
    }

    fun getCodeRandom(length: Int):String{
        val allowedChars = ('1'..'9')
        return (1..length)
                .map { allowedChars.random() }
                .joinToString("")
    }
    fun generateInstantCode(): String {
        val filtered = "-.,;:Z"
        return Instant.now().toString().filterNot { filtered.indexOf(it) > -1 }.replace("T", ",")
    }


    fun getCodeCas(user: User) = "${user.code!!}-${generateInstantCode().split(",").toTypedArray()[1]}"


    fun generateSessionCode(): String {
        val filtered = "-.,;:ZT"
        return Instant.now().toString().filterNot { filtered.indexOf(it) > -1 }
    }

    fun generateSessionCodeAlerte(): String {
        val filtered = "-.,;:Z"
        return Instant.now().toString().filterNot { filtered.indexOf(it) > -1 }.replace("T", "@").split("@").toTypedArray()[1]
    }

    fun generateAlerteCodeCommune(commune: Commune) = commune.code + "-" + generateSessionCodeAlerte().substring(8,12)

    fun generateAlerteCode(region: Region) = region.code + "-" + generateSessionCodeAlerte()


    fun getCurrentMonthNumber(): Int {
//        val z = ZoneId.of("UTC")
//        val dateDebut = "2021-01-27"
//        val debut = LocalDate.parse(dateDebut).atStartOfDay(z).toInstant()
        val filtered = ".,;:Z"
//        return debut.toString().filterNot { filtered.indexOf(it) > -1 }.replace("T", ",").split("-").toTypedArray()[1].toInt()
        return Instant.now().toString().filterNot { filtered.indexOf(it) > -1 }.replace("T", ",").split("-").toTypedArray()[1].toInt()
    }

    fun getCurrentYearhNumber(): Long {
        val z = ZoneId.of("UTC")
        val dateDebut = "2021-01-27"
        val debut = LocalDate.parse(dateDebut).atStartOfDay(z).toInstant()
        val filtered = ".,;:Z"
//        return debut.toString().filterNot { filtered.indexOf(it) > -1 }.replace("T", ",").split("-").toTypedArray()[1].toInt()
        return Instant.now().toString().filterNot { filtered.indexOf(it) > -1 }.replace("T", ",").split("-").toTypedArray()[0].toLong()
    }


}