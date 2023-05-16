package com.mady.backend.repository


import com.mady.backend.entities.Commune
import com.mady.backend.entities.Quartier
import com.mady.backend.utils.Delete
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional

interface QuartierRepository : JpaRepository<Quartier, Long>{
    fun findByNom(nom: String): List<Quartier>
    fun findByCode(code: String): Quartier
    fun findByCommune(commune: Commune): List<Quartier>

    @Modifying
    @Transactional
    @Query(value = "UPDATE Quartier q SET q.isDelete = :isDelete WHERE q.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)

}