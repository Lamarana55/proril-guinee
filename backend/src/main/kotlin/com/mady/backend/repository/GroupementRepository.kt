package com.mady.backend.repository

import com.mady.backend.entities.Groupement
import com.mady.backend.utils.Delete
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional

interface GroupementRepository : JpaRepository<Groupement, Long> {

    @Modifying
    @Transactional
    @Query(value = "UPDATE Groupement G SET G.isDelete = :isDelete WHERE G.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)
}