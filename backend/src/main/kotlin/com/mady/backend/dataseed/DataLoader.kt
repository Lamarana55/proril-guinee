package com.mady.backend.dataseed

import com.mady.backend.services.LoadDataService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class DataLoader : CommandLineRunner {
    private val logger = LoggerFactory.getLogger(DataLoader::class.java)

    @Autowired
    private lateinit var loadDataddService: LoadDataService

    override fun run(vararg args: String?) {
//       loadDataddService.init()
    }


}
