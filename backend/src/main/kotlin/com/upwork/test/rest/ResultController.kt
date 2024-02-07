package com.upwork.test.rest

import com.upwork.test.*
import org.springframework.web.bind.annotation.*

@RestController
class ResultController(
    private val lotTypeRepository: LotTypeRepository,
    private val resultRepository: ResultRepository,
) {
    @GetMapping("/results")
    fun findAll(@RequestParam lotType: Long): List<Result> {
        val lotType = lotTypeRepository.findById(lotType).orElse(null)

        return lotType.results
    }

    @GetMapping("/results/{id}")
    fun findOne(@PathVariable id: Long) = resultRepository.findById(id)

    @PostMapping("/results")
    fun store(@RequestBody result: Result, @RequestParam lotType: Long) : Result {
        result.lotType = lotTypeRepository.findById(lotType).orElse(null)

        return resultRepository.save(result)
    }

    @PutMapping("/results/{id}")
    fun update(@PathVariable id: Long, @RequestBody body: Result) : Result {
        val result = resultRepository.findById(id).orElse(null)
        result.testId = body.testId
        result.value = body.value
        result.lowRange = body.lowRange
        result.highRange = body.highRange

        return resultRepository.save(result)
    }

    @DeleteMapping("/results/{id}")
    fun destroy(@PathVariable id: Long) {
        resultRepository.deleteById(id)
    }
}