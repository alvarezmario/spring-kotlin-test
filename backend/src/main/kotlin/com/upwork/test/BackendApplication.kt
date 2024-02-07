package com.upwork.test

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.io.IOException


@SpringBootApplication
class BackendApplication {
	@Bean
	fun init(
		buildRepository: BuildRepository,
		lotRepository: LotRepository,
	) = CommandLineRunner {
		val mapper = ObjectMapper()
		val typeReference: TypeReference<List<Build>> = object : TypeReference<List<Build>>() {}
		val inputStream = TypeReference::class.java.getResourceAsStream("/json/data.json")

		try {
			val builds: List<Build> = mapper.readValue(inputStream, typeReference)

			for (build in builds) {
				for (lot in build.lots) {
					lot.build = build

					for (lotType in lot.lotTypes) {
						lotType.lot = lot

						for (result in lotType.results) {
							result.lotType = lotType
						}
					}
				}

				buildRepository.save(build)
			}
		} catch (e: IOException) {
			println("Unable to save users: " + e.message)
		}
	}
}

fun main(args: Array<String>) {
	runApplication<BackendApplication>(*args)
}

@Configuration
class WebServerConfiguration {
	@Bean
	fun addCorsConfig(): WebMvcConfigurer {
		return object : WebMvcConfigurer {
			override fun addCorsMappings(registry: CorsRegistry) {
				registry.addMapping("/**")
					.allowedMethods("*")
					.allowedOriginPatterns("*")
					.allowCredentials(true)
			}
		}
	}
}