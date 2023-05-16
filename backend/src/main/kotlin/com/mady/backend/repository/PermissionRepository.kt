package com.mady.backend.repository

import com.mady.backend.entities.Permission
import com.mady.backend.utils.Delete
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface PermissionRepository: JpaRepository<Permission, Long>{
    fun findByLibelle(libelle: String): Optional<Permission>

    @Modifying
    @Transactional
    @Query(value = "UPDATE Permission p SET p.isDelete = :isDelete WHERE p.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)


}