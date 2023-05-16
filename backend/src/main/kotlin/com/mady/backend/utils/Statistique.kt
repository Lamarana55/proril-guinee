package com.mady.backend.utils



interface StatistiqueAlerteStatut{
    fun getStatut(): String
    fun getNombre(): Long
}

interface StatistiqueCasStatut{
    fun getStatut(): String
    fun getNombre(): Long
}

interface StatistiqueAlerteByRegion{
    fun getNombre(): Long
    fun getRegion(): String
}

interface StatistiqueTop5AlerteByCommune{
    fun getNombre(): Long
    fun getCommune(): String
}

interface StatistiqueTop5CasByPrefecture{
    fun getNombre(): Long
    fun getPrefecture(): String
}

interface StatistiqueCasByRegion{
    fun getNombre(): Long
    fun getRegion(): String
}

interface StatistiqueCasByTypeCas{
    fun getNombre(): Long
    fun getTypeCas(): String
}

interface StatistiqueServiceByCas{
    fun getNombre(): Long
    fun getServices(): String
}