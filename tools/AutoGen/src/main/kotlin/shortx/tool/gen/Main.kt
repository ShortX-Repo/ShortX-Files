package shortx.tool.gen

import kotlin.system.exitProcess

fun main(args: Array<String>) {
    val auth = args[0]
    val enableDebug = args.size > 1 && args[1] == "debug"
    if (enableDebug) {
        Logger.enableDebug()
    }
    Gen.run(auth)
    exitProcess(0)
}