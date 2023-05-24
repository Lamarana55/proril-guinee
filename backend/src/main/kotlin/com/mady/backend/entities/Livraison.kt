package com.mady.backend.entities

import com.mady.backend.utils.Delete
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import javax.persistence.*

@Entity
data class Livraison(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long,
        val libelle: String? = null,
        val nomFournisseur: String? = null,
        val prenomFournisseur: String? = null,
        val telephoneFournisseur: String? = null,
        val emailFournisseur: String? = null,
        val groupementAt: String? = null,

        @Column(columnDefinition = "text")
        val description: String? = null,
        val isDelete: Delete = Delete.No,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        val groupement: Groupement? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = false)
        val user: User,


        @CreatedDate
        @Column(name = "created_at", updatable = false)
        val createdAt: Instant? = Instant.now(),
        @LastModifiedDate
        @Column(name = "updated_at", updatable = true)
        val updatedAt: Instant? = Instant.now()
)