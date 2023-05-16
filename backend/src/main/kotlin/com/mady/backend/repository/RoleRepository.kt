package com.mady.backend.repository

import com.mady.backend.entities.Permission
import com.mady.backend.entities.Role
import com.mady.backend.utils.Delete
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface RoleRepository: JpaRepository<Role, Long>{
    fun findByNom(nom: String): Optional<Role>
    fun findByPermissions(permission: Permission): List<Role>
    fun findByNomAndPermissions(nom: String, permission: Permission): Optional<Role>

    @Modifying
    @Transactional
    @Query(value = "UPDATE Role r SET r.isDelete = :isDelete WHERE r.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)

}