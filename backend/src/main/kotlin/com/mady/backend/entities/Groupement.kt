package com.mady.backend.entities

import com.mady.backend.utils.Delete
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import javax.persistence.*

@Entity
data class Groupement(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long,
        @Column(nullable = false)
        val nom: String,
        val telephone: String? = null,
        val email: String? = null,
        val marqueGroupement: String? = null,

        @Column(columnDefinition = "text")
        val description: String? = null,
        val isDelete: Delete = Delete.No,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        val region: Region? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        val prefecture: Prefecture? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        val commune: Commune? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        val quartier: Quartier? = null,

        @CreatedDate
        @Column(name = "created_at", updatable = false)
        val createdAt: Instant? = Instant.now(),
        @LastModifiedDate
        @Column(name = "updated_at", updatable = true)
        val updatedAt: Instant? = Instant.now()

)