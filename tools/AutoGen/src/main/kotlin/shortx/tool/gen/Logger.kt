package shortx.tool.gen

object Logger {
    private var _isDebug: Boolean = false

    fun enableDebug() {
        _isDebug = true
    }

    fun debug(any: Any) {
        if (_isDebug) println(any.toString())
    }

    fun info(any: Any) {
        println(any.toString())
    }
}