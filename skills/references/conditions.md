# 条件 (Condition) 完整参考

条件定义触发后"是否执行"动作。条件被打包为 `google.protobuf.Any` 存放在 Rule、RuleQuit、DirectActionQuit 的 `conditions` 列表中，通过 `condOp`（ConditionOperator）控制多个条件之间的组合逻辑。

## 公共字段

所有条件消息都包含以下公共字段，下文各条件不再重复列出：

| 字段 | 类型 | 字段号 | 说明 |
|------|------|--------|------|
| customContextDataKey | CustomContextDataKey | 97 | 自定义上下文数据键（包含 `repeated StringPair keys`） |
| isDisabled | bool | 96 | 是否禁用此条件 |
| isInvert | bool | 98 | 是否取反条件结果（true 变 false，false 变 true） |
| note | string | 99 | 用户备注 |
| id | string | 100 | 条件唯一标识符 |

## 公共枚举与类型

### ConditionOperator — 条件组合运算符
控制多个条件之间的逻辑关系。

| 值 | 说明 |
|-----|------|
| ALL (0) | 所有条件都为真时才为真（AND） |
| ANY (1) | 任一条件为真即为真（OR） |
| NONE (2) | 所有条件都为假时才为真（NOR） |
| MVEL (3) | 使用 MVEL 表达式求值（配合 ConditionOperatorPayload.expression） |

### IntOp — 整数比较运算符

| 值 | 说明 |
|-----|------|
| IntGreaterThan (0) | 大于 |
| IntGreaterThanOrEQ (1) | 大于等于 |
| IntLessThan (2) | 小于 |
| IntLessThanOrEQ (3) | 小于等于 |
| IntEqualTo (4) | 等于 |

### GlobalVarOp — 变量比较运算符

| 值 | 说明 |
|-----|------|
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

### GlobalVarOpPayload

| 字段 | 类型 | 说明 |
|------|------|------|
| value | string | 用于比较的期望值 |

### AppPkg — 应用包名

| 字段 | 类型 | 说明 |
|------|------|------|
| pkgName | string | 包名，如 `com.example.app` |
| userId | int32 | 用户 ID，默认 0（主用户） |

### AppComponent — 应用组件

| 字段 | 类型 | 说明 |
|------|------|------|
| pkg | AppPkg | 应用包信息 |
| className | string | 组件类全名，如 `com.example.MainActivity` |

### ProcessName — 进程名称

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | int32 | 用户 ID |
| processName | string | 进程名 |

### StringPair — 字符串对

| 字段 | 类型 | 说明 |
|------|------|------|
| first | string | 第一个值（通常为包名） |
| second | string | 第二个值（通常为 userId 字符串） |

---

## 应用状态

### CurrentPkgList — 当前前台应用
检查当前前台应用是否在指定列表中。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgs | repeated AppPkg | 要匹配的应用列表 |
| pkgSets | repeated string | 要匹配的应用集合名称列表 |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/CurrentPkgList", "pkgs": [{"pkgName": "com.example.app", "userId": 0}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### CurrentPkgListByPkg — 当前前台应用（按包名对）
通过包名+用户 ID 字符串对检查当前前台应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表（first=包名, second=userId） |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/CurrentPkgListByPkg", "pkgAndUsers": [{"first": "com.example.app", "second": "0"}], "op": "ALL", "id": "C-001"}
```

### CurrentActivity — 当前 Activity
检查当前前台 Activity 是否匹配指定列表。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| activities | repeated AppComponent | 要匹配的 Activity 列表 |
| op | ConditionOperator | 多个匹配项之间的逻辑关系 |

**Proto：**
```json
{"@type": "type.googleapis.com/CurrentActivity", "activities": [{"pkg": {"pkgName": "com.example.app"}, "className": "com.example.MainActivity"}], "op": "ALL", "id": "C-001"}
```

### AppIsRunning — 应用是否运行
检查指定应用是否正在运行。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgs | repeated AppPkg | 要检查的应用列表 |
| pkgSets | repeated string | 要检查的应用集合名称列表 |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/AppIsRunning", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppIsNotRunning — 应用是否未运行
检查指定应用是否未在运行。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgs | repeated AppPkg | 要检查的应用列表 |
| pkgSets | repeated string | 要检查的应用集合名称列表 |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/AppIsNotRunning", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppHasTask — 应用有最近任务
检查指定应用是否在最近任务列表中。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgs | repeated AppPkg | 要检查的应用列表 |
| pkgSets | repeated string | 要检查的应用集合名称列表 |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/AppHasTask", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppHasTaskByPkg — 应用有最近任务（按包名对）
通过包名+用户 ID 字符串对检查应用是否在最近任务列表中。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表（first=包名, second=userId） |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/AppHasTaskByPkg", "pkgAndUsers": [{"first": "com.example.app", "second": "0"}], "op": "ALL", "id": "C-001"}
```

