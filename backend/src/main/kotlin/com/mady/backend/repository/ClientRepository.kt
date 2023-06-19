package com.mady.backend.repository

import com.mady.backend.entities.Client
import com.mady.backend.utils.Delete
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface ClientRepository : JpaRepository<Client, Long>{
    fun findByNom(nom: String): Optional<Client>
    fun findByTelephoneAndIsDelete(telephone: String, isDelete: Delete, pageable: Pageable): Page<Client>
    fun findAllByIsDeleteOrderByNomAsc(isDelete: Delete, pageable: Pageable): Page<Client>



    @Modifying
    @Transactional
    @Query(value = "UPDATE Client G SET G.isDelete = :isDelete WHERE G.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)
}