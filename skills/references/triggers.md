# 触发器 (Fact) 完整参考

触发器定义"什么时候"触发自动指令。

## 公共字段

所有触发器都包含以下公共尾部字段（Proto field number 97-101）：

| 字段 | 类型 | 说明 |
|------|------|------|
| tag | string | 标签，用于 `RequireFactTag` 条件判断来源 |
| customContextDataKey | CustomContextDataKey | 自定义上下文数据键值对，触发时自动注入到上下文 |
| note | string | 备注说明 |
| id | string | 触发器唯一标识（如 `F-001`） |
| isDisabled | bool | 是否禁用此触发器 |

## 共享类型参考

以下类型在多个触发器中重复使用：

**AppPkg** — 应用包标识
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgName | string | 应用包名，如 `com.example.app` |
| userId | int32 | 用户 ID，多用户设备中区分用户，默认 0 |

**AppComponent** — 应用组件标识
| 字段 | 类型 | 说明 |
|------|------|------|
| pkg | AppPkg | 应用包标识 |
| className | string | 组件完整类名，如 `com.example.MainActivity` |

**ProcessName** — 进程名标识
| 字段 | 类型 | 说明 |
|------|------|------|
| userId | int32 | 用户 ID |
| processName | string | 进程名称 |

**OnOffAny 枚举** — 开关状态筛选
| 值 | 说明 |
|------|------|
| On (0) | 仅在开启时触发 |
| Off (1) | 仅在关闭时触发 |
| Any (2) | 任意状态变化均触发 |

**TimeOfADay** — 一天中的时间点
| 字段 | 类型 | 说明 |
|------|------|------|
| hour | int32 | 小时（0-23） |
| minutes | int32 | 分钟（0-59） |
| seconds | int32 | 秒（0-59） |

**RepeatDays** — 重复日
| 字段 | 类型 | 说明 |
|------|------|------|
| days | repeated WeekDay | 需要重复的星期几 |

**WeekDay 枚举**
| 值 | 说明 |
|------|------|
| MONDAY (0) | 周一 |
| TUESDAY (1) | 周二 |
| WEDNESDAY (2) | 周三 |
| THURSDAY (3) | 周四 |
| FRIDAY (4) | 周五 |
| SATURDAY (5) | 周六 |
| SUNDAY (6) | 周日 |

**WorkdayFilter** — 工作日过滤
| 字段 | 类型 | 说明 |
|------|------|------|
| dayType | CalendarDayType | 日历日类型过滤 |

**CalendarDayType 枚举**
| 值 | 说明 |
|------|------|
| AnyDay (0) | 任意日 |
| WorkdayOnly (1) | 仅工作日 |
| HolidayOnly (2) | 仅节假日 |
| WeekendOnly (3) | 仅周末 |
| TransferWorkdayOnly (4) | 仅调休工作日 |

**RegexMatchOptions 枚举** — 正则匹配方式
| 值 | 说明 |
|------|------|
| RegexMatchOptions_Match (0) | 完全匹配（整个字符串必须匹配正则） |
| RegexMatchOptions_ContainsMatchIn (1) | 包含匹配（字符串中包含匹配即可） |

**ValueConstraints** — 数值约束条件
| 字段 | 类型 | 说明 |
|------|------|------|
| op | GlobalVarOp | 比较运算符 |
| payload | GlobalVarOpPayload | 比较值 |

**GlobalVarOp 枚举** — 比较运算符
| 值 | 说明 |
|------|------|
| GreaterThan (0) | 大于 |
| GreaterThanOrEQ (1) | 大于等于 |
| LessThan (2) | 小于 |
| LessThanOrEQ (3) | 小于等于 |
| EqualTo (4) | 等于 |
| Contains (5) | 包含 |
| DoesNotContain (6) | 不包含 |
| NotSet (7) | 未设置 |
| HasBeenSet (8) | 已设置 |
| IsEmpty (9) | 为空 |
| IsNotEmpty (10) | 不为空 |
| IsExists (11) | 存在 |
| IsNotExists (12) | 不存在 |

**GlobalVarOpPayload**
| 字段 | 类型 | 说明 |
|------|------|------|
| value | string | 比较值（字符串表示） |

**SensorValueTrend 枚举** — 传感器值趋势
| 值 | 说明 |
|------|------|
| SensorValueTrend_Any (0) | 任意变化 |
| SensorValueTrend_Increase (1) | 仅上升 |
| SensorValueTrend_Decrease (2) | 仅下降 |

**Rect** — 矩形区域
| 字段 | 类型 | 说明 |
|------|------|------|
| left | int32 | 左边缘偏移 |
| top | int32 | 上边缘偏移 |
| right | int32 | 右边缘偏移 |
| bottom | int32 | 下边缘偏移 |

**StringPair** — 键值对
| 字段 | 类型 | 说明 |
|------|------|------|
| first | string | 键 |
| second | string | 值 |

**CustomContextDataKey**
| 字段 | 类型 | 说明 |
|------|------|------|
| keys | repeated StringPair | 自定义键值对列表，触发时注入上下文 |

**Notification** — 通知过滤条件子消息
| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 通知标题匹配文本或正则 |
| titleRegexOptions | RegexMatchOptions | 标题正则匹配方式 |
| contentText | string | 通知内容匹配文本或正则 |
| contentRegexOptions | RegexMatchOptions | 内容正则匹配方式 |
| apps | repeated AppPkg | 限定通知来源应用列表 |
| pkgSets | repeated string | 限定通知来源应用集合名称 |
| notificationId | string | 通知 ID 过滤 |
| notificationChannel | string | 通知渠道过滤 |
| isFgService | bool | 是否前台服务通知 |
| tag | string | 通知 tag 过滤 |
| key | string | 通知 key 过滤 |
| ongoing | bool | 是否持续通知 |
| extras | repeated AndroidIntentExtra | 通知附加数据过滤 |

---

## 应用生命周期