### AppHasWindowFocus — 应用有窗口焦点
检查指定应用是否拥有窗口焦点。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgs | repeated AppPkg | 要检查的应用列表 |
| pkgSets | repeated string | 要检查的应用集合名称列表 |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/AppHasWindowFocus", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppHasAudioFocus — 应用有音频焦点
检查指定应用是否拥有音频焦点。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgs | repeated AppPkg | 要检查的应用列表 |
| pkgSets | repeated string | 要检查的应用集合名称列表 |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/AppHasAudioFocus", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### AppHasNotification — 应用有通知
检查指定应用是否有活跃的通知。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgs | repeated AppPkg | 要检查的应用列表 |
| pkgSets | repeated string | 要检查的应用集合名称列表 |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/AppHasNotification", "pkgs": [{"pkgName": "com.example.app"}], "pkgSets": [], "op": "ALL", "id": "C-001"}
```

### ServiceIsRunning — 服务是否运行
检查指定的 Android 服务是否正在运行。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| services | repeated AppComponent | 要检查的服务组件列表 |
| op | ConditionOperator | 多个匹配项之间的逻辑关系，默认 ALL |

**Proto：**
```json
{"@type": "type.googleapis.com/ServiceIsRunning", "services": [{"pkg": {"pkgName": "com.example.app"}, "className": "com.example.MyService"}], "op": "ALL", "id": "C-001"}
```

### ProcessIsRunning — 进程是否运行
检查指定进程是否正在运行。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| processList | repeated ProcessName | 要检查的进程列表 |

**Proto：**
```json
{"@type": "type.googleapis.com/ProcessIsRunning", "processList": [{"userId": 0, "processName": "com.example.app"}], "id": "C-001"}
```

### IsRuleEnabled — 自动指令是否启用
检查指定的自动指令（Rule）是否处于启用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isEnabled | bool | 期望的启用状态，true 表示要求已启用 |
| ruleId | string | 要检查的 Rule 的唯一 ID |

**Proto：**
```json
{"@type": "type.googleapis.com/IsRuleEnabled", "isEnabled": true, "ruleId": "RULE-xxx", "id": "C-001"}
```

---

## 系统状态

### ScreenIsOn — 屏幕是否亮着
检查设备屏幕是否处于点亮状态。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/ScreenIsOn", "id": "C-001"}
```

### ScreenStayAwake — 屏幕保持唤醒
检查屏幕是否处于常亮（Stay Awake）状态。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/ScreenStayAwake", "id": "C-001"}
```

### ScreenOrientationIsPort — 屏幕方向为竖屏
检查当前屏幕方向是否为竖屏（Portrait）模式。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/ScreenOrientationIsPort", "id": "C-001"}
```

### FlashlightIsOn — 手电筒是否开启
检查设备手电筒是否处于开启状态。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/FlashlightIsOn", "id": "C-001"}
```

### KeyguardIsLocked — 锁屏是否锁定
检查设备锁屏是否处于锁定状态。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/KeyguardIsLocked", "id": "C-001"}
```

