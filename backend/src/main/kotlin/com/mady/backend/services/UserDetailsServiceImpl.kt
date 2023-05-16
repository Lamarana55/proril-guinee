package com.mady.backend.services

import com.mady.backend.repository.UserRepository
import com.mady.backend.utils.UserPrinciple
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService

import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.jvm.Throws

@Service
class UserDetailsServiceImpl : UserDetailsService {

    @Autowired
    internal var userRepository: UserRepository? = null

    @Transactional
    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(usernameOrEmail: String): UserDetails {

        val user = userRepository!!.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail).orElseThrow { UsernameNotFoundException("User Not Found with -> username or email : $usernameOrEmail") }

        return UserPrinciple.build(user)
    }

    /*@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return null;
	}*/
}


