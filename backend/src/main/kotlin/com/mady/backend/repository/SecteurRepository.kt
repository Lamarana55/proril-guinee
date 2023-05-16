package com.mady.backend.repository

import com.mady.backend.entities.Quartier
import com.mady.backend.entities.Secteur
import org.springframework.data.jpa.repository.JpaRepository

interface SecteurRepository : JpaRepository<Secteur, Long>{
    fun findByNom(nom: String): List<Secteur>
    fun findByCode(code: String): Secteur
    fun findByQuartier(quartier: Quartier): List<Secteur>
}