import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import java.io.FileInputStream
import java.util.*

plugins {
    kotlin("jvm") version "1.8.21"
    application
}

group = "shortx"
version = "1.0-SNAPSHOT"

val githubProperties = Properties()
val githubPropFile = File(rootProject.projectDir, "github.properties")
println("githubPropFile: $githubPropFile")
if (githubPropFile.exists()) {
    githubProperties.load(FileInputStream(githubPropFile))
}

repositories {
    mavenCentral()
    maven {
        name = "GitHubPackages"
        url = uri("https://maven.pkg.github.com/ShortX-Repo/ShortX-Core")
        credentials {
            username = (githubProperties["gpr.usr"] ?: project.findProperty("GPR_USER")).toString()
            password = (githubProperties["gpr.key"] ?: project.findProperty("GPR_API_KEY")).toString()
        }
    }
}

dependencies {
    val retrofit = "com.squareup.retrofit2:retrofit:2.7.1"
    val retrofitConverterGson = "com.squareup.retrofit2:converter-gson:2.7.1"
    val retrofitAdapterRxJava2 = "com.squareup.retrofit2:adapter-rxjava2:2.7.1"
    val okHttpLoggingInterceptor = "com.squareup.okhttp3:logging-interceptor:4.9.1"
    val coroutineCore = "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.2"
    val protoBufUtil = "com.google.protobuf:protobuf-java-util:3.23.2"
    val protoBuf = "com.google.protobuf:protobuf-java:3.23.2"

    implementation(retrofit)
    implementation(retrofitConverterGson)
    implementation(retrofitAdapterRxJava2)
    implementation(okHttpLoggingInterceptor)
    implementation(coroutineCore)
    implementation(protoBufUtil)
    implementation(protoBuf)

    implementation("shortx:core:1.1.2-SNAPSHOT")

    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
}

application {
    mainClass.set("shortx.tool.gen.MainKt")
}

subprojects {
    configurations.all {
        resolutionStrategy.cacheChangingModulesFor(0, TimeUnit.SECONDS)
    }
}