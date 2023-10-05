package shortx.tool.gen

import tornaco.apps.shortx.core.util.logAdapter
import java.io.File

fun main(args: Array<String>) {
    logAdapter = { _: Int, tag: String, msg: String ->
        println("[$tag] $msg")
    }
    val inputDir = args[0]
    Logger.enableDebug()
    Logger.info("inputDir: ${File(inputDir).canonicalFile.absolutePath}")
    Gen.run(inputDir, inputDir)
}