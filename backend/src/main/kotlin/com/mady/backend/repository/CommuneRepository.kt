package com.mady.backend.repository

import com.mady.backend.entities.Commune
import com.mady.backend.entities.Prefecture
import com.mady.backend.utils.Delete
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface CommuneRepository:JpaRepository<Commune,Long>{
    fun findAllByIsDelete(isDelete: Delete, pageable: Pageable): Page<Commune>
    fun findByNom(nom: String): Optional<Commune>
    fun findByCode(code: String): Commune
    fun findByPrefecture(prefecture: Prefecture): List<Commune>
    fun findByPrefectureId(id: Long): List<Commune>

    @Modifying
    @Transactional
    @Query(value = "UPDATE Commune C SET C.isDelete = :isDelete WHERE C.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)
}