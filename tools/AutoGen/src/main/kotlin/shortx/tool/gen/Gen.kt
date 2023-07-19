package shortx.tool.gen

import com.google.gson.GsonBuilder
import kotlinx.coroutines.runBlocking
import tornaco.apps.shortx.core.rule.parseShareContentDA
import tornaco.apps.shortx.core.rule.parseShareContentRule
import tornaco.apps.shortx.core.rule.repo.Index
import tornaco.apps.shortx.core.rule.repo.Item
import java.io.File
import java.util.*


object Gen {
    private val gson = GsonBuilder()
        .disableHtmlEscaping()
        .setPrettyPrinting().create()

    fun run(authToken: String) {
        runBlocking {
            runCatching {
                val service = ApiService.Factory.create(authToken)
                val allDAFiles = service.getDAFiles()
                Logger.debug(allDAFiles)

                val das = allDAFiles.map {
                    val fileContent = service.getDAFileContent(it.name)
                    val decodedWithMime = Base64.getMimeDecoder().decode(fileContent.content)
                    val decodedContent = String(decodedWithMime)
                    val directAction = requireNotNull(parseShareContentDA(decodedContent)) {
                        "Unable to parse Direct action: $decodedContent"
                    }
                    Item(
                        fileUrl = it.downloadUrl,
                        title = directAction.title,
                        description = directAction.description,
                        author = "Github",
                    )
                }
                Logger.info("Direct action count: ${das.size}")

                val allRuleFiles = service.getRuleFiles()
                Logger.debug(allDAFiles)
                val rules = allRuleFiles.map {
                    val fileContent = service.getRuleFileContent(it.name)
                    val decodedWithMime = Base64.getMimeDecoder().decode(fileContent.content)
                    val decodedContent = String(decodedWithMime)
                    val rule = requireNotNull(parseShareContentRule(decodedContent)) {
                        "Unable to parse Rule: $decodedContent"
                    }
                    Item(
                        fileUrl = it.downloadUrl,
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
                File(File("out"),"index.json")
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