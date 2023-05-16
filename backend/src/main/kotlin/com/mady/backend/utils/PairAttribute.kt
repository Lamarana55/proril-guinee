package com.mady.backend.utils
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper

import java.io.IOException
import javax.persistence.AttributeConverter
import javax.persistence.Converter

data class PairAttribute(val value: String? = null, val status: String? = null)

@Converter
class PairToStringConverter : AttributeConverter<PairAttribute?, String?> {

    private val objectMapper = ObjectMapper()

    override fun convertToDatabaseColumn(attribute: PairAttribute?): String? {
        try {
            return objectMapper.writeValueAsString(attribute)
        } catch (e: JsonProcessingException) {
            e.printStackTrace()
        }

        return null
    }

    override fun convertToEntityAttribute(dbData: String?): PairAttribute? {
        try {
            return objectMapper.readValue(dbData, PairAttribute::class.java)
        } catch (e: IOException) {
            e.printStackTrace()
        }

        return null
    }
}

@Converter
class ListStringToStringConverter : AttributeConverter<List<String>?, String?> {

    override fun convertToDatabaseColumn(attribute: List<String>?): String? = attribute?.joinToString(",")

    override fun convertToEntityAttribute(dbData: String?): List<String>? = dbData?.split(",")
}
