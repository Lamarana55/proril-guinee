package com.mady.backend.entities

import com.mady.backend.utils.Delete
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import javax.persistence.*

@Entity
data class Facture(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long,
        @Column(nullable = false)
        val montant: Double,
        @Column(columnDefinition = "text")
        val description: String? = null,
        val isDelete: Delete = Delete.No,


        @CreatedDate
        @Column(name = "created_at", updatable = false)
        val createdAt: Instant? = Instant.now(),
        @LastModifiedDate
        @Column(name = "updated_at", updatable = true)
        val updatedAt: Instant? = Instant.now()
)