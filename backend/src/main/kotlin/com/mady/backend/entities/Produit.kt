package com.mady.backend.entities

import com.mady.backend.utils.Delete
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import javax.persistence.*

@Entity
data class Produit(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long,
        @Column(nullable = false)
        val nom: String,
        val poids: Float? = null,
        val prixUnit: Double,
        val quantite: Int,

        @Column(columnDefinition = "text")
        val description: String? = null,
        val isDelete: Delete = Delete.No,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        val groupement: Groupement? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        val user: User? = null,


        val groupementAt: String? = groupement?.nom,
        val marqueAt: String? = groupement?.marque,

        @CreatedDate
        @Column(name = "created_at", updatable = false)
        val createdAt: Instant? = Instant.now(),
        @LastModifiedDate
        @Column(name = "updated_at", updatable = true)
        val updatedAt: Instant? = Instant.now()
)