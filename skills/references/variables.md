# 变量系统参考

## 变量类型概览

| 类型 | 引用语法 | 生命周期 | 可读 | 可写 |
|------|---------|---------|------|------|
| 上下文变量 | `{变量名}` | 当前动作执行期间 | 是 | 系统自动填充 |
| 全局变量 | `globalVarOf$变量名` | 永久 | 是 | 是 |
| 局部变量 | `localVarOf$变量名` | 当前指令执行期间 | 是 | 是 |
| 系统环境变量 | `%变量名%` | 实时 | 是 | 否 |

## 上下文变量

系统自动填充，不同触发器/动作产生不同的上下文变量。

### 触发器产生的上下文变量

| 触发器 | 变量 | 说明 |
|-------|------|------|
| NotificationPosted/Updated/Removed | `{title}`, `{contentText}`, `{pkgName}`, `{userId}`, `{notificationTag}` | 通知信息 |
| AppBecomeFg/AppBecomeBg | `{pkgName}`, `{appLabel}`, `{userId}` | 应用信息 |
| ActivityStarted | `{pkgName}`, `{activityName}`, `{appLabel}`, `{componentName}` | Activity 信息 |
| TaskRemoved | `{pkgName}`, `{appLabel}`, `{taskId}` | 任务信息 |
| BatteryLevelChanged | `{batteryLevel}` | 电量百分比 |
| ClipboardContentChanged | `{clipboardContent}` | 剪贴板内容 |
| BTConnectedTo | `{btDeviceAlias}`, `{btDeviceAddress}`, `{btDeviceBatteryLevel}` | 蓝牙设备信息 |
| WifiConnectedTo | `{ssid}`, `{isWifiEnabled}`, `{wifiStatusLabel}` | WiFi 信息 |
| CallStateChanged | `{callState}`, `{incomingNumber}` | 通话信息 |
| EdgeGesture | `{eventX}`, `{eventY}` | 触摸坐标 |
| KeyEvent/AdvancedKeyEvent | `{keyCode}`, `{pressTimes}` | 按键信息 |
| LightSensor | `{lightIntensity}` | 光线强度 |
| Sound | `{decibels}` | 分贝值 |
| Logcat | `{line}` | 日志行 |
| IncomingShare | `{sharedText}`, `{sharedUri}`, `{sharedMimeType}`, `{sourceAppPkg}` | 分享内容 |
| BrowserIntercept | `{url}`, `{host}`, `{scheme}`, `{path}`, `{query}`, `{sourceAppPkg}` | URL 信息 |
| Broadcast | `{intent}` | Intent 对象 |
| 触发器匹配 | `{factTag}` | 匹配到的触发器标签 |

### 动作产生的上下文变量

| 动作 | 变量 | 说明 |
|-----|------|------|
| ShellCommand | `{shellOut}`, `{shellErr}`, `{shellCode}` | 命令输出/错误/退出码 |
| ExecuteJS | `{jsRet}` | JS 返回值 |
| ExecuteMVEL | `{mvelRet}` | MVEL 返回值 |
| HttpRequest (Raw) | `{httpRequestRet}` | 完整响应体 |
| HttpRequest (JsonMap) | `{httpRequestRet1}`, `{httpRequestRet2}`... | JSON 解析结果 |
| ShowTextFieldDialog | `{textFieldInput1}`, `{textFieldInput2}`... | 用户输入 |
| ForEach | `{foreachData}`, `{foreachIndex}` | 当前元素/索引 |
| ForEachPkgSet | `{loopAppPkgName}`, `{loopAppLabel}`, `{loopAppUserId}` | 应用信息 |
| TakeScreenshot | `{screenshotFilePath}`, `{screenshotFileUri}` | 截图路径 |
| TakePhoto | `{photoFilePath}`, `{photoFileUri}` | 照片路径 |
| GetCurrentLocationInfo | `{latitude}`, `{longitude}`, `{provider}`, `{accuracy}` | 位置信息 |
| ParseQRCode | `{qrCodeText}` | 二维码文本 |
| OcrDetect | `{ocrResult}` | OCR 结果 |
| MatchRegex | `{isMatch}`, `{matchResult}` | 匹配结果 |
| ReplaceRegex | `{replaceResult}` | 替换结果 |
| FindAndClickViewByText | `{matchedViewText}`, `{matchedViewId}` | 视图信息 |
| SelectScreenArea | `{rectLeft}`, `{rectTop}`, `{rectRight}`, `{rectBottom}`, `{rectFlattenToString}` | 区域坐标 |
| ShowListDialog | `{selectedListItem}` | 选择项 |
| ShowChoiceDialog | `{choices}` | 选择值 |
| DownloadFile | `{isDownloadSuccess}`, `{downloadFileUri}`, `{downloadFilePath}` | 下载结果 |
| WebSocketConnect | `{wsMessage}`, `{wsReason}`, `{wsEvent}` | WS 消息 |
| GetAppInfo | `{appLabel}`, `{versionCode}`, `{versionName}`, `{isRunning}` | 应用信息 |
| GetScreenOnTime | `{screenOnTime}` | 亮屏时间 |

### customContextDataKey — 自定义上下文变量名

