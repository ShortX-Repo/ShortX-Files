import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.8.21"
    application
}

group = "shortx"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
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

    implementation(files("libs/shortx-core.jar"))

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