package com.mady.backend.repository

import com.mady.backend.entities.Contenir
import com.mady.backend.utils.Delete
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional

interface ContenirRepository: JpaRepository<Contenir, Long>{

    @Modifying
    @Transactional
    @Query(value = "UPDATE Contenir C SET C.isDelete = :isDelete WHERE C.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)
}