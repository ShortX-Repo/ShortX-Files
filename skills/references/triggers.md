# 触发器 (Fact) 完整参考

触发器定义"什么时候"触发自动指令。所有触发器都有公共字段：`tag`（标签，用于 `RequireFactTag` 判断）、`customContextDataKey`、`id`、`isDisabled`、`note`。

## 应用生命周期

### AppBecomeFg — 应用进入前台
```json
{"@type": "type.googleapis.com/AppBecomeFg", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```
上下文变量：`{pkgName}`、`{userId}`、`{appLabel}`
参数：`apps`（应用包名列表）、`pkgSets`（应用集合名称列表）

### AppBecomeBg — 应用进入后台
```json
{"@type": "type.googleapis.com/AppBecomeBg", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```
上下文变量：`{pkgName}`、`{appLabel}`

### ActivityStarted — Activity 启动
```json
{"@type": "type.googleapis.com/ActivityStarted", "components": {"pkg": {"pkgName": "com.example.app"}, "className": "com.example.MainActivity"}, "tag": "", "id": "F-001"}
```
上下文变量：`{pkgName}`、`{activityName}`、`{appLabel}`、`{componentName}`

### TaskRemoved — 任务被移除（划卡）
```json
{"@type": "type.googleapis.com/TaskRemoved", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```
上下文变量：`{pkgName}`、`{appLabel}`、`{taskId}`

### PkgStopRunning — 应用停止运行
```json
{"@type": "type.googleapis.com/PkgStopRunning", "apps": [{"pkgName": "com.example.app"}], "pkgSets": [], "tag": "", "id": "F-001"}
```

### UserPresent — 用户解锁
```json
{"@type": "type.googleapis.com/UserPresent", "tag": "", "id": "F-001"}
```

## 通知

### NotificationPosted — 通知发布
```json
{"@type": "type.googleapis.com/NotificationPosted", "record": {"title": "", "contentText": "", "apps": [{"pkgName": "com.example.app"}]}, "tag": "", "id": "F-001"}
```
上下文变量：`{userId}`、`{pkgName}`、`{title}`、`{contentText}`、`{notificationTag}`
record 过滤字段：`title`、`contentText`、`apps`、`pkgSets`、`notificationChannel`、`ongoing`

### NotificationUpdated — 通知更新
```json
{"@type": "type.googleapis.com/NotificationUpdated", "old": {}, "new": {}, "tag": "", "id": "F-001"}
```
上下文变量：同 NotificationPosted

### NotificationRemoved — 通知移除
```json
{"@type": "type.googleapis.com/NotificationRemoved", "record": {}, "byUser": false, "tag": "", "id": "F-001"}
```
参数：`byUser`（true=用户滑动，false=应用取消）

## 系统状态

### SystemReady — 系统就绪
```json
{"@type": "type.googleapis.com/SystemReady", "tag": "", "id": "F-001"}
```

### ScreenOn — 亮屏
```json
{"@type": "type.googleapis.com/ScreenOn", "tag": "", "id": "F-001"}
```

### ScreenOff — 息屏
```json
{"@type": "type.googleapis.com/ScreenOff", "tag": "", "id": "F-001"}
```

### SystemSettingsChanged — 系统设置变更
```json
{"@type": "type.googleapis.com/SystemSettingsChanged", "urlAndExpectedValueRegex": {}, "matchOptions": "RegexMatchOptions_Match", "tag": "", "id": "F-001"}
```

### Logcat — 日志匹配
```json
{"@type": "type.googleapis.com/Logcat", "regex": "pattern", "regexMatchOptions": "RegexMatchOptions_Match", "tag": "", "id": "F-001"}
```
上下文变量：`{line}`

### GlobalVarChanged — 全局变量变更
```json
{"@type": "type.googleapis.com/GlobalVarChanged", "gvId": "变量ID", "tag": "", "id": "F-001"}
```

## 连接状态

### WifiStatusChanged — WiFi 状态变化
```json
{"@type": "type.googleapis.com/WifiStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```
参数：`ooa`（On/Off/Any）

### WifiConnectedTo — 连接到指定 WiFi
```json
{"@type": "type.googleapis.com/WifiConnectedTo", "ssidList": [], "tag": "", "id": "F-001"}
```
上下文变量：`{ssid}`、`{isWifiEnabled}`、`{wifiStatusLabel}`
参数：`ssidList`（WiFi 名称列表，`*` 表示任意）