### VPNIsConnected — VPN 是否连接
检查设备是否有活跃的 VPN 连接。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/VPNIsConnected", "id": "C-001"}
```

### ChargeState — 是否正在充电
检查设备是否正在充电。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| requireIsCharge | bool | 是否要求正在充电，true 表示要求充电中 |

**Proto：**
```json
{"@type": "type.googleapis.com/ChargeState", "requireIsCharge": true, "id": "C-001"}
```

### PlugState — 电源插入类型
检查设备的电源插入状态和类型。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| requireIsPlug | bool | 是否要求已插入电源 |
| type | PlugType | 电源类型 |

**PlugType 枚举值：**
| 值 | 说明 |
|-----|------|
| PlugType_PlugAny (0) | 任意电源类型 |
| PlugType_PlugUSB (1) | USB 充电 |
| PlugType_PlugAC (2) | 交流电充电 |
| PlugType_PlugWireless (3) | 无线充电 |
| PlugType_NotPlug (4) | 未插入电源 |
| PlugType_IsCharge (5) | 正在充电（不限类型） |

**Proto：**
```json
{"@type": "type.googleapis.com/PlugState", "requireIsPlug": true, "type": "PlugType_PlugUSB", "id": "C-001"}
```

### BatteryPercent — 电量百分比
检查当前电池电量百分比是否满足指定条件。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| value | int32 | 要比较的电量百分比值（0-100） |
| op | IntOp | 比较运算符 |

**Proto：**
```json
{"@type": "type.googleapis.com/BatteryPercent", "value": 20, "op": "IntLessThan", "id": "C-001"}
```

### AvailableMemory — 可用内存
检查当前可用内存（MB）是否满足指定条件。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| valueMb | int32 | 要比较的内存值，单位为 MB |
| op | IntOp | 比较运算符 |

**Proto：**
```json
{"@type": "type.googleapis.com/AvailableMemory", "valueMb": 500, "op": "IntLessThan", "id": "C-001"}
```

### IsInCall — 是否在通话中
检查设备是否正在进行电话通话。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/IsInCall", "id": "C-001"}
```

### IsRinging — 是否正在响铃
检查设备是否正在响铃（来电铃声）。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/IsRinging", "id": "C-001"}
```

### IsHeadsetPlug — 耳机是否插入
检查有线耳机是否已插入设备。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isPlug | bool | 是否要求耳机已插入，true 表示要求已插入 |

**Proto：**
```json
{"@type": "type.googleapis.com/IsHeadsetPlug", "isPlug": true, "id": "C-001"}
```

### RequireAPMMode — 飞行模式
检查设备是否处于飞行模式。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isAPMEnable | bool | 是否要求飞行模式已开启，true 表示要求已开启 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireAPMMode", "isAPMEnable": true, "id": "C-001"}
```

### RequireRingerMode — 铃声模式
检查设备当前的铃声模式。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| mode | RingerMode | 要求的铃声模式 |

**RingerMode 枚举值：**
| 值 | 说明 |
|-----|------|
| silent (0) | 静音 |
| vibrate (1) | 振动 |
| normal (2) | 正常（有声） |
| switchMode (3) | 切换模式 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireRingerMode", "mode": "silent", "id": "C-001"}
```

### RequireSensorOff — 传感器是否关闭
检查设备传感器是否处于关闭状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isRequireOn | bool | 如果为 true，则要求传感器开启；如果为 false，则要求传感器关闭 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireSensorOff", "isRequireOn": false, "id": "C-001"}
```

### RequireMobileDataEnabled — 移动数据是否开启
检查移动数据是否已启用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| slotId | int32 | SIM 卡槽 ID（0 为卡槽1，1 为卡槽2） |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireMobileDataEnabled", "slotId": 0, "id": "C-001"}
```

### RequireScreenRotate — 屏幕旋转状态
检查屏幕当前的旋转角度。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| degree | ScreenRotateDegree | 要求的屏幕旋转角度 |

**ScreenRotateDegree 枚举值：**
| 值 | 说明 |
|-----|------|
| ScreenRotateDegree_0 (0) | 0 度（自然方向） |
| ScreenRotateDegree_90 (1) | 90 度 |
| ScreenRotateDegree_180 (2) | 180 度 |
| ScreenRotateDegree_270 (3) | 270 度 |
| ScreenRotateDegree_Any (4) | 任意角度 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireScreenRotate", "degree": "ScreenRotateDegree_0", "id": "C-001"}
```

### RequireWindowRotation — 窗口旋转状态
检查窗口当前的旋转角度（与 RequireScreenRotate 类似，但检查的是窗口层面的旋转而非屏幕硬件层面）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| degree | ScreenRotateDegree | 要求的窗口旋转角度（枚举值同上） |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireWindowRotation", "degree": "ScreenRotateDegree_90", "id": "C-001"}
```

### RequireIMEVisibility — 输入法可见性
检查软键盘（输入法）是否可见。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isShown | bool | 是否要求输入法可见，true 表示要求可见 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireIMEVisibility", "isShown": true, "id": "C-001"}
```

