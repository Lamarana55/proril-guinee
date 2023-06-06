package com.mady.backend.repository

import com.mady.backend.entities.Marque
import com.mady.backend.utils.Delete
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface MarqueRepository : JpaRepository<Marque, Long>{

    fun findByLibelle(libelle: String): Optional<Marque>
    fun findByGroupementId(id: Long): List<Marque>
    fun findByLibelleAndIsDelete(libelle: String,isDelete: Delete, pageable: Pageable): Page<Marque>
    fun findByGroupementNomAndIsDelete(nom: String, isDelete: Delete, pageable: Pageable): Page<Marque>
    fun findAllByIsDeleteOrderByLibelleAsc(isDelete: Delete, pageable: Pageable): Page<Marque>


    @Modifying
    @Transactional
    @Query(value = "UPDATE Marque M SET M.isDelete = :isDelete WHERE M.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)

}