package com.mady.backend.repository

import com.mady.backend.entities.Facture
import com.mady.backend.utils.Delete
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional

interface FactureRepository : JpaRepository<Facture, Long>{


    @Modifying
    @Transactional
    @Query(value = "UPDATE Facture F SET F.isDelete = :isDelete WHERE F.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)

}