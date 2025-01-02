plugins {
    kotlin("jvm") version "2.1.20-Beta1"
    application
}

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

    implementation(files("libs/core.jar"))

    testImplementation(kotlin("test"))
}


kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
    // Or shorter:
   // jvmToolchain(21)
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

application {
    mainClass.set("shortx.tool.gen.MainKt")
}