package com.mady.backend.repository

import com.mady.backend.entities.Role
import com.mady.backend.entities.User
import com.mady.backend.utils.Delete
import com.mady.backend.utils.Statut
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface UserRepository : JpaRepository<User, Long> {

    fun findByUsername(username: String): Optional<User>
    fun findByEmail(email: String): Optional<User>
    fun findByResetPasswordToken(resetPasswordToken: String): Optional<User>
    fun findByNom(nom: String): List<User>
    fun findByPrenom(prenom: String): List<User>
    fun findByTelephone(telephone: String): Optional<User>
    fun findByStatut(status: Statut): List<User>
    fun findByUsernameOrEmail(username: String, email: String): Optional<User>
    fun findByUsernameAndStatut(username: String, statut: Statut): User?
    fun findByIsDelete(isDetete: Delete): List<User>
    fun findByUsernameAndIsDelete(username: String, isDelete: Delete): User?
    fun findByCode(code: String): Optional<User>

    fun findByRoleNomAndIsDeleteOrderByNomAsc(nom: String, isDelete: Delete, pageable: Pageable): Page<User>
    fun findBySecteurIdAndRoleNomAndIsDeleteOrderByNomAsc(id: Long, nom: String, isDelete: Delete, pageable: Pageable): Page<User>
    fun findByQuartierIdAndRoleNomAndIsDeleteOrderByNomAsc(id: Long, nom: String, isDelete: Delete, pageable: Pageable): Page<User>
    fun findByCommuneIdAndRoleNomAndIsDeleteOrderByNomAsc(id: Long, nom: String, isDelete: Delete, pageable: Pageable): Page<User>
    fun findByPrefectureIdAndRoleNomAndIsDeleteOrderByNomAsc(id: Long, nom: String, isDelete: Delete, pageable: Pageable): Page<User>
    fun findByRegionIdAndRoleNomAndIsDeleteOrderByNomAsc(id: Long, nom: String, isDelete: Delete, pageable: Pageable): Page<User>

    fun findAllByIsDeleteOrderByNomAsc(isDelete: Delete, pageable: Pageable): Page<User>
    fun findBySecteurIdAndIsDeleteOrderByNomAsc(id: Long, isDelete: Delete, pageable: Pageable): Page<User>
    fun findByQuartierIdAndIsDeleteOrderByNomAsc(id: Long, isDelete: Delete, pageable: Pageable): Page<User>
    fun findByCommuneIdAndIsDeleteOrderByNomAsc(id: Long, isDelete: Delete, pageable: Pageable): Page<User>
    fun findByPrefectureIdAndIsDeleteOrderByNomAsc(id: Long, isDelete: Delete, pageable: Pageable): Page<User>
    fun findByRegionIdAndIsDeleteOrderByNomAsc(id: Long, isDelete: Delete, pageable: Pageable): Page<User>


    fun findByRoleNomAndIsDeleteOrderByNomAsc(nom: String, isDelete: Delete): List<User>
    fun findAllByRegionIdAndIsDeleteOrderByNomAsc(id: Long, isDelete: Delete, pageable: Pageable): Page<User>
    fun findAllByCommuneIdAndIsDeleteOrderByNomAsc(idCommune: Int, isDelete: Delete): List<User>
    fun findAllByRegionIdAndRoleNomAndIsDeleteOrderByNomAsc(idRegion: Int, nom:String, isDelete: Delete): List<User>
    fun findTopByOrderByIdDesc(): Optional<User>
    fun findBySecteurId(id: Long): List<User>

    @Query("SELECT COUNT(*) AS nombre \n" +
            "FROM  ws_users U, commune C, role R\n" +
            "WHERE U.commune_id=C.id AND R.id=U.role_id AND R.nom='ROLE_POINT_FOCAL'  AND C.id = :idCommune " +
            " AND U.is_delete=1 \n",
            nativeQuery = true)
    fun verificationByCommune(idCommune: Long): Long


    @Query("SELECT COUNT(*) AS nombre \n" +
            "FROM  ws_users U, localite L, role R\n" +
            "WHERE U.localite_id=L.id AND R.id=U.role_id AND R.nom='ROLE_SURVEILLANT' AND  L.id_secteur = :idSecteur " +
            " AND U.is_delete=1 \n",
            nativeQuery = true)
    fun verificationBySecteur(idSecteur: Int): Long

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM ws_users WHERE username= :username", nativeQuery = true)
    fun deleteByUsername(@Param("username") username: String)

    @Modifying
    @Transactional
    @Query(value = "UPDATE ws_users  set statut = :statut where id= :id", nativeQuery = true)
    fun updateStatutUser(@Param("statut") statut: Int,
                         @Param("id") id: Long): Int

    @Modifying
    @Transactional
    @Query(value = "UPDATE User u  SET u.isDelete = :isDelete WHERE u.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)
}