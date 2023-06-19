package com.mady.backend.repository

import com.mady.backend.entities.Produit
import com.mady.backend.utils.Delete
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface ProduitRepository : JpaRepository<Produit, Long>{


    fun findByNom(nom: String): Optional<Produit>
    fun findByNomAndIsDelete(nom: String,isDelete: Delete, pageable: Pageable): Page<Produit>
    fun findByGroupementNomAndIsDelete(nom: String,isDelete: Delete, pageable: Pageable): Page<Produit>
    fun findAllByIsDeleteOrderByNomAsc(isDelete: Delete, pageable: Pageable): Page<Produit>



    @Modifying
    @Transactional
    @Query(value = "UPDATE Produit P SET P.isDelete = :isDelete WHERE P.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)

}