### AppBecomeFg — 应用进入前台
当指定应用切换到前台（可见并可交互）时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表，为空则匹配所有应用 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`, `{appLabel}`

**Proto：**
```json
{"@type": "type.googleapis.com/AppBecomeFg", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### AppBecomeBg — 应用进入后台
当指定应用从前台切换到后台时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`, `{appLabel}`

**Proto：**
```json
{"@type": "type.googleapis.com/AppBecomeBg", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### ActivityStarted — Activity 启动
当指定 Activity 组件启动时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| components | repeated AppComponent | 监控的 Activity 组件列表（包名+类名） |

**上下文变量：** `{pkgName}`, `{userId}`, `{componentName}`, `{appLabel}`, `{taskLabel}`, `{activityIntentUri}`

**Proto：**
```json
{"@type": "type.googleapis.com/ActivityStarted", "components": [{"pkg": {"pkgName": "com.example.app"}, "className": "com.example.MainActivity"}], "tag": "", "id": "F-001"}
```

### ActivityStopped — Activity 停止
当指定 Activity 组件停止（不再可见）时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| components | repeated AppComponent | 监控的 Activity 组件列表 |

**上下文变量：** `{pkgName}`, `{userId}`, `{componentName}`, `{appLabel}`, `{taskLabel}`

**Proto：**
```json
{"@type": "type.googleapis.com/ActivityStopped", "components": [{"pkg": {"pkgName": "com.example.app"}, "className": "com.example.MainActivity"}], "tag": "", "id": "F-001"}
```

### ActivityDestroyed — Activity 销毁
当指定 Activity 组件被销毁时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| components | repeated AppComponent | 监控的 Activity 组件列表 |

**上下文变量：** `{pkgName}`, `{userId}`, `{componentName}`, `{appLabel}`, `{taskLabel}`

**Proto：**
```json
{"@type": "type.googleapis.com/ActivityDestroyed", "components": [{"pkg": {"pkgName": "com.example.app"}, "className": "com.example.MainActivity"}], "tag": "", "id": "F-001"}
```

### TaskRemoved — 任务被移除（划卡）
当用户从最近任务列表中划掉应用时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`, `{appLabel}`, `{taskId}`

**Proto：**
```json
{"@type": "type.googleapis.com/TaskRemoved", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### AppAdded — 应用安装
当有新应用被安装时触发。无过滤参数，所有安装事件均触发。

**参数：** 无特有参数。

**上下文变量：** `{pkgName}`, `{userId}`, `{label}`

**Proto：**
```json
{"@type": "type.googleapis.com/AppAdded", "tag": "", "id": "F-001"}
```

### AppRemoved — 应用卸载
当指定应用被卸载时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表，为空则匹配所有卸载事件 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`, `{label}`

**Proto：**
```json
{"@type": "type.googleapis.com/AppRemoved", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### AppUpdated — 应用更新
当指定应用被更新时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`, `{label}`, `{fromVersionCode}`, `{toVersionCode}`

**Proto：**
```json
{"@type": "type.googleapis.com/AppUpdated", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### PkgStartRunning — 应用开始运行（冷启动）
当指定应用从完全停止状态首次启动（冷启动）时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`, `{appLabel}`

**Proto：**
```json
{"@type": "type.googleapis.com/PkgStartRunning", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### PkgStopRunning — 应用停止运行
当指定应用的所有进程都被杀死、完全停止运行时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`, `{appLabel}`

**Proto：**
```json
{"@type": "type.googleapis.com/PkgStopRunning", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### AppProcessStarted — 应用进程启动
当指定进程名称的进程被创建时触发。比 PkgStartRunning 更细粒度，可以监控特定进程。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| processName | repeated ProcessName | 监控的进程名列表（含 userId 和 processName） |

**上下文变量：** `{processName}`, `{appLabel}`, `{userId}`, `{pkgName}`

**Proto：**
```json
{"@type": "type.googleapis.com/AppProcessStarted", "processName": [{"userId": 0, "processName": "com.example.app"}], "tag": "", "id": "F-001"}
```

### AppProcessRemoved — 应用进程移除
当指定进程名称的进程被杀死时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| processName | repeated ProcessName | 监控的进程名列表 |

**上下文变量：** `{processName}`, `{appLabel}`, `{userId}`, `{pkgName}`

**Proto：**
```json
{"@type": "type.googleapis.com/AppProcessRemoved", "processName": [{"userId": 0, "processName": "com.example.app"}], "tag": "", "id": "F-001"}
```

### AppGainWindowFocus — 应用获得窗口焦点
当指定应用的窗口获得焦点时触发。比 AppBecomeFg 更底层，可以检测悬浮窗等场景。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`

**Proto：**
```json
{"@type": "type.googleapis.com/AppGainWindowFocus", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### AppLostWindowFocus — 应用失去窗口焦点
当指定应用的窗口失去焦点时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`

**Proto：**
```json
{"@type": "type.googleapis.com/AppLostWindowFocus", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### AudioFocusGain — 应用获得音频焦点
当指定应用获得音频焦点（开始播放音频）时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/AudioFocusGain", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### AudioFocusLost — 应用失去音频焦点
当指定应用失去音频焦点（停止播放音频）时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/AudioFocusLost", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### AudioFocusChanged — 音频焦点变化
当任意应用的音频焦点发生变化（获得或失去）时触发。提供焦点变化详情。

**参数：** 无特有参数。

**上下文变量：** `{pkgName}`, `{userId}`, `{isGain}`, `{isLost}`

**Proto：**
```json
{"@type": "type.googleapis.com/AudioFocusChanged", "tag": "", "id": "F-001"}
```

---

## 通知

### NotificationPosted — 通知发布
当匹配条件的通知被发布时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| record | Notification | 通知过滤条件（见共享类型 Notification 子消息） |

**上下文变量：** `{pkgName}`, `{userId}`, `{title}`, `{contentText}`, `{notificationTag}`

**Proto：**
```json
{"@type": "type.googleapis.com/NotificationPosted", "record": {"title": "", "contentText": "", "apps": [{"pkgName": "com.example.app"}]}, "tag": "", "id": "F-001"}
```

### NotificationUpdated — 通知更新
当已存在的通知被更新时触发。可分别设置旧通知和新通知的匹配条件。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| old | Notification | 旧通知过滤条件 |
| new | Notification | 新通知过滤条件 |

**上下文变量：** `{pkgName}`, `{userId}`, `{title}`, `{contentText}`, `{notificationTag}`

**Proto：**
```json
{"@type": "type.googleapis.com/NotificationUpdated", "old": {}, "new": {}, "tag": "", "id": "F-001"}
```

### NotificationRemoved — 通知移除
当通知被移除时触发。可区分用户手动滑动移除还是应用主动取消。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| record | Notification | 通知过滤条件 |
| byUser | bool | true=用户手动滑除，false=应用主动取消 |

**上下文变量：** `{pkgName}`, `{userId}`, `{title}`, `{contentText}`, `{notificationTag}`

**Proto：**
```json
{"@type": "type.googleapis.com/NotificationRemoved", "record": {"apps": [{"pkgName": "com.example.app"}]}, "byUser": false, "tag": "", "id": "F-001"}
```

---

## 系统状态

### SystemReady — 系统就绪
系统启动完成后触发。每次开机触发一次。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/SystemReady", "tag": "", "id": "F-001"}
```

### ScreenOn — 亮屏
设备屏幕点亮时触发。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/ScreenOn", "tag": "", "id": "F-001"}
```

### ScreenOff — 息屏
设备屏幕熄灭时触发。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/ScreenOff", "tag": "", "id": "F-001"}
```

### UserPresent — 用户解锁
用户解锁设备后触发。每次解锁都会触发。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/UserPresent", "tag": "", "id": "F-001"}
```

### UserPresentAtTheFirstTime — 首次用户解锁
系统启动后用户首次解锁时触发。每次开机仅触发一次。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/UserPresentAtTheFirstTime", "tag": "", "id": "F-001"}
```

### SystemSettingsChanged — 系统设置变更
当指定的系统设置值发生变化时触发。通过 Settings URL 和正则表达式匹配设置变化。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| urlAndExpectedValueRegex | StringPair | first=设置 URL（如 `content://settings/system/screen_brightness`），second=预期值正则 |
| matchOptions | RegexMatchOptions | 正则匹配方式 |

**上下文变量：** `{settingsUrl}`, `{settingsValue}`

**Proto：**
```json
{"@type": "type.googleapis.com/SystemSettingsChanged", "urlAndExpectedValueRegex": {"first": "content://settings/system/screen_brightness", "second": ".*"}, "matchOptions": "RegexMatchOptions_Match", "tag": "", "id": "F-001"}
```

### GlobalVarChanged — 全局变量变更
当指定的 ShortX 全局变量值发生变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| gvId | string | 全局变量 ID |

**上下文变量：** 无特有上下文变量（可通过 `GetGlobalVar` 动作读取变量值）。

**Proto：**
```json
{"@type": "type.googleapis.com/GlobalVarChanged", "gvId": "my_variable_id", "tag": "", "id": "F-001"}
```

### Logcat — 日志匹配
当系统日志（logcat）中出现匹配正则表达式的行时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| regex | string | 匹配日志行的正则表达式 |
| regexMatchOptions | RegexMatchOptions | 正则匹配方式 |

**上下文变量：** `{line}`

**Proto：**
```json
{"@type": "type.googleapis.com/Logcat", "regex": ".*error.*", "regexMatchOptions": "RegexMatchOptions_ContainsMatchIn", "tag": "", "id": "F-001"}
```

### HasFoundNodeOnScreen — 屏幕上找到节点
当无障碍服务在屏幕上检测到匹配条件的 UI 节点时触发。需要无障碍权限。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| packageName | string | 限定在此包名的应用中查找 |
| componentName | string | 限定在此 Activity 组件中查找 |
| matchers | repeated google.protobuf.Any | 匹配器列表，可包含 NodeMatcherViewId 或 NodeMatcherText |
| detectTimeout | int64 | 检测超时时间（毫秒） |

**匹配器子消息：**

NodeMatcherViewId:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | View 的资源 ID |

NodeMatcherText:
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 匹配的文本或正则 |
| isRegex | bool | 是否为正则表达式 |
| regexOptions | RegexMatchOptions | 正则匹配方式 |

**上下文变量：** `{matchedViewText}`, `{matchedViewTextIsRegex}`, `{matchedViewId}`, `{sourceNodeId}`, `{windowId}`

**Proto：**
```json
{"@type": "type.googleapis.com/HasFoundNodeOnScreen", "packageName": "com.example.app", "componentName": "", "matchers": [{"@type": "type.googleapis.com/NodeMatcherText", "text": "确定", "isRegex": false}], "detectTimeout": 5000, "tag": "", "id": "F-001"}
```

### ScreenOnTime — 屏幕亮屏时长
当屏幕亮屏持续达到指定时长时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| timeInSeconds | string | 触发阈值（秒），字符串格式 |
| from | ScreenOnTimeStartFrom | 计时起点 |
| publishDataFromScreenOffTime | int64 | 内部数据：从上次息屏开始的时间（仅用于发布数据） |
| publishDataFromSystemReadyTime | int64 | 内部数据：从系统就绪开始的时间（仅用于发布数据） |

**ScreenOnTimeStartFrom 枚举：**
| 值 | 说明 |
|------|------|
| ScreenOnTimeStartFrom_LastScreenOff (0) | 从上次息屏后开始计时 |
| ScreenOnTimeStartFrom_SystemReady (1) | 从系统就绪后开始计时 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/ScreenOnTime", "timeInSeconds": "3600", "from": "ScreenOnTimeStartFrom_LastScreenOff", "tag": "", "id": "F-001"}
```

### CpuAvgAvailability — CPU 平均可用率
当 CPU 平均可用率达到指定条件时触发。用于监控 CPU 负载。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| latestAvgAvailabilityPercent | int64 | 最新平均 CPU 可用率百分比 |
| pastNMillisAvgAvailabilityPercent | int64 | 过去 N 毫秒平均 CPU 可用率百分比 |
| pastNMillisDuration | int64 | 计算周期时长（毫秒） |

**上下文变量：** `{latestAvgAvailabilityPercent}`, `{pastNMillisAvgAvailabilityPercent}`, `{pastNMillisDuration}`

**Proto：**
```json
{"@type": "type.googleapis.com/CpuAvgAvailability", "latestAvgAvailabilityPercent": 0, "pastNMillisAvgAvailabilityPercent": 0, "pastNMillisDuration": 60000, "tag": "", "id": "F-001"}
```

### WindowRotationChange — 窗口旋转变化
当屏幕窗口旋转角度发生变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| degree | ScreenRotateDegree | 目标旋转角度 |

**ScreenRotateDegree 枚举：**
| 值 | 说明 |
|------|------|
| ScreenRotateDegree_0 (0) | 竖屏（正常方向） |
| ScreenRotateDegree_90 (1) | 横屏（顺时针 90 度） |
| ScreenRotateDegree_180 (2) | 倒置竖屏 |
| ScreenRotateDegree_270 (3) | 横屏（逆时针 90 度） |
| ScreenRotateDegree_Any (4) | 任意旋转角度 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/WindowRotationChange", "degree": "ScreenRotateDegree_90", "tag": "", "id": "F-001"}
```

### IMEVisibilityChange — 输入法可见性变化
当软键盘（输入法）显示或隐藏时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isShown | bool | true=键盘显示时触发，false=键盘隐藏时触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/IMEVisibilityChange", "isShown": true, "tag": "", "id": "F-001"}
```

### BackNavStart — 返回导航开始
当系统返回手势/按键开始时触发（返回动画开始前）。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/BackNavStart", "tag": "", "id": "F-001"}
```

### BackNavDone — 返回导航完成
当系统返回手势/按键完成后触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| triggerBack | bool | 是否实际触发了返回操作 |
| backType | bool | 返回类型 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/BackNavDone", "triggerBack": true, "backType": false, "tag": "", "id": "F-001"}
```

---

## 连接状态

### WifiStatusChanged — WiFi 状态变化
当 WiFi 开关状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=WiFi 开启时触发，Off=WiFi 关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/WifiStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### WifiConnectedTo — 连接到指定 WiFi
当设备连接到指定 SSID 的 WiFi 网络时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ssidList | repeated string | WiFi 名称（SSID）列表，`*` 表示匹配任意 WiFi |

**上下文变量：** `{ssid}`, `{isWifiEnabled}`, `{wifiStatusLabel}`

**Proto：**
```json
{"@type": "type.googleapis.com/WifiConnectedTo", "ssidList": ["MyHomeWifi"], "tag": "", "id": "F-001"}
```

### WifiDisconnectedFrom — 从指定 WiFi 断开
当设备从指定 SSID 的 WiFi 网络断开时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ssidList | repeated string | WiFi 名称（SSID）列表，`*` 表示匹配任意 WiFi |

**上下文变量：** `{ssid}`, `{isWifiEnabled}`, `{wifiStatusLabel}`

**Proto：**
```json
{"@type": "type.googleapis.com/WifiDisconnectedFrom", "ssidList": ["MyHomeWifi"], "tag": "", "id": "F-001"}
```

### ConnectedWifiSignalLevelChanged — 已连接 WiFi 信号强度变化
当已连接的 WiFi 信号强度等级发生变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| level | int32 | 信号等级阈值 |
| rssi | int32 | RSSI 值阈值 |

**上下文变量：** `{ssid}`, `{rssi}`, `{level}`, `{statusLabel}`

**Proto：**
```json
{"@type": "type.googleapis.com/ConnectedWifiSignalLevelChanged", "level": 0, "rssi": 0, "tag": "", "id": "F-001"}
```

### BTStatusChanged — 蓝牙状态变化
当蓝牙开关状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=蓝牙开启时触发，Off=蓝牙关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/BTStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### BTConnectedTo — 连接到指定蓝牙设备
当设备连接到指定蓝牙设备时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| device | repeated string | 蓝牙设备别名列表，`*` 表示匹配任意设备 |

**上下文变量：** `{btDeviceAlias}`, `{btDeviceAddress}`, `{btDeviceBatteryLevel}`

**Proto：**
```json
{"@type": "type.googleapis.com/BTConnectedTo", "device": ["My Headphones"], "tag": "", "id": "F-001"}
```

### BTDisconnectedFrom — 从指定蓝牙设备断开
当设备从指定蓝牙设备断开时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| device | repeated string | 蓝牙设备别名列表，`*` 表示匹配任意设备 |

**上下文变量：** `{btDeviceAlias}`, `{btDeviceAddress}`

**Proto：**
```json
{"@type": "type.googleapis.com/BTDisconnectedFrom", "device": ["My Headphones"], "tag": "", "id": "F-001"}
```

### MobileDataStatusChanged — 移动数据状态变化
当移动数据开关状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=开启时触发，Off=关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/MobileDataStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### NFCStatusChanged — NFC 状态变化
当 NFC 开关状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=开启时触发，Off=关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/NFCStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### FlashLightStatusChanged — 闪光灯（手电筒）状态变化
当手电筒开关状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=开启时触发，Off=关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/FlashLightStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### LocationStatusChanged — 定位状态变化
当定位服务开关状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=开启时触发，Off=关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/LocationStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### HotSpotStatusChanged — 热点状态变化
当 WiFi 热点开关状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=开启时触发，Off=关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/HotSpotStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### DarkModeStatusChanged — 深色模式状态变化
当系统深色模式开关状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=开启时触发，Off=关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/DarkModeStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### DNDStatusChanged — 免打扰状态变化
当系统免打扰（Do Not Disturb）模式状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=开启时触发，Off=关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/DNDStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### APMStatusChanged — 飞行模式状态变化
当飞行模式开关状态变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ooa | OnOffAny | On=开启时触发，Off=关闭时触发，Any=任意变化触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/APMStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### VPNConnected — VPN 已连接
当 VPN 连接建立时触发。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/VPNConnected", "tag": "", "id": "F-001"}
```

### VPNDisconnected — VPN 已断开
当 VPN 连接断开时触发。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/VPNDisconnected", "tag": "", "id": "F-001"}
```

### CallStateChanged — 通话状态变化
当电话通话状态发生变化时触发（来电、接通、挂断）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| callState | CallState | 目标通话状态 |
| incomingNumber | string | 过滤来电号码（空字符串=不过滤） |

**CallState 枚举：**
| 值 | 说明 |
|------|------|
| CallStateIdle (0) | 空闲（通话结束） |
| CallStateRinging (1) | 响铃（来电中） |
| CallStateOffHook (2) | 通话中（已接听） |

**上下文变量：** `{callState}`, `{incomingNumber}`

**Proto：**
```json
{"@type": "type.googleapis.com/CallStateChanged", "callState": "CallStateRinging", "incomingNumber": "", "tag": "", "id": "F-001"}
```

### NFCTagDiscover — NFC 标签发现
当设备扫描到 NFC 标签时触发。可通过 UID 过滤特定标签。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| uid | bytes | NFC 标签的 UID（为空则匹配所有标签） |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/NFCTagDiscover", "uid": "", "tag": "", "id": "F-001"}
```

---

## 电源与充电

### BatteryLevelChanged — 电量变化
当电池电量发生变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| level | int32 | 电量百分比阈值。0=任意变化均触发，具体值=仅在电量达到该值时触发 |

**上下文变量：** `{batteryLevel}`

**Proto：**
```json
{"@type": "type.googleapis.com/BatteryLevelChanged", "level": 20, "tag": "", "id": "F-001"}
```

### BatteryTemperatureChanged — 电池温度变化
当电池温度发生变化时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| temp | float | 温度阈值（摄氏度）。0=任意变化均触发，具体值=仅在温度达到该值时触发 |

**上下文变量：** `{batteryTemperature}`

**Proto：**
```json
{"@type": "type.googleapis.com/BatteryTemperatureChanged", "temp": 40.0, "tag": "", "id": "F-001"}
```

### ChargerPlug — 充电器插入
当充电器连接到设备时触发。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/ChargerPlug", "tag": "", "id": "F-001"}
```

### ChargerUnplug — 充电器拔出
当充电器从设备断开时触发。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/ChargerUnplug", "tag": "", "id": "F-001"}
```

---

## 剪贴板

### ClipboardContentChanged — 剪贴板变化
当系统剪贴板内容发生变化时触发。可通过正则过滤内容。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| content | string | 匹配剪贴板内容的正则表达式（为空则匹配所有内容） |
| matchOptions | RegexMatchOptions | 正则匹配方式 |

**上下文变量：** `{clipboardContent}`

**Proto：**
```json
{"@type": "type.googleapis.com/ClipboardContentChanged", "content": "", "matchOptions": "RegexMatchOptions_Match", "tag": "", "id": "F-001"}
```

---

## 手势

### EdgeGesture — 边缘手势
当用户在屏幕边缘区域执行指定手势时触发。支持多步手势序列。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| edge | Edge | 手势检测的屏幕边缘位置 |
| gesture | Gesture | 手势类型（单步手势，向后兼容字段） |
| isIntercept | bool | 是否拦截手势事件（不传递给系统） |
| apps | repeated AppPkg | 仅在这些应用前台时有效 |
| pkgSets | repeated string | 仅在这些应用集合前台时有效 |
| customRect | Rect | 自定义检测矩形区域（设置后覆盖 edge 默认区域） |
| downX | int32 | 按下坐标 X（用于区域计算） |
| downY | int32 | 按下坐标 Y（用于区域计算） |
| isTriggerCustom | bool | 内部字段，匹配器使用 |
| enableGestureHint | optional bool | 是否显示手势提示动画 |
| childSteps | repeated EdgeGestureStep | 多步手势序列 |
| enableGestureHaptic | optional bool | 是否启用手势触觉反馈 |
| useAbsoluteArea | optional bool | 是否使用绝对坐标区域 |
| disableWhenIME | optional bool | 输入法显示时是否禁用此手势 |

**Edge 枚举 — 屏幕边缘位置：**
| 值 | 说明 |
|------|------|
| LeftTop (0) | 左侧上部 |
| LeftCenter (1) | 左侧中部 |
| LeftBottom (2) | 左侧下部 |
| LeftAll (3) | 左侧全部 |
| RightTop (4) | 右侧上部 |
| RightCenter (5) | 右侧中部 |
| RightBottom (6) | 右侧下部 |
| RightAll (7) | 右侧全部 |
| TopLeft (8) | 顶部左侧 |
| TopCenter (9) | 顶部中间 |
| TopRight (10) | 顶部右侧 |
| TopAll (11) | 顶部全部 |
| BottomLeft (12) | 底部左侧 |
| BottomCenter (13) | 底部中间 |
| BottomRight (14) | 底部右侧 |
| BottomAll (15) | 底部全部 |

**Gesture 枚举 — 手势类型：**
| 值 | 说明 |
|------|------|
| DoubleTap (0) | 双击 |
| LongTap (1) | 长按 |
| SingleTap (2) | 单击 |
| SwipeFromBottom (3) | 从底部滑动 |
| SwipeFromRight (4) | 从右侧滑动 |
| SwipeFromLeft (5) | 从左侧滑动 |
| SwipeFromTop (6) | 从顶部滑动 |

**EdgeGestureStep 子消息** — 多步手势中的单步：
| 字段 | 类型 | 说明 |
|------|------|------|
| type | EdgeGestureStepType | 步骤类型 |

**EdgeGestureStepType 枚举：**
| 值 | 说明 |
|------|------|
| SwipeLeft (0) | 向左滑动 |
| SwipeRight (1) | 向右滑动 |
| SwipeUp (2) | 向上滑动 |
| SwipeDown (3) | 向下滑动 |
| Hover (4) | 悬停 |
| SingleTapStep (5) | 单击 |
| DoubleTapStep (6) | 双击 |
| LongTapStep (7) | 长按 |

**上下文变量：** `{eventX}`, `{eventY}`

**Proto：**
```json
{"@type": "type.googleapis.com/EdgeGesture", "edge": "LeftCenter", "gesture": "SwipeFromLeft", "isIntercept": true, "apps": [], "pkgSets": [], "childSteps": [{"type": "SwipeRight"}], "enableGestureHint": true, "tag": "", "id": "F-001"}
```

### CornerSwipeToCenter — 角落向中心滑动
当用户从屏幕角落向中心方向滑动时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| corner | ScreenCorner | 触发的屏幕角落 |
| downX | int32 | 角落检测区域的 X 坐标范围 |
| downY | int32 | 角落检测区域的 Y 坐标范围 |
| enableGestureHint | bool | 是否显示手势提示动画 |
| isIntercept | optional bool | 是否拦截手势事件 |
| enableGestureHaptic | bool | 是否启用触觉反馈 |

**ScreenCorner 枚举：**
| 值 | 说明 |
|------|------|
| CornerTopLeft (0) | 左上角 |
| CornerTopRight (1) | 右上角 |
| CornerBottomLeft (2) | 左下角 |
| CornerBottomRight (3) | 右下角 |

**上下文变量：** `{eventX}`, `{eventY}`, `{corner}`

**Proto：**
```json
{"@type": "type.googleapis.com/CornerSwipeToCenter", "corner": "CornerTopLeft", "downX": 100, "downY": 100, "enableGestureHint": true, "enableGestureHaptic": true, "tag": "", "id": "F-001"}
```

### ScreenGesture — 全屏手势
当用户在整个屏幕上执行指定手势时触发。可限制仅在特定应用前台时有效。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| gesture | Gesture | 手势类型（见 EdgeGesture 的 Gesture 枚举） |
| constraintFrontApps | repeated AppPkg | 仅在这些应用前台时有效 |

**上下文变量：** `{eventX}`, `{eventY}`

**Proto：**
```json
{"@type": "type.googleapis.com/ScreenGesture", "gesture": "DoubleTap", "constraintFrontApps": [], "tag": "", "id": "F-001"}
```

### KeyEvent — 简单按键事件
当用户按下指定按键时触发。简单触发，不区分按键手势。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| keyCode | int32 | Android KeyEvent 键码（如 KEYCODE_VOLUME_UP=24） |

**上下文变量：** `{keyCode}`

**Proto：**
```json
{"@type": "type.googleapis.com/KeyEvent", "keyCode": 24, "tag": "", "id": "F-001"}
```

### AdvancedKeyEvent — 高级按键事件
当用户对指定按键执行特定手势（单按、多按、长按）时触发。支持拦截模式。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| keyCode | int32 | Android KeyEvent 键码 |
| gesture | KeyGesture | 按键手势类型 |
| isInterceptMode | bool | 是否拦截按键事件（不传递给系统） |

**KeyGesture 枚举：**
| 值 | 说明 |
|------|------|
| KeyPress (0) | 单次按下 |
| KeyMultiplePress (1) | 连续双按 |
| KeyTriplePress (2) | 连续三按 |
| KeyLongPress (3) | 长按 |

**上下文变量：** `{keyCode}`, `{pressTimes}`

**Proto：**
```json
{"@type": "type.googleapis.com/AdvancedKeyEvent", "keyCode": 24, "gesture": "KeyLongPress", "isInterceptMode": false, "tag": "", "id": "F-001"}
```

### CombineKeyEvent — 组合按键事件
当用户同时按下两个指定按键时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| keyCode1 | int32 | 第一个按键的 Android KeyEvent 键码 |
| keyCode2 | int32 | 第二个按键的 Android KeyEvent 键码 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/CombineKeyEvent", "keyCode1": 24, "keyCode2": 25, "tag": "", "id": "F-001"}
```

---

## 传感器

### LightSensor — 光线传感器
当环境光线强度满足指定条件时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| constraints | repeated ValueConstraints | 数值约束条件列表（如光照强度>10） |
| value | float | 内部发布值 |
| trend | SensorValueTrend | 值变化趋势过滤 |

**上下文变量：** `{lightIntensity}`

**Proto：**
```json
{"@type": "type.googleapis.com/LightSensor", "constraints": [{"op": "GreaterThan", "payload": {"value": "10"}}], "value": 0.0, "trend": "SensorValueTrend_Any", "tag": "", "id": "F-001"}
```

### Sound — 声音传感器
当环境噪声分贝值满足指定条件时触发。需要麦克风权限。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| constraints | repeated ValueConstraints | 数值约束条件列表（如分贝>60） |
| value | float | 内部发布值（分贝） |
| trend | SensorValueTrend | 值变化趋势过滤 |

**上下文变量：** `{decibels}`

**Proto：**
```json
{"@type": "type.googleapis.com/Sound", "constraints": [{"op": "GreaterThan", "payload": {"value": "60"}}], "value": 0.0, "trend": "SensorValueTrend_Any", "tag": "", "id": "F-001"}
```

### ShakeDevice — 摇晃设备
当用户摇晃设备时触发。

**参数：** 无特有参数。

**上下文变量：** 无。

**Proto：**
```json
{"@type": "type.googleapis.com/ShakeDevice", "tag": "", "id": "F-001"}
```

### ScreenRotate — 屏幕旋转
当屏幕物理旋转方向发生变化时触发（基于传感器）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| degree | ScreenRotateDegree | 目标旋转角度（见 WindowRotationChange 中的枚举定义） |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/ScreenRotate", "degree": "ScreenRotateDegree_90", "tag": "", "id": "F-001"}
```

### HeadsetPlug — 耳机插拔
当有线耳机插入或拔出时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isPlug | bool | true=耳机插入时触发，false=耳机拔出时触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/HeadsetPlug", "isPlug": true, "tag": "", "id": "F-001"}
```

### ProximitySensor — 距离传感器
当距离传感器数值满足指定条件时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| constraints | repeated ValueConstraints | 数值约束条件列表 |
| value | float | 内部发布值 |
| trend | SensorValueTrend | 值变化趋势过滤 |

**上下文变量：** `{distance}`, `{maximumRange}`

**Proto：**
```json
{"@type": "type.googleapis.com/ProximitySensor", "constraints": [{"op": "LessThan", "payload": {"value": "5"}}], "value": 0.0, "trend": "SensorValueTrend_Any", "tag": "", "id": "F-001"}
```

### ProximitySensorStateChanged — 距离传感器状态变化
当距离传感器的接近/远离状态发生变化时触发。相比 ProximitySensor 更简单，只关注接近/远离状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| state | ProximitySensorState | 目标传感器状态 |

**ProximitySensorState 枚举：**
| 值 | 说明 |
|------|------|
| ProximitySensorState_Approaching (0) | 物体接近 |
| ProximitySensorState_Departing (2) | 物体远离 |
| ProximitySensorState_Any (3) | 任意状态变化 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/ProximitySensorStateChanged", "state": "ProximitySensorState_Approaching", "tag": "", "id": "F-001"}
```

### AccelerometerSensor — 加速度传感器
当加速度传感器的 X/Y/Z 轴数值满足指定条件时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| constraintsX | repeated ValueConstraints | X 轴数值约束条件 |
| constraintsY | repeated ValueConstraints | Y 轴数值约束条件 |
| constraintsZ | repeated ValueConstraints | Z 轴数值约束条件 |
| valueX | float | 内部发布值 X |
| valueY | float | 内部发布值 Y |
| valueZ | float | 内部发布值 Z |
| trendX | SensorValueTrend | X 轴变化趋势 |
| trendY | SensorValueTrend | Y 轴变化趋势 |
| trendZ | SensorValueTrend | Z 轴变化趋势 |

**上下文变量：** `{accX}`, `{accY}`, `{accZ}`

**Proto：**
```json
{"@type": "type.googleapis.com/AccelerometerSensor", "constraintsX": [{"op": "GreaterThan", "payload": {"value": "5"}}], "constraintsY": [], "constraintsZ": [], "trendX": "SensorValueTrend_Any", "trendY": "SensorValueTrend_Any", "trendZ": "SensorValueTrend_Any", "tag": "", "id": "F-001"}
```

---

## 时间与调度

### Alarm — 定时触发
在指定时间点触发。支持重复日和工作日过滤。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| triggerAt | TimeOfADay | 触发时间点（时:分:秒） |
| repeat | RepeatDays | 重复日设置（哪些星期几重复） |
| workdayFilter | WorkdayFilter | 工作日/节假日过滤 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/Alarm", "triggerAt": {"hour": 8, "minutes": 30, "seconds": 0}, "repeat": {"days": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]}, "workdayFilter": {"dayType": "AnyDay"}, "tag": "", "id": "F-001"}
```

### RandomInPeriod — 时间段内随机触发
在指定时间段内随机选择一个时间点触发。适用于需要随机性的场景。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| start | TimeOfADay | 时间段开始 |
| end | TimeOfADay | 时间段结束 |
| repeat | RepeatDays | 重复日设置 |
| workdayFilter | WorkdayFilter | 工作日/节假日过滤 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/RandomInPeriod", "start": {"hour": 9, "minutes": 0}, "end": {"hour": 18, "minutes": 0}, "repeat": {"days": ["MONDAY", "FRIDAY"]}, "workdayFilter": {"dayType": "WorkdayOnly"}, "tag": "", "id": "F-001"}
```

### FixedInPeriod — 时间段内固定触发
在指定时间段内按固定次数或固定间隔重复触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| start | TimeOfADay | 时间段开始 |
| end | TimeOfADay | 时间段结束 |
| repeat | RepeatDays | 重复日设置 |
| fixedBy | google.protobuf.Any | 固定方式，可为 FixedByTimes 或 FixedByInterval |
| workdayFilter | WorkdayFilter | 工作日/节假日过滤 |

**fixedBy 子消息：**

FixedByTimes — 按次数均匀分布：
| 字段 | 类型 | 说明 |
|------|------|------|
| times | int32 | 在时间段内触发的总次数 |

FixedByInterval — 按固定间隔：
| 字段 | 类型 | 说明 |
|------|------|------|
| interval | int64 | 触发间隔（毫秒） |

**上下文变量：** 无特有上下文变量。

**Proto（按次数）：**
```json
{"@type": "type.googleapis.com/FixedInPeriod", "start": {"hour": 9, "minutes": 0}, "end": {"hour": 18, "minutes": 0}, "fixedBy": {"@type": "type.googleapis.com/FixedByTimes", "times": 5}, "repeat": {}, "workdayFilter": {"dayType": "AnyDay"}, "tag": "", "id": "F-001"}
```

**Proto（按间隔）：**
```json
{"@type": "type.googleapis.com/FixedInPeriod", "start": {"hour": 9, "minutes": 0}, "end": {"hour": 18, "minutes": 0}, "fixedBy": {"@type": "type.googleapis.com/FixedByInterval", "interval": 3600000}, "repeat": {}, "workdayFilter": {"dayType": "AnyDay"}, "tag": "", "id": "F-001"}
```

### SunRiseSet — 日出日落
在日出或日落时触发。基于设备位置计算日出日落时间。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| rise | SunRise | 日出或日落 |

**SunRise 枚举：**
| 值 | 说明 |
|------|------|
| SunRise_Rise (0) | 日出时触发 |
| SunRise_Set (1) | 日落时触发 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/SunRiseSet", "rise": "SunRise_Rise", "tag": "", "id": "F-001"}
```

---

## 广播与自定义事件

### Broadcast — 广播事件
当系统或应用发送匹配的广播 Intent 时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| actions | repeated string | 监听的广播 Action 列表 |
| dataSchema | string | 广播 data scheme 过滤（如 `package`） |

**上下文变量：** `{intent}`（Android Intent 对象，可通过 MVEL 访问，如 `intent.action`, `intent.getStringExtra("key")`）

**Proto：**
```json
{"@type": "type.googleapis.com/Broadcast", "actions": ["android.intent.action.AIRPLANE_MODE"], "dataSchema": "", "tag": "", "id": "F-001"}
```

### DeepLinkCall — Deep Link 调用
当通过 ShortX Deep Link 调用指定标签时触发。用于与外部应用交互。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| deepLinkTag | string | Deep Link 标签名称 |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/DeepLinkCall", "deepLinkTag": "my-action", "tag": "", "id": "F-001"}
```

### IncomingShare — 收到分享内容
当用户通过系统分享功能将内容分享到 ShortX 时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| mimeType | string | 限定 MIME 类型过滤（如 `text/plain`，空字符串=不过滤） |
| sourceAppPkg | string | 限定来源应用包名（空字符串=不过滤） |

**上下文变量：** `{sharedText}`, `{sharedUri}`, `{sharedMimeType}`, `{sourceAppPkg}`

**Proto：**
```json
{"@type": "type.googleapis.com/IncomingShare", "mimeType": "text/plain", "sourceAppPkg": "", "tag": "", "id": "F-001"}
```

### BrowserIntercept — 浏览器拦截
当有应用尝试打开 URL（浏览器意图）时拦截触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| openUrlAfterTrigger | bool | 触发后是否继续在浏览器中打开该 URL |
| openUrlBrowserPkg | string | 指定使用哪个浏览器应用打开（配合 openUrlAfterTrigger 使用） |

**上下文变量：** `{url}`, `{host}`, `{scheme}`, `{path}`, `{query}`, `{sourceAppPkg}`

**Proto：**
```json
{"@type": "type.googleapis.com/BrowserIntercept", "openUrlAfterTrigger": false, "openUrlBrowserPkg": "", "tag": "", "id": "F-001"}
```

### OnWebSocket — WebSocket 连接
当指定 WebSocket URL 接收到消息时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| url | string | WebSocket 服务器 URL（如 `ws://example.com/ws`） |

**上下文变量：** 无特有上下文变量（WebSocket 事件数据通过 WebSocket 动作的上下文变量 `{wsMessage}`, `{wsEvent}`, `{wsReason}` 获取）。

**Proto：**
```json
{"@type": "type.googleapis.com/OnWebSocket", "url": "ws://example.com/ws", "tag": "", "id": "F-001"}
```

---

## 硬件设备

### UsbDeviceAttached — USB 设备连接
当 USB 设备连接到手机时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| deviceName | string | USB 设备名称过滤（正则） |
| deviceNameRegexMatchOptions | RegexMatchOptions | 正则匹配方式 |

**上下文变量：** `{productName}`, `{manufacturerName}`

**Proto：**
```json
{"@type": "type.googleapis.com/UsbDeviceAttached", "deviceName": "", "deviceNameRegexMatchOptions": "RegexMatchOptions_Match", "tag": "", "id": "F-001"}
```

### UsbDeviceDetached — USB 设备断开
当 USB 设备从手机断开时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| deviceName | string | USB 设备名称过滤（正则） |
| deviceNameRegexMatchOptions | RegexMatchOptions | 正则匹配方式 |

**上下文变量：** `{productName}`, `{manufacturerName}`

**Proto：**
```json
{"@type": "type.googleapis.com/UsbDeviceDetached", "deviceName": "", "deviceNameRegexMatchOptions": "RegexMatchOptions_Match", "tag": "", "id": "F-001"}
```

---

## 媒体

### MediaStoreInsert — 媒体文件新增
当系统媒体库中新增文件时触发（如拍照、截图、下载等）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| path | string | 内部数据：文件路径 |
| uriString | string | 内部数据：文件 URI |
| filterPath | string | 路径过滤正则表达式（如 `.*screenshot.*`） |
| options | RegexMatchOptions | 正则匹配方式 |

**上下文变量：** `{mediaUri}`, `{mediaFilePath}`

**Proto：**
```json
{"@type": "type.googleapis.com/MediaStoreInsert", "filterPath": ".*screenshot.*", "options": "RegexMatchOptions_ContainsMatchIn", "tag": "", "id": "F-001"}
```

### MediaStoreDelete — 媒体文件删除
当系统媒体库中的文件被删除时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| path | string | 内部数据：文件路径 |
| uriString | string | 内部数据：文件 URI |
| filterPath | string | 路径过滤正则表达式 |
| options | RegexMatchOptions | 正则匹配方式 |

**上下文变量：** `{mediaUri}`, `{mediaFilePath}`

**Proto：**
```json
{"@type": "type.googleapis.com/MediaStoreDelete", "filterPath": ".*", "options": "RegexMatchOptions_ContainsMatchIn", "tag": "", "id": "F-001"}
```

---

## 应用操作 (App Ops)

### OnStartOp — 应用操作开始
当指定应用开始执行特定系统操作（如使用摄像头、麦克风等）时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| opCodes | repeated int32 | Android AppOpsManager 操作码列表（如 26=CAMERA, 27=RECORD_AUDIO） |
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{opLabel}`, `{opCode}`, `{opAppLabel}`, `{opAppPkgName}`, `{opAppUid}`, `{opAppUserId}`

**Proto：**
```json
{"@type": "type.googleapis.com/OnStartOp", "opCodes": [26], "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### OnFinishOp — 应用操作结束
当指定应用结束特定系统操作时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| opCodes | repeated int32 | Android AppOpsManager 操作码列表 |
| apps | repeated AppPkg | 监控的应用列表 |
| pkgSets | repeated string | 监控的应用集合名称列表 |

**上下文变量：** `{opLabel}`, `{opCode}`, `{opAppLabel}`, `{opAppPkgName}`, `{opAppUid}`, `{opAppUserId}`

**Proto：**
```json
{"@type": "type.googleapis.com/OnFinishOp", "opCodes": [26], "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

---

## 快捷方式与磁贴

### OnQSTileClick — 快速设置磁贴点击
当用户点击 ShortX 注册的快速设置磁贴时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| tileNumber | int32 | 磁贴编号（ShortX 支持多个自定义磁贴） |

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/OnQSTileClick", "tileNumber": 1, "tag": "", "id": "F-001"}
```

### OnStartDynamicShortcut — 动态快捷方式启动
当用户点击 ShortX 创建的动态桌面快捷方式时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| shortcutNumber | int32 | 快捷方式编号 |
| apps | repeated AppPkg | 关联的应用列表 |
| pkgSets | repeated string | 关联的应用集合名称列表 |

**上下文变量：** `{pkgName}`, `{userId}`

**Proto：**
```json
{"@type": "type.googleapis.com/OnStartDynamicShortcut", "shortcutNumber": 1, "apps": [], "pkgSets": [], "tag": "", "id": "F-001"}
```

### OnMenuActionTrigger — 自定义菜单动作
当用户在文本选择上下文菜单中点击 ShortX 自定义菜单项时触发。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| menuNumber | int32 | 菜单项编号 |
| text | string | 菜单项显示文本 |

**上下文变量：** `{selectedText}`

**Proto：**
```json
{"@type": "type.googleapis.com/OnMenuActionTrigger", "menuNumber": 1, "text": "翻译", "tag": "", "id": "F-001"}
```

---

## 方法钩子（需要 Xposed）

### MethodHook — Xposed 方法钩子
当指定应用的指定方法被调用时触发。需要 Xposed 框架支持。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| packageName | string | 目标应用包名 |
| className | string | 目标类的完整类名 |
| methodName | string | 目标方法名 |
| beforeMethod | bool | true=方法执行前触发，false=方法执行后触发 |
| expressions | repeated MethodHookExpressions | MVEL 表达式列表，用于提取方法参数或返回值到上下文变量 |
| lifecycle | MethodHookLifecycle | 钩子的生命周期 |
| constraint | repeated google.protobuf.Any | 方法签名约束（可包含参数数量、参数类型、返回类型约束） |

**MethodHookExpressions 子消息：**
| 字段 | 类型 | 说明 |
|------|------|------|
| expressionMVEL | string | MVEL 表达式（如 `args[0]` 取第一个参数，`result` 取返回值） |
| contextKey | string | 将表达式结果存储到的上下文变量名 |

**MethodHookLifecycle 枚举：**
| 值 | 说明 |
|------|------|
| InitZygote (0) | 在 Zygote 初始化时注入 |
| LoadedPackage (2) | 在应用包加载时注入（常用） |

**方法约束子消息：**

MethodHookConstraintParamsCount — 参数数量约束：
| 字段 | 类型 | 说明 |
|------|------|------|
| count | int32 | 目标方法的参数个数 |

MethodHookConstraintParamsType — 参数类型约束：
| 字段 | 类型 | 说明 |
|------|------|------|
| type | repeated string | 各参数的完整类型名列表 |

MethodHookConstraintReturnType — 返回类型约束：
| 字段 | 类型 | 说明 |
|------|------|------|
| type | string | 方法返回值的完整类型名 |

**上下文变量：** 由 `expressions` 字段的 `contextKey` 定义，用户自行指定变量名。

**Proto：**
```json
{"@type": "type.googleapis.com/MethodHook", "packageName": "com.example.app", "className": "com.example.Class", "methodName": "method", "beforeMethod": false, "expressions": [{"expressionMVEL": "args[0]", "contextKey": "hookArg0"}], "lifecycle": "LoadedPackage", "constraint": [{"@type": "type.googleapis.com/MethodHookConstraintParamsCount", "count": 1}], "tag": "", "id": "F-001"}
```

---

## 通用触发器

### AnyFact — 任意事件触发器
匹配任意触发器类型。主要用于调试或全局捕获。

**参数：** 无特有参数（仅含公共尾部字段）。

**上下文变量：** 无特有上下文变量。

**Proto：**
```json
{"@type": "type.googleapis.com/AnyFact", "tag": "", "id": "F-001"}
```
