package com.upwork.test

import org.springframework.data.repository.CrudRepository

interface BuildRepository : CrudRepository<Build, Long> {}
interface LotRepository : CrudRepository<Lot, Long> {}
interface LotTypeRepository : CrudRepository<LotType, Long> {}
interface ResultRepository : CrudRepository<Result, Long> {}