package com.mady.backend.controller

import com.mady.backend.repository.FactureRepository
import com.mady.backend.utils.CROSS_ORIGIN
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin(CROSS_ORIGIN)
@RequestMapping("/api/factures")
class FactureController {

    @Autowired
    private lateinit var factureRepository: FactureRepository
}