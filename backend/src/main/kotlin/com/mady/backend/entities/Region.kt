package com.mady.backend.entities


import com.mady.backend.utils.Delete
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import javax.persistence.*

@Entity
data class Region(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long,
        @Column(unique = true, nullable = false)
        val nom: String,
        @Column(unique = true, nullable = false)
        val code: String,
        val longitude: Double? = null,
        val latitude: Double? = null,
        val description: String? = null,
        val isView: Boolean = true,
        val isDelete: Delete = Delete.No,

        @CreatedDate
        @Column(name = "created_at", updatable = false)
        val createdAt: Instant = Instant.now(),
        @LastModifiedDate
        @Column(name = "updated_at", updatable = true)
        val updatedAt: Instant = Instant.now()
)