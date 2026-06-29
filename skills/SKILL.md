---
name: shortx-rule-creator
description: >
  ShortX 指令文件生成器。根据用户需求自动生成 ShortX 自动指令(Rule)或一键指令(DirectAction)的 .txt 文件。
  使用场景：用户描述一个自动化需求（如'摇晃手机切换WiFi'、'收到通知时转发到企业微信'、'充电时自动省电'、'边缘手势打开应用'），
  需要生成可导入 ShortX 的指令文件。支持生成自动指令(Rule)和一键指令(DirectAction)，包含触发器、条件、动作、退出机制、
  钩子、参数、变量系统、脚本引擎等完整功能。当用户提到 ShortX、自动指令、一键指令、Rule、DirectAction、触发器、条件、
  动作、退出、钩子、参数、全局变量、局部变量、上下文变量、ShellCommand、ExecuteJS、ExecuteMVEL、HttpRequest、
  IfThenElse、ForEach、WhileLoop 等关键词时使用此 skill。即使用户只是描述一个手机自动化场景而没有明确提到 ShortX，
  也应该使用此 skill 来生成指令文件。
---

# ShortX 指令文件生成器

根据用户的自动化需求，生成可直接导入 ShortX 的 `.txt` 指令文件。

## 生成工作流

### 1. 理解需求

分析用户描述，确定：
- **指令类型**：自动指令(Rule) 还是 一键指令(DirectAction)
  - Rule：有触发条件，事件驱动自动执行
  - DirectAction：无触发条件，用户手动点击执行
- **触发器**：什么事件触发（仅 Rule 需要）
- **条件**：什么前提下才执行
- **动作**：执行什么操作
- **退出机制**：什么时候停止（可选）
- **钩子**：启用/禁用/删除时做什么（可选）
- **参数**：用户导入时可自定义的值（可选）

### 2. 查阅参考文档

根据需求类型，读取对应的参考文档获取准确的 Proto 定义：

| 需要什么 | 读取哪个文件 |
|---------|------------|
| 触发器（什么时候触发） | `references/triggers.md` |
| 条件（什么情况下执行） | `references/conditions.md` |
| 动作（执行什么操作） | `references/actions.md` |
| 变量系统（数据传递） | `references/variables.md` |
| 高级功能（退出/钩子/函数/脚本） | `references/advanced.md` |
| 完整示例参考 | `references/examples.md` |

每个参考文档包含该类别下所有可用组件的完整 Proto 定义、参数说明和使用场景。生成指令前务必查阅相关文档以确保 Proto 字段准确无误。

### 3. 构建 JSON

#### 文件格式

ShortX 指令文件是 `.txt` 格式，由三部分组成：

```
{JSON 内容}
###------###
{"type":"rule"} 或 {"type":"da"}
```

- 第一部分：指令的完整 JSON
- 第二部分：固定分隔符 `###------###`
- 第三部分：类型标记 — `{"type":"rule"}` 表示自动指令，`{"type":"da"}` 表示一键指令

#### 自动指令 (Rule) 顶层结构

```json
{
  "facts": [],
  "conditions": [],
  "actions": [],
  "id": "RULE-unique-id",
  "title": "指令标题",
  "description": "指令描述",
  "isEnabled": true,
  "condOp": "ALL",
  "hook": {},
  "quit": {},
  "parameters": [],
  "versionCode": "1"
}
```

#### 一键指令 (DirectAction) 顶层结构

```json
{
  "actions": [],
  "id": "DA-unique-id",
  "title": "指令标题",
  "description": "指令描述",
  "versionCode": "1",
  "hook": {},
  "quit": {},
  "parameters": []
}
```

#### 公共字段

每个触发器/条件/动作都有以下公共字段：

| 字段 | 说明 |
|-----|------|
| `@type` | protobuf 类型 URL，如 `type.googleapis.com/ShellCommand` |
| `id` | 唯一标识符，触发器用 `F-xxx`，条件用 `C-xxx`，动作用 `A-xxx` |
| `customContextDataKey` | 自定义上下文变量名映射（可选，默认 `{}`） |
| `isDisabled` | 是否禁用（可选） |
| `note` | 备注（可选） |

条件还有 `isInvert`（取反）字段。动作还有 `actionOnError`（Continue/Break）字段。

#### condOp 条件组合方式

| 值 | 逻辑 | 说明 |
|----|------|------|
| `ALL` | AND | 所有条件都满足时才执行（默认） |
| `ANY` | OR | 任一条件满足即执行 |
| `NONE` | NOR | 所有条件都不满足时才执行 |
| `MVEL` | 自定义 | 用 MVEL 表达式自定义组合逻辑 |

### 4. 变量系统速查

ShortX 有四类变量，引用语法不同：

| 变量类型 | 引用语法 | 生命周期 | 说明 |
|---------|---------|---------|------|
| 上下文变量 | `{变量名}` | 当前动作执行期间 | 系统自动填充，如 `{pkgName}`、`{shellOut}`、`{jsRet}` |
| 全局变量 | `globalVarOf$变量名` | 永久（直到手动删除） | 跨指令共享，需手动创建 |
| 局部变量 | `localVarOf$变量名` | 当前指令执行期间 | 仅当前指令可见，需手动创建 |
| 系统环境变量 | `%变量名%` | 实时 | 只读，如 `%BatteryLevel%`、`%WifiSSID%` |

