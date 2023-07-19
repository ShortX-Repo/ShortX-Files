package shortx.tool.gen

import java.io.File
import kotlin.system.exitProcess

fun main(args: Array<String>) {
    val inputDir = args[0]
    val outputDir = args[1]
    Logger.enableDebug()
    Logger.info("inputDir: ${File(inputDir).canonicalFile.absolutePath}")
    Logger.info("outputDir: ${File(outputDir).canonicalFile.absolutePath}")
    Gen.run(inputDir, outputDir)
    exitProcess(0)
}