package com.mady.backend.entities

import com.mady.backend.utils.Delete
import com.mady.backend.utils.Statut
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import javax.persistence.*
import javax.validation.constraints.Email

@Entity
@Table(name = "ws_users")
data class User(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long,
        @Column(unique = true, nullable = false)
        var code: String? = null,
        val nom: String? = null,
        val prenom: String? = null,
        val telephone: String? = null,
        @Email
        @Column(nullable = true)
        val email: String,
        @Column(unique = true, nullable = false)
        var username: String? = null,

        @Column(nullable = false)
        var password: String? = null,
        val statut: Statut = Statut.Activated,

        @Column(nullable = true)
        val resetPasswordToken: String? = null,
        val isDelete: Delete = Delete.No,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = false)
        val role: Role,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        var region: Region? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        var prefecture: Prefecture? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        var commune: Commune? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        var quartier: Quartier? = null,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(nullable = true)
        var secteur: Secteur? = null,

        @CreatedDate
        @Column(name = "created_at", updatable = false)
        val createdAt: Instant = Instant.now(),
        @LastModifiedDate
        @Column(name = "updated_at", updatable = true)
        val updatedAt: Instant = Instant.now()
)