当同一指令中多次使用同类动作时，用 `customContextDataKey` 重命名输出变量避免覆盖：

```json
{
  "@type": "type.googleapis.com/ShellCommand",
  "command": "dumpsys battery | grep level",
  "customContextDataKey": {"keys": [{"first": "shellOut", "second": "电量数据"}]}
}
```
之后用 `{电量数据}` 引用，而不是 `{shellOut}`。

注意：`{textFieldInput1}` 和 `{foreachData}` 等变量是硬编码的，不支持 customContextDataKey 重命名。

## 全局变量

永久保存，跨指令共享。需要手动创建。

### 变量类型
| Proto 类型 | 数据类型 | 示例 |
|-----------|---------|------|
| `StringVar` | 字符串 | "Hello" |
| `Int64Var` | 整数 | 42 |
| `BoolVar` | 布尔 | true/false |
| `StringListVar` | 字符串列表 | ["a", "b"] |
| `Int64ListVar` | 整数列表 | [1, 2, 3] |
| `BoolListVar` | 布尔列表 | [true, false] |

### 操作
- `CreateGlobalVar`：创建变量
- `WriteGlobalVar`：写入/修改变量（支持 15 种操作）
- `DeleteGlobalVar`：删除变量
- `AddToGlobalVar`：向列表添加元素
- `EvaluateGlobalVar`：条件评估变量值

### WriteGlobalVar 操作详解

| op 值 | 说明 | 适用类型 |
|-------|------|---------|
| `Override` | 直接覆盖 | 所有 |
| `AppendToLast` | 追加到末尾 | String, List |
| `AppendToFirst` | 插入到开头 | String, List |
| `DeleteValue` | 删除指定值 | String, List |
| `DeleteLast` | 删除最后一个 | List |
| `DeleteFirst` | 删除第一个 | List |
| `RemoveAtIndex` | 删除指定位置 | List |
| `Clear` | 清空 | List |
| `Reverse` | 反转 | List |
| `Shuffle` | 随机打乱 | List |
| `Plus1` | 加 1 | Int64 |
| `Minus1` | 减 1 | Int64 |
| `Invert` | 取反 | Bool |
| `PlusDelta` | 加指定值 | Int64 |
| `MinusDelta` | 减指定值 | Int64 |

op 值使用时加前缀 `WriteGlobalVarOp_`，如 `WriteGlobalVarOp_Override`。

## 局部变量

仅当前指令执行期间有效，指令结束自动销毁。

### 操作
- `CreateLocalVar`：创建
- `WriteLocalVar`：写入
- 引用：`localVarOf$变量名`

## 系统环境变量

实时获取的只读数据源，用 `%变量名%` 引用。

| 变量 | 说明 | 带参数语法 |
|------|------|----------|
| `%UUID%` | 随机 UUID | - |
| `%BatteryLevel%` | 电量百分比 | - |
| `%BatteryTemperature%` | 电池温度 | - |
| `%IsCharging%` | 是否充电 | - |
| `%CurrentTimeMillis%` | 时间戳(ms) | - |
| `%CurrentTimeFormated%` | 格式化时间 | - |
| `%ClipboardText%` | 剪贴板文字 | - |
| `%FrontAppLabel%` | 前台应用名 | - |
| `%FrontAppPkgName%` | 前台应用包名 | - |
| `%SystemSettings@设置项%` | 系统设置值 | 是 |
| `%CpuAvailabilityPercent%` | CPU可用% | `%CpuAvailabilityPercent@核心号%` |
| `%CpuTemperature%` | CPU温度 | - |
| `%MemAvailabilityPercent%` | 内存可用% | - |
| `%SwapAvailabilityPercent%` | Swap可用% | - |
| `%NetworkType%` | 网络类型 | - |
| `%WifiSSID%` | WiFi名称 | - |
| `%IsConnected%` | 是否联网 | - |
| `%RingerMode%` | 铃声模式 | - |
| `%DndMode%` | 免打扰模式 | - |
| `%MediaVolume%` | 媒体音量 | - |
| `%ScreenBrightness%` | 屏幕亮度 | - |
| `%DeviceUpTime%` | 设备运行时长(s) | - |
| `%DeviceModel%` | 设备型号 | - |
| `%AndroidVersion%` | Android版本 | - |
| `%RandomInt%` | 随机数(0-99) | `%RandomInt@1-100%` |
| `%LastRebootTime%` | 上次开机时间(ms) | - |

## 在不同场景中使用变量

所有变量类型都可在动作字段、条件、Shell、JS、MVEL 中使用。系统通过 `compileContextAndVars` 统一替换。

```
// 动作字段
{"message": "WiFi: {ssid}, 电量: globalVarOf$电量, 当前: %BatteryLevel%%"}

// Shell 命令
{"command": "echo '电量: {batteryLevel}, WiFi: globalVarOf$WiFi状态'"}

// JavaScript
{"expression": "var pkg = '{pkgName}'; var wifi = globalVarOf$WiFi状态; var jsRet = pkg + wifi;"}

// MVEL
{"expression": "'电量: ' + {batteryLevel} + '%, WiFi: ' + globalVarOf$WiFi状态"}
```
