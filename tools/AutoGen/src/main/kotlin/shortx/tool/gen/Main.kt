package shortx.tool.gen

import java.io.File

fun main(args: Array<String>) {
    val inputDir = args[0]
    Logger.enableDebug()
    Logger.info("inputDir: ${File(inputDir).canonicalFile.absolutePath}")
    Gen.run(inputDir, inputDir)
}