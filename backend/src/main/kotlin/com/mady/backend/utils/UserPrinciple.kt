package com.mady.backend.utils


import com.mady.backend.entities.User
import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.stream.Collectors

class UserPrinciple(val id: Long?, private val nom: String , private val prenom: String, private val telephone: String, private val username: String, val email: String, @field:JsonIgnore
private val password: String, private val authorities: Collection<GrantedAuthority>) : UserDetails {

    override fun getUsername(): String {
        return username
    }

    override fun getPassword(): String {
        return password
    }

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return authorities
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }

    override fun equals(o: Any?): Boolean {
        if (this === o) return true
        if (o == null || javaClass != o.javaClass) return false

        val user = o as UserPrinciple?
        return id == user!!.id
    }

    companion object {
        private val serialVersionUID = 1L

        fun build(user: User): UserPrinciple {
            val roles = user.role.permissions
            val authorities = roles.stream().map { SimpleGrantedAuthority(it.libelle) }.collect(Collectors.toList())

            return UserPrinciple(
                    user.id,
                    user.nom!!,
                    user.prenom!!,
                    user.telephone!!,
                    user.username,
                    user.email,
                    user.password!!,
                    authorities
            )
        }
    }
}