### RequireTileState — 磁贴状态
检查快捷设置（Quick Settings）磁贴的状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| state | QSTileState | 要求的磁贴状态 |
| tileSpec | string | 磁贴标识符 |

**QSTileState 枚举值：**
| 值 | 说明 |
|-----|------|
| QSTileState_Unavailable (0) | 不可用 |
| QSTileState_InActive (1) | 未激活 |
| QSTileState_Active (2) | 已激活 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireTileState", "state": "QSTileState_Active", "tileSpec": "wifi", "id": "C-001"}
```

### RequireNotificationPanelExpanded — 通知面板展开
检查通知面板（下拉通知栏）是否已展开。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isExpand | bool | 是否要求通知面板已展开，true 表示要求已展开 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireNotificationPanelExpanded", "isExpand": true, "id": "C-001"}
```

---

## 连接条件

### RequireWifiConnected — WiFi 已连接
检查设备是否已连接到 WiFi 网络，可指定 SSID。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| requiredSSID | string | 要求连接的 WiFi 名称，`*` 表示任意 WiFi |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireWifiConnected", "requiredSSID": "*", "id": "C-001"}
```

### RequireWifiDisconnected — WiFi 已断开
检查设备 WiFi 是否处于断开状态。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/RequireWifiDisconnected", "id": "C-001"}
```

### ConnectedWifiSignal — WiFi 信号强度
检查当前连接的 WiFi 信号强度等级。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| level | int32 | 信号等级值（通常 0-4，0 最弱，4 最强） |
| op | IntOp | 比较运算符 |

**Proto：**
```json
{"@type": "type.googleapis.com/ConnectedWifiSignal", "level": 2, "op": "IntLessThan", "id": "C-001"}
```

### RequireBTConnected — 蓝牙已连接
检查设备是否已连接到指定的蓝牙设备。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| device | string | 蓝牙设备名称，`*` 表示任意已连接设备 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireBTConnected", "device": "*", "id": "C-001"}
```

### RequireBTDisconnected — 蓝牙已断开
检查设备蓝牙是否处于断开状态。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/RequireBTDisconnected", "id": "C-001"}
```

### RequireBTDeviceFound — BLE 设备在范围内
检查是否能扫描到指定的蓝牙设备（BLE 扫描）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| device | string | 蓝牙设备名称 |
| address | string | 蓝牙设备 MAC 地址 |
| timeout | string | 扫描超时时间（毫秒），字符串格式 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireBTDeviceFound", "device": "Mi Band", "address": "", "timeout": "5000", "id": "C-001"}
```

---

## 变量评估

### EvaluateGlobalVar — 评估全局变量
评估一个全局变量的值是否满足指定条件。全局变量在所有 Rule 之间共享。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| op | GlobalVarOp | 比较运算符 |
| varName | string | 全局变量名称 |
| payload | GlobalVarOpPayload | 用于比较的期望值 |

**Proto：**
```json
{"@type": "type.googleapis.com/EvaluateGlobalVar", "op": "EqualTo", "varName": "my_var", "payload": {"value": "expected_value"}, "id": "C-001"}
```

### EvaluateLocalVar — 评估局部变量
评估一个局部变量的值是否满足指定条件。局部变量仅在当前 Rule 执行上下文中有效。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| op | GlobalVarOp | 比较运算符 |
| varName | string | 局部变量名称 |
| payload | GlobalVarOpPayload | 用于比较的期望值 |

**Proto：**
```json
{"@type": "type.googleapis.com/EvaluateLocalVar", "op": "Contains", "varName": "local_counter", "payload": {"value": "10"}, "id": "C-001"}
```

### EvaluateContextVar — 评估上下文变量
评估一个上下文变量的值是否满足指定条件。上下文变量由触发器自动设置，包含触发事件的相关信息。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| op | GlobalVarOp | 比较运算符 |
| varName | string | 上下文变量名称（如 `title`、`text`、`pkgName` 等） |
| payload | GlobalVarOpPayload | 用于比较的期望值 |

**Proto：**
```json
{"@type": "type.googleapis.com/EvaluateContextVar", "op": "Contains", "varName": "title", "payload": {"value": "验证码"}, "id": "C-001"}
```

### EvaluateScreenOnTime — 评估屏幕亮屏时长
评估屏幕亮屏的累计时长是否满足指定条件。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| op | GlobalVarOp | 比较运算符 |
| payload | GlobalVarOpPayload | 用于比较的时长值（毫秒，字符串格式） |
| from | ScreenOnTimeStartFrom | 计算起点 |

**ScreenOnTimeStartFrom 枚举值：**
| 值 | 说明 |
|-----|------|
| ScreenOnTimeStartFrom_LastScreenOff (0) | 从上次灭屏开始计算 |
| ScreenOnTimeStartFrom_SystemReady (1) | 从系统启动完成开始计算 |

**Proto：**
```json
{"@type": "type.googleapis.com/EvaluateScreenOnTime", "op": "GreaterThan", "payload": {"value": "3600000"}, "from": "ScreenOnTimeStartFrom_LastScreenOff", "id": "C-001"}
```

### RequireFactTag — 判断触发器标签
检查当前触发事件是否携带指定的标签。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| tag | string | 要匹配的标签值 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireFactTag", "tag": "my_tag", "id": "C-001"}
```

