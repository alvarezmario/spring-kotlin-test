package com.upwork.test.rest

import com.upwork.test.BuildRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class BuildController(
    private val repository: BuildRepository,
) {
    @GetMapping("/builds")
    fun findAll() = repository.findAll()
}