### BTStatusChanged — 蓝牙状态变化
```json
{"@type": "type.googleapis.com/BTStatusChanged", "ooa": "On", "tag": "", "id": "F-001"}
```

### BTConnectedTo — 连接到指定蓝牙设备
```json
{"@type": "type.googleapis.com/BTConnectedTo", "device": [], "tag": "", "id": "F-001"}
```
上下文变量：`{btDeviceAlias}`、`{btDeviceAddress}`、`{btDeviceBatteryLevel}`
参数：`device`（设备别名列表，`*` 表示任意）

### VPNConnected / VPNDisconnected
```json
{"@type": "type.googleapis.com/VPNConnected", "tag": "", "id": "F-001"}
{"@type": "type.googleapis.com/VPNDisconnected", "tag": "", "id": "F-001"}
```

### CallStateChanged — 通话状态变化
```json
{"@type": "type.googleapis.com/CallStateChanged", "callState": "CallStateIdle", "incomingNumber": "", "tag": "", "id": "F-001"}
```
上下文变量：`{callState}`（Ringing/OffHook/Idle）、`{incomingNumber}`

## 传感器

### LightSensor — 光线传感器
```json
{"@type": "type.googleapis.com/LightSensor", "constraints": [{"op": "GreaterThan", "payload": {"value": "10"}}], "value": 0.0, "trend": "SensorValueTrend_Any", "tag": "", "id": "F-001"}
```
上下文变量：`{lightIntensity}`

### Sound — 声音传感器
```json
{"@type": "type.googleapis.com/Sound", "constraints": [{"op": "GreaterThan", "payload": {"value": "10"}}], "value": 0.0, "trend": "SensorValueTrend_Any", "tag": "", "id": "F-001"}
```
上下文变量：`{decibels}`

### ShakeDevice — 摇晃设备
```json
{"@type": "type.googleapis.com/ShakeDevice", "tag": "", "id": "F-001"}
```

### ScreenRotate — 屏幕旋转
```json
{"@type": "type.googleapis.com/ScreenRotate", "degree": "ScreenRotateDegree_0", "tag": "", "id": "F-001"}
```
参数：`degree`（ScreenRotateDegree_0/90/180/270）

### HeadsetPlug — 耳机插拔
```json
{"@type": "type.googleapis.com/HeadsetPlug", "isPlug": true, "tag": "", "id": "F-001"}
```

### ProximitySensor — 距离传感器
```json
{"@type": "type.googleapis.com/ProximitySensor", "constraints": [], "trend": "SensorValueTrend_Any", "tag": "", "id": "F-001"}
```

### AccelerometerSensor — 加速度传感器
```json
{"@type": "type.googleapis.com/AccelerometerSensor", "constraints": [], "trend": "SensorValueTrend_Any", "tag": "", "id": "F-001"}
```
上下文变量：`{valueX}`、`{valueY}`、`{valueZ}`

## 手势

### EdgeGesture — 边缘手势
```json
{"@type": "type.googleapis.com/EdgeGesture", "edge": "LeftTop", "gesture": "DoubleTap", "apps": [], "pkgSets": [], "customRect": {}, "childSteps": [], "tag": "", "id": "F-001"}
```
上下文变量：`{eventX}`、`{eventY}`
edge 位置：LeftTop/LeftMiddle/LeftBottom/RightTop/RightMiddle/RightBottom/TopLeft/TopMiddle/TopRight/BottomLeft/BottomMiddle/BottomRight 等16个
gesture 类型：Tap/DoubleTap/LongPress/SwipeLeft/SwipeRight/SwipeUp/SwipeDown

### KeyEvent — 简单按键事件
```json
{"@type": "type.googleapis.com/KeyEvent", "keyCode": 0, "tag": "", "id": "F-001"}
```
上下文变量：`{keyCode}`

### AdvancedKeyEvent — 高级按键事件
```json
{"@type": "type.googleapis.com/AdvancedKeyEvent", "keyCode": 0, "gesture": "KeyPress", "isInterceptMode": false, "tag": "", "id": "F-001"}
```
上下文变量：`{keyCode}`、`{pressTimes}`
gesture：KeyPress/KeyLongPress/KeyMultiplePress/KeyTriplePress

