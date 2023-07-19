package shortx.tool.gen

import java.io.File
import kotlin.system.exitProcess

fun main(args: Array<String>) {
    val dir = args[0]
    Logger.enableDebug()
    Logger.info("Dir: ${File(dir).canonicalFile.absolutePath}")
    Gen.run(dir)
    exitProcess(0)
}