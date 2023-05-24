package com.mady.backend.entities

import com.mady.backend.utils.Delete
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import javax.persistence.*

@Entity
data class Vente(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long,
        @Column(nullable = false)
        val libelle: String,
        val prixVente: Double,
        val quantite: Int,
        val produitAt: String? = null,
        val commandeAt: String? = null,

        @Column(columnDefinition = "text")
        val description: String? = null,
        val isDelete: Delete = Delete.No,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = false)
        val produit: Produit,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = false)
        val commande: Commande,

        @CreatedDate
        @Column(name = "created_at", updatable = false)
        val createdAt: Instant? = Instant.now(),
        @LastModifiedDate
        @Column(name = "updated_at", updatable = true)
        val updatedAt: Instant? = Instant.now()
)