package shortx.tool.gen

import kotlin.system.exitProcess

fun main(args: Array<String>) {
    val dir = args[0]
    Logger.enableDebug()
    Logger.info("Dir: $dir")
    Gen.run(dir)
    exitProcess(0)
}