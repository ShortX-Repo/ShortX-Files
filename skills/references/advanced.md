# 高级功能参考

## 退出指令 (Quit)

当触发器事件不匹配自动指令的正常触发器时，系统会检查退出逻辑。

### 退出结构
```json
{
  "quit": {
    "isEnabled": true,
    "facts": [退出触发器列表],
    "conditions": [退出条件列表],
    "condOp": "ALL",
    "actions": [退出动作列表],
    "evaluatePolicy": "Quit_EvaluatePolicy_Always"
  }
}
```

### 退出评估策略
| 策略 | 说明 |
|------|------|
| `Quit_EvaluatePolicy_Always` | 总是评估退出逻辑 |
| `Quit_EvaluatePolicy_Only_When_Is_Running` | 仅当有运行中的任务时评估 |
| `Quit_EvaluatePolicy_Once` | 每次执行后仅评估一次 |

### 典型场景

**VPN 自动管理：**
- 正常触发：应用前台 → 开启 VPN
- 退出触发：应用后台 → 关闭 VPN
```json
{
  "quit": {
    "isEnabled": true,
    "facts": [{"@type": "type.googleapis.com/AppBecomeBg", "pkgSets": ["翻墙"]}],
    "conditions": [{"@type": "type.googleapis.com/VPNIsConnected"}],
    "actions": [{"@type": "type.googleapis.com/StopApp", "appPkg": [{"pkgName": "com.v2ray.ang"}]}],
    "evaluatePolicy": "Quit_EvaluatePolicy_Always"
  }
}
```

## 钩子机制 (Hook)

### 自动指令钩子 (RuleHook)
```json
{
  "hook": {
    "actionsOnEnabled": [启用时动作],
    "actionsOnDisabled": [禁用时动作],
    "actionsOnDeleted": [删除时动作],
    "actionsOnUpdated": [更新时动作],
    "actionsOnStop": [停止时动作]
  }
}
```

### 一键指令钩子 (DirectActionHook)
```json
{
  "hook": {
    "actionsOnStart": [启动时动作],
    "actionsOnStop": [停止时动作]
  }
}
```

### 典型用途
- `actionsOnEnabled`：创建全局变量、初始化目录
- `actionsOnDisabled`：清理临时文件
- `actionsOnDeleted`：删除关联的全局变量

## 参数 (Parameters)

为指令定义可自定义参数，用户导入时可修改。

```json
{
  "parameters": [
    {"name": "目标包名", "defaultValue": "com.tencent.mm", "isRequired": true, "comments": "要操作的应用包名"},
    {"name": "Webhook地址", "defaultValue": "https://hooks.example.com/xxx", "isRequired": true, "comments": "Webhook URL"}
  ]
}
```

在动作中用 `{参数名}` 引用参数值。

## 函数 (Function)

可复用的动作序列，支持参数和返回值。

### 函数定义
```json
{
  "id": "func-get-weather",
  "name": "获取天气",
  "returnType": "string",
  "parameters": [
    {"name": "city", "defaultValue": "beijing", "isRequired": true, "comments": "城市名"}
  ],
  "actions": [
    {"@type": "type.googleapis.com/HttpRequest", "url": "https://api.example.com/weather?city={city}", "method": "GET"},
    {"@type": "type.googleapis.com/SetFunctionReturnValue", "value": "{httpRequestRet}"}
  ],
  "resultContextDataKey": "天气数据"
}
```

### 调用函数
```json
{"@type": "type.googleapis.com/ExecuteFunction", "functionId": "func-get-weather", "funcParameterInputs": [{"name": "city", "value": "shanghai"}], "resultContextDataKey": "天气结果"}
```

## 异步模式 (AsyncMode)

### asyncMode — 指令间的执行关系
| 值 | 说明 |
|----|------|
| `AsyncMode_Async` | 异步，不同指令并行执行（默认） |
| `AsyncMode_Sync` | 同步，全局互斥锁，指令依次执行 |
| `AsyncMode_Sync_InRule` | 同指令同步，不同指令并行 |