---

## 时间条件

### TimeInRange — 时间范围
检查当前时间是否在指定的时间范围内。支持跨天范围（如 22:00 到次日 7:00）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| range | TimeOfADayRange | 时间范围，包含起止时间 |

**TimeOfADayRange 结构：**
| 字段 | 类型 | 说明 |
|------|------|------|
| start | TimeOfADay | 起始时间 |
| end | TimeOfADay | 结束时间 |

**TimeOfADay 结构：**
| 字段 | 类型 | 说明 |
|------|------|------|
| hour | int32 | 小时（0-23） |
| minutes | int32 | 分钟（0-59） |
| seconds | int32 | 秒（0-59），可省略 |

**Proto：**
```json
{"@type": "type.googleapis.com/TimeInRange", "range": {"start": {"hour": 22, "minutes": 0}, "end": {"hour": 7, "minutes": 0}}, "id": "C-001"}
```

### CalendarDayMatch — 日历类型
检查当前日期是否匹配指定的日历类型（工作日、休息日、节假日等）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| dayType | CalendarDayType | 要匹配的日历日类型 |

**CalendarDayType 枚举值：**
| 值 | 说明 |
|-----|------|
| AnyDay (0) | 任意日（始终匹配） |
| WorkdayOnly (1) | 仅工作日 |
| HolidayOnly (2) | 仅节假日 |
| WeekendOnly (3) | 仅周末 |
| TransferWorkdayOnly (4) | 仅调休工作日 |

**Proto：**
```json
{"@type": "type.googleapis.com/CalendarDayMatch", "dayType": "WorkdayOnly", "id": "C-001"}
```

### RequireDelay — 延迟条件
在条件评估前等待指定的延迟时间。用于确保某个状态持续一段时间后才满足条件。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| timeString | string | 延迟时间值（字符串格式的数字） |
| useAlarm | bool | 是否使用 AlarmManager（更精确，但可能影响省电） |
| timeUnit | TimeUnit | 时间单位 |

**TimeUnit 枚举值：**
| 值 | 说明 |
|-----|------|
| TimeUnit_MS (0) | 毫秒 |
| TimeUnit_S (1) | 秒 |
| TimeUnit_M (2) | 分钟 |
| TimeUnit_H (3) | 小时 |
| TimeUnit_D (4) | 天 |

**Proto：**
```json
{"@type": "type.googleapis.com/RequireDelay", "timeString": "5", "useAlarm": false, "timeUnit": "TimeUnit_S", "id": "C-001"}
```

### TheXXTimeToday — 第 N 次触发
检查某个事件在指定时间范围内是否已触发了 N 次。可用于限制执行频率。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| what | string | 事件标识符（用于区分不同的计数器） |
| time | int32 | 要比较的触发次数 |
| op | IntOp | 比较运算符 |
| scope | TheXXTimeTodayScope | 统计范围 |

**TheXXTimeTodayScope 枚举值：**
| 值 | 说明 |
|-----|------|
| Today (0) | 今天全天 |
| TodayAM (1) | 今天上午 |
| TodayPM (2) | 今天下午 |
| ThisWeek (3) | 本周 |
| ThisMonth (4) | 本月 |

**Proto：**
```json
{"@type": "type.googleapis.com/TheXXTimeToday", "what": "rule_triggered", "time": 3, "op": "IntEqualTo", "scope": "Today", "id": "C-001"}
```

---

## 屏幕与显示

