package com.mady.backend.entities

import com.mady.backend.utils.Delete
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import javax.persistence.*

@Entity
data class Contenir(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long,
        @Column(nullable = false)
        val quantite: Int,
        val prixAchat: Double,
        val produitAt: String? = null,
        val livraisonAt: String? = null,

        @Column(columnDefinition = "text")
        val description: String? = null,
        val isDelete: Delete = Delete.No,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = false)
        val produit: Produit,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = false)
        val livraison: Livraison,


        @CreatedDate
        @Column(name = "created_at", updatable = false)
        val createdAt: Instant? = Instant.now(),
        @LastModifiedDate
        @Column(name = "updated_at", updatable = true)
        val updatedAt: Instant? = Instant.now()
)