### actionAsyncMode — 同一指令内动作间关系
| 值 | 说明 |
|----|------|
| `ActionAsyncMode_Sync` | 动作按顺序执行（默认） |
| `ActionAsyncMode_Async` | 动作并行执行 |

## 冲突策略 (ConflictPolicy)

同一指令连续触发时的处理：
| 值 | 说明 |
|----|------|
| `ConflictStrategy_ExecuteBoth` | 同时执行新旧任务（默认） |
| `ConflictStrategy_ReplaceOld` | 取消旧任务，执行新任务 |
| `ConflictStrategy_SkipNew` | 跳过新任务，保留旧任务 |

## 实例 ID 生成器 (RuleInstanceIdGenerator)

控制冲突策略的粒度。相同实例 ID 的任务才触发冲突处理。

### Static（默认）
```json
{"ruleInstanceIdGenerator": {"@type": "type.googleapis.com/RuleInstanceIdGenerator_Static", "insId": "固定ID"}}
```

### String（按变量分组）
```json
{"ruleInstanceIdGenerator": {"@type": "type.googleapis.com/RuleInstanceIdGenerator_String", "insId": "{pkgName}"}}
```

### MVEL / JS（动态逻辑）
```json
{"ruleInstanceIdGenerator": {"@type": "type.googleapis.com/RuleInstanceIdGenerator_MVEL", "expression": "\"group_\" + ({batteryLevel} > 50 ? \"high\" : \"low\")"}}
{"ruleInstanceIdGenerator": {"@type": "type.googleapis.com/RuleInstanceIdGenerator_JS", "expression": "var hour = new Date().getHours(); hour < 12 ? 'morning' : 'afternoon';"}}
```

## 脚本引擎

### JavaScript (ExecuteJS)
使用 Rhino 引擎，支持 java.io、java.net、org.json、android.* 等 Java 类。

```json
{"@type": "type.googleapis.com/ExecuteJS", "expression": "var jsRet = 'result';", "context": "CoroutineContext_Default"}
```

context 线程切换：
- `CoroutineContext_Default`：默认线程池
- `CoroutineContext_IO`：IO 线程池
- `CoroutineContext_UI`：UI Handler 线程（浮窗/View 操作必须用此线程）

返回值通过设置 `jsRet` 变量。

### MVEL (ExecuteMVEL)
轻量级表达式引擎，同步执行。

可用 API（通过 `shortx` 对象）：
- `shortx.setClipboard(text)` / `shortx.getClipboard()`
- `shortx.showToast(message)`
- `shortx.shell(command)`
- `shortx.httpGet(url)` / `shortx.httpPost(url, body)`
- `shortx.readGlobalVar(name)` / `shortx.writeGlobalVar(name, value)`
- `shortx.batteryLevel()` / `shortx.batteryTemperature()`
- `shortx.screenOn()` / `shortx.wifiConnected()` / `shortx.btEnabled()`

## 边缘手势 (EdgeGesture)

### 边缘位置
LeftTop/LeftMiddle/LeftBottom/RightTop/RightMiddle/RightBottom/TopLeft/TopMiddle/TopRight/BottomLeft/BottomMiddle/BottomRight 及 Left/Right/Top/Bottom

### 手势类型
Tap（单击）、DoubleTap（双击）、LongPress（长按）、SwipeLeft/SwipeRight/SwipeUp/SwipeDown（滑动）

### 多步骤手势
```json
{"childSteps": [{"type": "SwipeLeft"}, {"type": "SwipeUp"}]}
```

## 磁贴 (QS Tile)

ShortX 提供 Tile1-Tile9 共 9 个自定义磁贴。

触发器：`OnQSTileClick`
动作：`ClickTile`

## 状态栏 Chip

```json
{"@type": "type.googleapis.com/ShowStatusBarChip", "text": "文字", "icon": "icon-name", "clickAction": [], "longClickAction": []}
```

## 图标名称

常用：bluetooth, wifi, flashlight, location, nfc, volume, brightness, settings, notifications, search, share, delete, edit, add, close, check, error, info, warning, chat-2-line, code, cloud, download, upload, refresh, sync, play, pause, stop, skip-next, skip-previous
