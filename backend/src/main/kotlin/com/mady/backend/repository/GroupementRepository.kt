package com.mady.backend.repository

import com.mady.backend.entities.Groupement
import com.mady.backend.utils.Delete
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface GroupementRepository : JpaRepository<Groupement, Long> {

    fun findByNom(nom: String): Optional<Groupement>
    fun findByTelephoneAndIsDelete(telephone: String,isDelete: Delete, pageable: Pageable): Page<Groupement>
    fun findByEmailAndIsDelete(email: String, isDelete: Delete, pageable: Pageable): Page<Groupement>
    fun findAllByIsDeleteOrderByNomAsc(isDelete: Delete, pageable: Pageable): Page<Groupement>



    @Modifying
    @Transactional
    @Query(value = "UPDATE Groupement G SET G.isDelete = :isDelete WHERE G.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)
}