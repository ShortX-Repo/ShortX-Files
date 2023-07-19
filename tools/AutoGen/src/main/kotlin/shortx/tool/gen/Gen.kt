package shortx.tool.gen

import com.google.gson.GsonBuilder
import kotlinx.coroutines.runBlocking
import tornaco.apps.shortx.core.rule.parseShareContentDA
import tornaco.apps.shortx.core.rule.parseShareContentRule
import tornaco.apps.shortx.core.rule.repo.Index
import tornaco.apps.shortx.core.rule.repo.Item
import java.io.File

const val baseUrl = "https://raw.githubusercontent.com/ShortX-Repo/Files/main"
const val daDir = "da"
const val ruleDir = "rule"

object Gen {
    private val gson = GsonBuilder()
        .disableHtmlEscaping()
        .setPrettyPrinting().create()

    fun run(inputDir: String, outputDir: String) {
        runBlocking {
            runCatching {
                val allDAFiles = File(File(inputDir), daDir).walkTopDown().filter { it.isFile }
                Logger.debug(allDAFiles)

                val das = allDAFiles.toList().map {
                    val fileContent = it.readText()
                    val directAction = requireNotNull(parseShareContentDA(fileContent)) {
                        "Unable to parse Direct action: $fileContent"
                    }
                    Item(
                        fileUrl = "${baseUrl}/$daDir/${it.name}",
                        title = directAction.title,
                        description = directAction.description,
                        author = "Github",
                    )
                }
                Logger.info("Direct action count: ${das.size}")

                val allRuleFiles = File(File(inputDir), ruleDir).walkTopDown().filter { it.isFile }
                Logger.debug(allDAFiles)
                val rules = allRuleFiles.toList().map {
                    val fileContent = it.readText()
                    val rule = requireNotNull(parseShareContentRule(fileContent)) {
                        "Unable to parse Rule: $fileContent"
                    }
                    Item(
                        fileUrl = "${baseUrl}/$ruleDir/${it.name}",
                        title = rule.title,
                        description = rule.description,
                        author = "Github",
                    )
                }
                Logger.info("Rule count: ${rules.size}")

                // Write index
                val index = Index(directActions = das, rules = rules)
                val indexJson = gson.toJson(index)
                Logger.info(indexJson)
                File(File(outputDir), "index.json")
                    .apply {
                        parentFile.mkdirs()
                    }
                    .writeText(indexJson)

            }.onFailure {
                it.printStackTrace()
            }
        }
    }
}