常用上下文变量来源（详见 `references/variables.md`）：
- 通知事件 → `{title}`, `{contentText}`, `{pkgName}`
- 应用事件 → `{pkgName}`, `{appLabel}`, `{activityName}`
- Shell命令 → `{shellOut}`, `{shellErr}`, `{shellCode}`
- JS脚本 → `{jsRet}`
- MVEL表达式 → `{mvelRet}`
- HTTP请求 → `{httpRequestRet}`, `{httpRequestRet1}`...
- 用户输入 → `{textFieldInput1}`, `{textFieldInput2}`...
- ForEach循环 → `{foreachData}`, `{foreachIndex}`

### 5. 生成文件

将完整 JSON 写入 `.txt` 文件，保存到用户指定路径或当前工作目录。文件名建议用指令功能的简短描述，如 `摇晃切换WiFi.txt`、`通知转发企业微信.txt`。

### 6. 输出说明

生成文件后，向用户说明：
- 指令的功能概述
- 触发条件和执行逻辑
- 如何导入：在 ShortX 中选择"导入指令"，选择生成的 `.txt` 文件
- 如果有参数：说明哪些参数可以在导入时自定义
- 注意事项（如需要 Root 权限、需要无障碍服务等）

## 常用触发器速查

| 触发器 | @type | 用途 |
|-------|-------|------|
| 应用前台 | `AppBecomeFg` | 应用切到前台 |
| 应用后台 | `AppBecomeBg` | 应用切到后台 |
| 通知发布 | `NotificationPosted` | 收到新通知 |
| 定时触发 | `Alarm` | 定时执行 |
| 屏幕亮/灭 | `ScreenOn`/`ScreenOff` | 亮屏/息屏 |
| 充电器插拔 | `ChargerPlug`/`ChargerUnplug` | 充电器事件 |
| 蓝牙连接 | `BTConnectedTo` | 蓝牙设备连接 |
| WiFi连接 | `WifiConnectedTo` | WiFi连接变化 |
| 摇晃手机 | `ShakeDevice` | 物理摇晃 |
| 边缘手势 | `EdgeGesture` | 屏幕边缘手势 |
| 按键事件 | `AdvancedKeyEvent` | 物理按键 |
| 剪贴板变化 | `ClipboardContentChanged` | 剪贴板内容变化 |
| 电量变化 | `BatteryLevelChanged` | 电量百分比变化 |

## 常用动作速查

| 动作 | @type | 用途 |
|-----|-------|------|
| Shell命令 | `ShellCommand` | 执行 Shell 命令 |
| 显示Toast | `ShowToast` | 显示提示消息 |
| 条件分支 | `IfThenElse` | 条件判断 |
| 延迟 | `Delay` | 暂停执行 |
| 启动应用 | `LaunchApp` | 打开应用 |
| 停止应用 | `StopApp` | 强制停止应用 |
| WiFi开关 | `SetWifiEnabled`/`ToggleWifi` | WiFi控制 |
| 蓝牙开关 | `SetBTEnabled`/`ToggleBT` | 蓝牙控制 |
| HTTP请求 | `HttpRequest` | 发送网络请求 |
| 执行JS | `ExecuteJS` | 执行JavaScript |
| 发送通知 | `PostNotification` | 发送系统通知 |
| 对话框 | `ShowAlertDialog` | 显示对话框 |
| 输入框 | `ShowTextFieldDialog` | 显示输入框 |
| 循环 | `ForEach`/`WhileLoop` | 循环执行 |
| 全局变量 | `CreateGlobalVar`/`WriteGlobalVar` | 变量操作 |

## 生成原则

1. **ID 唯一性**：每个组件的 `id` 字段必须唯一。触发器用 `F-001`、`F-002`，条件用 `C-001`，动作用 `A-001` 依次编号。
2. **@type 准确性**：所有 `@type` 字段必须使用 `type.googleapis.com/` 前缀加组件名，如 `type.googleapis.com/ShellCommand`。在生成前查阅参考文档确认准确的类型名。
3. **变量引用**：上下文变量用 `{}`，全局变量用 `globalVarOf$`，局部变量用 `localVarOf$`，系统环境变量用 `%%`。
4. **customContextDataKey**：当需要在同一指令中多次使用同类型动作（如多个 ShellCommand）时，使用此字段重命名输出变量以避免覆盖。
5. **JSON 转义**：在 JSON 字符串值中，嵌套的引号需要转义 `\"`，换行用 `\\n`。
6. **参数化**：对于用户可能需要自定义的值（如包名、URL、关键词），使用 `parameters` 定义参数，动作中用 `{参数名}` 引用。
7. **默认值**：`condOp` 默认 `ALL`，`asyncMode` 默认 `AsyncMode_Async`，`conflictPolicy` 默认 `ConflictStrategy_ExecuteBoth`，`isEnabled` 默认 `true`。
8. **钩子和退出**：没有特殊需要时 `hook` 和 `quit` 可以设为 `{}`。需要初始化全局变量时在 `actionsOnEnabled` 中创建。
