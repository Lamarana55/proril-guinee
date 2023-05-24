package com.mady.backend.repository

import com.mady.backend.entities.Commande
import com.mady.backend.utils.Delete
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional

interface CommandeRepository : JpaRepository<Commande, Long>{

    fun findByLibelle(libelle: String): List<Commande>

    @Modifying
    @Transactional
    @Query(value = "UPDATE Commande C SET C.isDelete = :isDelete WHERE C.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)

}