### HasNodeOnScreen — 屏幕上有指定节点
通过无障碍服务检查屏幕上是否存在匹配指定条件的 UI 节点。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| packageName | string | 要搜索节点的应用包名 |
| componentName | string | 要搜索节点的组件名，可为空 |
| matchers | repeated google.protobuf.Any | 节点匹配器列表（NodeMatcherViewId 或 NodeMatcherText） |
| detectTimeout | int64 | 检测超时时间（毫秒） |

**NodeMatcherViewId 结构（打包为 Any）：**
| 字段 | 类型 | 说明 |
|------|------|------|
| viewId | string | 要匹配的 View ID |

**NodeMatcherText 结构（打包为 Any）：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 要匹配的文本内容 |
| matchOptions | RegexMatchOptions | 匹配方式 |

**Proto：**
```json
{"@type": "type.googleapis.com/HasNodeOnScreen", "packageName": "com.example.app", "componentName": "", "matchers": [{"@type": "type.googleapis.com/NodeMatcherText", "text": "确定", "matchOptions": "RegexMatchOptions_Match"}], "detectTimeout": 3000, "id": "C-001"}
```

### TextFromScreenNodeMatches — 屏幕节点文本匹配
检查屏幕上指定节点的文本内容是否匹配正则表达式。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| nodeId | string | 要检查的节点 ID |
| regex | string | 正则表达式模式 |
| matchOptions | RegexMatchOptions | 匹配模式 |

**RegexMatchOptions 枚举值：**
| 值 | 说明 |
|-----|------|
| RegexMatchOptions_Match (0) | 完全匹配（整个文本必须匹配正则） |
| RegexMatchOptions_ContainsMatchIn (1) | 部分匹配（文本中包含匹配正则的子串即可） |

**Proto：**
```json
{"@type": "type.googleapis.com/TextFromScreenNodeMatches", "nodeId": "node_001", "regex": "\\d{6}", "matchOptions": "RegexMatchOptions_ContainsMatchIn", "id": "C-001"}
```

### HasFoundPointsByColor — 按颜色查找像素
检查屏幕截图中是否存在指定颜色的像素点。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| config | FindPointsByColorConfig | 颜色查找配置 |

**FindPointsByColorConfig 结构：**
| 字段 | 类型 | 说明 |
|------|------|------|
| image | google.protobuf.Any | 截图图像（可选，为空时使用当前屏幕） |
| color | int32 | 目标颜色值（ARGB 整数格式，如 -65536 表示红色） |
| threshold | int32 | 颜色匹配容差（0-255，越大越宽松） |
| rect | Rect | 搜索区域（可选，限定搜索范围） |
| output_type | FindPointsByColorOutputType | 输出类型 |

**Proto：**
```json
{"@type": "type.googleapis.com/HasFoundPointsByColor", "config": {"color": -65536, "threshold": 10}, "id": "C-001"}
```

---

## 代码条件

### MatchMVEL — MVEL 表达式
使用 MVEL 脚本语言评估表达式。表达式结果为真（truthy）时条件成立。支持使用 `{varName}` 语法引用变量。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| expression | string | MVEL 表达式 |

**Proto：**
```json
{"@type": "type.googleapis.com/MatchMVEL", "expression": "{batteryLevel} > 50", "id": "C-001"}
```

### MatchJS — JavaScript 表达式
使用 JavaScript 评估表达式。表达式应返回字符串 `"true"` 或 `"false"`。支持使用 `{varName}` 语法引用变量。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| expression | string | JavaScript 表达式 |

**Proto：**
```json
{"@type": "type.googleapis.com/MatchJS", "expression": "parseInt('{batteryLevel}') > 50 ? 'true' : 'false'", "id": "C-001"}
```

---

## 逻辑条件

### True — 永远为真
始终返回 true 的条件。常用于测试或作为默认条件。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/True", "id": "C-001"}
```

### False — 永远为假
始终返回 false 的条件。常用于临时禁用某个分支或测试。

**参数：** 无特有参数。

**Proto：**
```json
{"@type": "type.googleapis.com/False", "id": "C-001"}
```

---

## 插件条件

### PluginCondition — 插件条件
将条件评估委托给指定的插件处理。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pluginId | string | 插件唯一标识符 |
| params | ParamsDataWrapper | 传递给插件的参数数据 |

**Proto：**
```json
{"@type": "type.googleapis.com/PluginCondition", "pluginId": "my_plugin", "params": {}, "id": "C-001"}
```
