package com.mady.backend.repository

import com.mady.backend.entities.ValidationCode
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface ValidationCodeRepository : JpaRepository<ValidationCode, Long> {
    fun findByCode(code: Long): Optional<ValidationCode>
    fun findByPhone(phone: String): Optional<ValidationCode>
    fun findByPhoneAndCode(phone: String, code: Long): Optional<ValidationCode>
}