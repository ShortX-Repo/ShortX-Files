package shortx.tool.gen

import com.google.gson.GsonBuilder
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.runBlocking
import tornaco.apps.shortx.core.proto.common.CodeType
import tornaco.apps.shortx.core.res.Remix
import tornaco.apps.shortx.core.rule.parseShareContentCodeLibraryItemOrThrow
import tornaco.apps.shortx.core.rule.parseShareContentDAOrThrow
import tornaco.apps.shortx.core.rule.parseShareContentRuleOrThrow
import tornaco.apps.shortx.core.rule.repo.Index
import tornaco.apps.shortx.core.rule.repo.Item
import java.io.File

const val daDir = "da"
const val ruleDir = "rule"
const val codeDir = "code"

private const val defaultAuthor = "ShortX"
private val shareHeaderRegex = Regex("\\R###------###\\R")

object Gen {
    private val gson = GsonBuilder()
        .disableHtmlEscaping()
        .setPrettyPrinting().create()

    fun run(inputDir: String, outputDir: String) {
        runBlocking {
            runCatching {
                val allDAFiles = scanFiles(inputDir, daDir)
                Logger.debug(allDAFiles)

                val das = allDAFiles.toList().map(::parseDAItem)
                Logger.info("Direct action count: ${das.size}")

                val allRuleFiles = scanFiles(inputDir, ruleDir)
                Logger.debug(allRuleFiles)
                val rules = allRuleFiles.toList().map(::parseRuleItem)
                Logger.info("Rule count: ${rules.size}")

                val allCodeFiles = scanFiles(inputDir, codeDir)
                Logger.debug(allCodeFiles)
                val codeLibraries = allCodeFiles.toList().map(::parseCodeLibraryItem)
                Logger.info("Code library count: ${codeLibraries.size}")

                // Write index
                val index = Index(
                    directActions = das,
                    rules = rules,
                    codeLibraries = codeLibraries,
                    updateTimeMillis = (das + rules + codeLibraries).maxOfOrNull {
                        it.updateTimeMillis
                    } ?: 0,
                )
                val indexJson = gson.toJson(index)
                Logger.info(indexJson)
                File(File(outputDir), "index.json")
                    .apply {
                        parentFile.mkdirs()
                    }
                    .writeText(indexJson)

            }.onFailure {
                it.printStackTrace()
                throw IllegalStateException(it)
            }
        }
    }

    private fun parseDAItem(file: File): Item {
        val fileContent = file.readText()
        val directAction = runCatching {
            parseShareContentDAOrThrow(fileContent)
        }.onFailure { err ->
            Logger.info("Unable to parse Direct action: ${file.nameWithoutExtension} ${err.stackTraceToString()}")
        }.getOrThrow()
        return Item(
            fileUrl = file.name,
            title = directAction.title,
            description = directAction.description,
            author = directAction.author.name,
            id = directAction.id,
            versionCode = directAction.versionCode,
            updateTimeMillis = directAction.lastUpdateTime,
            requireMinShortXProtoVersion = directAction.requireMinShortXProtoVersion,
            tags = emptyList(),
            icon = null,
            iconColor = null,
        )
    }

    private fun parseRuleItem(file: File): Item {
        val fileContent = file.readText()
        val rule = runCatching {
            parseShareContentRuleOrThrow(fileContent)
        }.onFailure { err ->
            Logger.info("Unable to parse Rule: ${file.nameWithoutExtension} ${err.stackTraceToString()}")
        }.getOrThrow()
        return Item(
            fileUrl = file.name,
            title = rule.title,
            description = rule.description,
            author = rule.author.name,
            id = rule.id,
            versionCode = rule.versionCode,
            updateTimeMillis = rule.lastUpdateTime,
            requireMinShortXProtoVersion = rule.requireMinShortXProtoVersion,
            tags = emptyList(),
            icon = null,
            iconColor = null,
        )
    }

    private fun parseCodeLibraryItem(file: File): Item {
        val (contentJson, header) = splitShareContent(file.readText())
        val codeLibrary = runCatching {
            parseShareContentCodeLibraryItemOrThrow(contentJson)
        }.onFailure { err ->
            Logger.info("Unable to parse Code library: ${file.nameWithoutExtension} ${err.stackTraceToString()}")
        }.getOrThrow()
        return Item(
            fileUrl = file.name,
            title = codeLibrary.name,
            description = codeLibrary.description,
            author = header["author"].orEmpty().ifBlank { defaultAuthor },
            id = codeLibrary.id,
            versionCode = 1,
            updateTimeMillis = codeLibrary.updatedAt,
            requireMinShortXProtoVersion = 0,
            tags = codeLibrary.tagsList,
            icon = codeLibrary.type.iconName(),
            iconColor = codeLibrary.type.iconColor(),
        )
    }

    private fun scanFiles(rootDir: String, childDir: String): Sequence<File> {
        return File(rootDir, childDir)
            .takeIf { it.exists() }
            ?.walkTopDown()
            ?.filter { it.isFile }
            ?: emptySequence()
    }

    private fun splitShareContent(text: String): Pair<String, Map<String, String>> {
        val parts = shareHeaderRegex.split(text.trim(), limit = 2)
        if (parts.size < 2) {
            return text.trim() to emptyMap()
        }
        val type = object : TypeToken<Map<String, String>>() {}.type
        val header = kotlin.runCatching {
            gson.fromJson<Map<String, String>>(parts[1].trim(), type)
        }.getOrDefault(emptyMap())
        return parts[0].trim() to header
    }
}

private fun CodeType.iconName(): String {
    return when (this) {
        CodeType.CodeType_MVEL -> Remix.Development.code_line
        CodeType.CodeType_JAVASCRIPT -> Remix.Logos.vuejs_line
        CodeType.UNRECOGNIZED -> Remix.Development.code_line
    }
}

private fun CodeType.iconColor(): String {
    return when (this) {
        CodeType.CodeType_MVEL -> "#6750A4"
        CodeType.CodeType_JAVASCRIPT -> "#FF9800"
        CodeType.UNRECOGNIZED -> "#607D8B"
    }
}