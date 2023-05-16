package com.mady.backend.repository

import com.mady.backend.entities.Region
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface RegionRepository: JpaRepository<Region, Long>{
    fun findByNom(nom: String): Optional<Region>
    fun findByCode(code: String): Region
}
