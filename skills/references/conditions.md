# 条件 (Condition) 完整参考

条件定义触发后"是否执行"动作。所有条件支持 `isInvert`（取反）和 `isDisabled`（禁用）公共字段。

## 应用状态

### CurrentPkgList — 当前前台应用
```json
{"@type": "type.googleapis.com/CurrentPkgList", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### CurrentActivity — 当前 Activity
```json
{"@type": "type.googleapis.com/CurrentActivity", "activities": {"pkg": {"pkgName": "com.example.app"}, "className": "com.example.MainActivity"}, "op": "ALL", "id": "C-001"}
```

### AppIsRunning — 应用是否运行
```json
{"@type": "type.googleapis.com/AppIsRunning", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppIsNotRunning — 应用是否未运行
```json
{"@type": "type.googleapis.com/AppIsNotRunning", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppHasTask — 应用有最近任务
```json
{"@type": "type.googleapis.com/AppHasTask", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppHasWindowFocus — 应用有窗口焦点
```json
{"@type": "type.googleapis.com/AppHasWindowFocus", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppHasAudioFocus — 应用有音频焦点
```json
{"@type": "type.googleapis.com/AppHasAudioFocus", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppHasNotification — 应用有通知
```json
{"@type": "type.googleapis.com/AppHasNotification", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

## 系统状态

### ScreenIsOn — 屏幕是否亮着
```json
{"@type": "type.googleapis.com/ScreenIsOn", "id": "C-001"}
```

### VPNIsConnected — VPN 是否连接
```json
{"@type": "type.googleapis.com/VPNIsConnected", "id": "C-001"}
```

### ChargeState — 是否正在充电
```json
{"@type": "type.googleapis.com/ChargeState", "id": "C-001"}
```

### PlugState — 电源类型
```json
{"@type": "type.googleapis.com/PlugState", "plugType": "USB", "id": "C-001"}
```
plugType：USB/AC/Wireless/NotPlugged/Charging

### BatteryPercent — 电量百分比
```json
{"@type": "type.googleapis.com/BatteryPercent", "value": 20, "op": "IntLessThan", "id": "C-001"}
```
op：IntGreaterThan/IntGreaterThanOrEqual/IntLessThan/IntLessThanOrEqual/IntEqualTo

### AvailableMemory — 可用内存
```json
{"@type": "type.googleapis.com/AvailableMemory", "valueMb": 500, "op": "IntLessThan", "id": "C-001"}
```

### KeyguardIsLocked — 锁屏是否锁定
```json
{"@type": "type.googleapis.com/KeyguardIsLocked", "id": "C-001"}
```

### IsInCall — 是否在通话中
```json
{"@type": "type.googleapis.com/IsInCall", "id": "C-001"}
```

### IsRinging — 是否正在响铃
```json
{"@type": "type.googleapis.com/IsRinging", "id": "C-001"}
```

### RequireAPMMode — 飞行模式
```json
{"@type": "type.googleapis.com/RequireAPMMode", "isAPMEnable": true, "id": "C-001"}
```

### RequireRingerMode — 铃声模式
```json
{"@type": "type.googleapis.com/RequireRingerMode", "mode": "silent", "id": "C-001"}
```
mode：silent/vibrate/normal

### True — 永远为真
```json
{"@type": "type.googleapis.com/True", "id": "C-001"}
```

## 变量评估

### EvaluateGlobalVar — 评估全局变量
```json
{"@type": "type.googleapis.com/EvaluateGlobalVar", "op": "EqualTo", "varName": "变量名", "payload": {"value": "期望值"}, "id": "C-001"}
```
op 可选值：GreaterThan/GreaterThanOrEqual/LessThan/LessThanOrEqual/EqualTo/NotEqualTo/Contains/NotContains/StartsWith/EndsWith/IsEmpty/IsNotEmpty/IsSet

### EvaluateContextVar — 评估上下文变量
```json
{"@type": "type.googleapis.com/EvaluateContextVar", "op": "Contains", "varName": "title", "payload": {"value": "验证码"}, "id": "C-001"}
```

### RequireFactTag — 判断触发器标签
```json
{"@type": "type.googleapis.com/RequireFactTag", "tag": "标签值", "id": "C-001"}
```

## 连接条件

### RequireWifiConnected — WiFi 已连接
```json
{"@type": "type.googleapis.com/RequireWifiConnected", "requiredSSID": "*", "id": "C-001"}
```
参数：`requiredSSID`（`*` 表示任意WiFi）

### RequireWifiDisconnected — WiFi 已断开
```json
{"@type": "type.googleapis.com/RequireWifiDisconnected", "id": "C-001"}
```

### RequireBTConnected — 蓝牙已连接
```json
{"@type": "type.googleapis.com/RequireBTConnected", "device": "*", "id": "C-001"}
```

### RequireBTDisconnected — 蓝牙已断开
```json
{"@type": "type.googleapis.com/RequireBTDisconnected", "id": "C-001"}
```

### RequireBTDeviceFound — BLE 设备在范围内
```json
{"@type": "type.googleapis.com/RequireBTDeviceFound", "device": "设备名", "timeout": 5000, "id": "C-001"}
```

### ConnectedWifiSignal — WiFi 信号强度
```json
{"@type": "type.googleapis.com/ConnectedWifiSignal", "level": 2, "op": "IntLessThan", "id": "C-001"}
```

## 时间条件

### TimeInRange — 时间范围
```json
{"@type": "type.googleapis.com/TimeInRange", "range": {"start": {"hour": 22, "minutes": 0}, "end": {"hour": 7, "minutes": 0}}, "id": "C-001"}
```

### CalendarDayMatch — 日历类型
```json
{"@type": "type.googleapis.com/CalendarDayMatch", "dayType": "WorkdayOnly", "id": "C-001"}
```
dayType：AnyDay/WorkdayOnly/HolidayOnly/WeekendOnly/TransferWorkdayOnly

### RequireDelay — 延迟条件
```json
{"@type": "type.googleapis.com/RequireDelay", "timeString": "5", "useAlarm": false, "timeUnit": "TimeUnit_S", "id": "C-001"}
```
timeUnit：TimeUnit_MS/TimeUnit_S/TimeUnit_M/TimeUnit_H/TimeUnit_D

### TheXXTimeToday — 第 N 次触发
```json
{"@type": "type.googleapis.com/TheXXTimeToday", "what": "事件标识", "time": 3, "op": "IntEqualTo", "scope": "Today", "id": "C-001"}
```
scope：Today/ThisWeek/ThisMonth

## 屏幕与显示

### HasNodeOnScreen — 屏幕上有指定节点
```json
{"@type": "type.googleapis.com/HasNodeOnScreen", "packageName": "com.example.app", "componentName": "", "matchers": [], "detectTimeout": 3000, "id": "C-001"}
```

### TextFromScreenNodeMatches — 屏幕节点文本匹配
```json
{"@type": "type.googleapis.com/TextFromScreenNodeMatches", "nodeId": "", "regex": "pattern", "matchOptions": "RegexMatchOptions_Match", "id": "C-001"}
```

### HasFoundPointsByColor — 按颜色查找像素
```json
{"@type": "type.googleapis.com/HasFoundPointsByColor", "config": {"color": -65536, "threshold": 10}, "id": "C-001"}
```

## 代码条件

### MatchMVEL — MVEL 表达式
```json
{"@type": "type.googleapis.com/MatchMVEL", "expression": "{batteryLevel} > 50", "id": "C-001"}
```

### MatchJS — JavaScript 表达式
```json
{"@type": "type.googleapis.com/MatchJS", "expression": "parseInt('{batteryLevel}') > 50 ? 'true' : 'false'", "id": "C-001"}
```

## 其他

### ServiceIsRunning — 服务是否运行
```json
{"@type": "type.googleapis.com/ServiceIsRunning", "services": {"pkg": {"pkgName": "com.example.app"}, "className": "com.example.MyService"}, "op": "ALL", "id": "C-001"}
```

### IsRuleEnabled — 自动指令是否启用
```json
{"@type": "type.googleapis.com/IsRuleEnabled", "isEnabled": true, "ruleId": "RULE-xxx", "id": "C-001"}
```

### IsHeadsetPlug — 耳机是否插入
```json
{"@type": "type.googleapis.com/IsHeadsetPlug", "isPlug": true, "id": "C-001"}
```

### RequireScreenRotate — 屏幕旋转状态
```json
{"@type": "type.googleapis.com/RequireScreenRotate", "degree": "ScreenRotateDegree_0", "id": "C-001"}
```

### RequireIMEVisibility — 输入法可见性
```json
{"@type": "type.googleapis.com/RequireIMEVisibility", "isShown": true, "id": "C-001"}
```

### RequireTileState — 磁贴状态
```json
{"@type": "type.googleapis.com/RequireTileState", "state": "QSTileState_Active", "tileSpec": "Tile1", "id": "C-001"}
```
state：QSTileState_Active/QSTileState_InActive/QSTileState_Unavailable

### RequireNotificationPanelExpanded — 通知面板展开
```json
{"@type": "type.googleapis.com/RequireNotificationPanelExpanded", "isExpand": true, "id": "C-001"}
```
