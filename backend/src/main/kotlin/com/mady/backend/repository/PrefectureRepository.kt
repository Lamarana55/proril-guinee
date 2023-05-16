package com.mady.backend.repository

import com.mady.backend.entities.Prefecture
import com.mady.backend.entities.Region
import com.mady.backend.utils.Delete
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*


interface PrefectureRepository : JpaRepository<Prefecture, Long>{
    fun findByNom(nom: String): Optional<Prefecture>
    fun findByCode(code: String): Prefecture
    fun findByRegion(region: Region): List<Prefecture>


    @Modifying
    @Transactional
    @Query(value = "UPDATE Prefecture P SET P.isDelete = :isDelete WHERE P.id= :id")
    fun updateDelete(@Param("isDelete") isDelete: Delete, @Param("id") id: Long)


}