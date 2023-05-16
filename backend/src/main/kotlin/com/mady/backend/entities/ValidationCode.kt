package com.mady.backend.entities

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import java.time.temporal.ChronoUnit
import javax.persistence.*

@Entity
data class ValidationCode(
        @Id @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long? = null,
        @Column(nullable = false)
        val code: Long,
        val phone: String,
        val signature: String? = null,

        @CreatedDate
        @Column(name = "created_at", nullable = false, updatable = true)
        val createdAt: Instant = Instant.now(),

        val validateCode: Instant = createdAt.plus(15, ChronoUnit.MINUTES),

        @LastModifiedDate
        @Column(name = "updated_at", nullable = false, updatable = true)
        val updatedAt: Instant = Instant.now()


)