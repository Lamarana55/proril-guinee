package com.mady.backend.repository

import com.mady.backend.entities.Produit
import com.mady.backend.entities.Vente
import com.mady.backend.utils.Delete
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional

interface VenteRepository : JpaRepository<Vente, Long>{


    fun findByProduitNomAndIsDelete(nom: String,isDelete: Delete, pageable: Pageable): Page<Produit>
    fun findAllByIsDeleteOrderByCreatedAtAsc(isDelete: Delete, pageable: Pageable): Page<Produit>

    @Modifying
    @Transactional
    @Query(value = "UPDATE Vente V SET V.isDelete = :isDelete WHERE V.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)
}