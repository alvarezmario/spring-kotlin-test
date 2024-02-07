package com.upwork.test;

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
class Build (
        val type: String,
        val buildInfoVersion: String,
        @OneToMany(mappedBy = "build", cascade = [CascadeType.ALL], orphanRemoval = true) val lots: List<Lot>,
        @Embedded val otherBuildInfo: BuildInfo,
        @Id @GeneratedValue var id: Long? = null
)

@Embeddable
class BuildInfo (
        val manufacturer: String,
        val releaseDate: String,
)

@Entity
class Lot (
        val lotId: String,
        @ManyToOne
        @JoinColumn(name = "build_id")
        @JsonIgnore
        var build : Build,
        @OneToMany(mappedBy = "lot", cascade = [CascadeType.ALL], orphanRemoval = true) val lotTypes: List<LotType>,
        @Id @GeneratedValue var id: Long? = null
)

@Entity
class LotType (
        var type: String,
        @ManyToOne
        @JoinColumn(name = "lot_id")
        @JsonIgnore
        var lot : Lot?,
        @OneToMany(mappedBy = "lotType", cascade = [CascadeType.ALL], orphanRemoval = true) var results : MutableList<Result>,
        @Id @GeneratedValue var id: Long? = null,
)

@Entity
class Result (
        var testId: String,
        @Column(name = "result")
        var value: Int,
        var lowRange: Int,
        var highRange: Int,
        @ManyToOne
        @JoinColumn(name = "lot_type_id")
        @JsonIgnore
        var lotType: LotType?,
        @Id @GeneratedValue var id: Long? = null,
)

