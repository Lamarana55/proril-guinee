package com.mady.backend.entities

import com.mady.backend.utils.Delete
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import javax.persistence.*

@Entity
data class Permission(
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long,
        @Column(unique = true, nullable = false)
        val libelle: String,
        val description: String? = null,
        val isDelete: Delete = Delete.No,

        @CreatedDate
        @Column(updatable = false)
        val createdAt: Instant = Instant.now(),
        @LastModifiedDate
        @Column(updatable = true)
        val updatedAt: Instant = Instant.now()
)