## 时间与调度

### Alarm — 定时触发
```json
{"@type": "type.googleapis.com/Alarm", "triggerAt": {"hour": 8, "minutes": 30}, "repeat": {"days": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]}, "workdayFilter": {"dayType": "WorkdayOnly"}, "tag": "", "id": "F-001"}
```
workdayFilter.dayType：AnyDay/WorkdayOnly/HolidayOnly/WeekendOnly/TransferWorkdayOnly

### RandomInPeriod — 时间段内随机触发
```json
{"@type": "type.googleapis.com/RandomInPeriod", "start": {"hour": 9, "minutes": 0}, "end": {"hour": 10, "minutes": 0}, "repeat": {}, "workdayFilter": {}, "tag": "", "id": "F-001"}
```

### FixedInPeriod — 时间段内固定触发
```json
{"@type": "type.googleapis.com/FixedInPeriod", "start": {"hour": 9, "minutes": 0}, "end": {"hour": 18, "minutes": 0}, "fixedBy": "FixedByTimes", "repeat": {}, "workdayFilter": {}, "tag": "", "id": "F-001"}
```
fixedBy：FixedByTimes（按次数）/ FixedByInterval（按间隔）

### SunRiseSet — 日出日落
```json
{"@type": "type.googleapis.com/SunRiseSet", "rise": "SunRise_Rise", "tag": "", "id": "F-001"}
```
rise：SunRise_Rise（日出）/ SunRise_Set（日落）

## 广播与自定义事件

### Broadcast — 广播事件
```json
{"@type": "type.googleapis.com/Broadcast", "actions": ["android.intent.action.EXAMPLE"], "dataSchema": "", "tag": "", "id": "F-001"}
```
上下文变量：`{intent}`

### DeepLinkCall — Deep Link 调用
```json
{"@type": "type.googleapis.com/DeepLinkCall", "deepLinkTag": "my-tag", "tag": "", "id": "F-001"}
```

### IncomingShare — 收到分享内容
```json
{"@type": "type.googleapis.com/IncomingShare", "mimeType": "", "sourceAppPkg": "", "tag": "", "id": "F-001"}
```
上下文变量：`{sharedText}`、`{sharedUri}`、`{sharedMimeType}`、`{sourceAppPkg}`

### BrowserIntercept — 浏览器拦截
```json
{"@type": "type.googleapis.com/BrowserIntercept", "openUrlAfterTrigger": false, "openUrlBrowserPkg": "", "tag": "", "id": "F-001"}
```
上下文变量：`{url}`、`{host}`、`{scheme}`、`{path}`、`{query}`、`{sourceAppPkg}`

## 电源与充电

### BatteryLevelChanged — 电量变化
```json
{"@type": "type.googleapis.com/BatteryLevelChanged", "level": 0, "tag": "", "id": "F-001"}
```
上下文变量：`{batteryLevel}`
参数：`level`（0=任意变化，具体值=仅在该百分比触发）

### ChargerPlug / ChargerUnplug — 充电器插拔
```json
{"@type": "type.googleapis.com/ChargerPlug", "tag": "", "id": "F-001"}
{"@type": "type.googleapis.com/ChargerUnplug", "tag": "", "id": "F-001"}
```

## 剪贴板

### ClipboardContentChanged — 剪贴板变化
```json
{"@type": "type.googleapis.com/ClipboardContentChanged", "content": "", "matchOptions": "RegexMatchOptions_Match", "tag": "", "id": "F-001"}
```
上下文变量：`{clipboardContent}`

## 方法钩子（需要 Xposed）

### MethodHook — Xposed 方法钩子
```json
{"@type": "type.googleapis.com/MethodHook", "packageName": "com.example.app", "className": "com.example.Class", "methodName": "method", "beforeMethod": false, "expressions": [{"expressionMVEL": "args[0]", "contextKey": "hookArg0"}], "lifecycle": "LoadedPackage", "tag": "", "id": "F-001"}
```
lifecycle：InitZygote / LoadedPackage

## 磁贴点击

### OnQSTileClick — 磁贴点击
```json
{"@type": "type.googleapis.com/OnQSTileClick", "tileSpec": "Tile1", "tag": "", "id": "F-001"}
```
