# 动作 (Action) 完整参考

动作定义触发且条件满足后"执行什么操作"。动作被打包为 `google.protobuf.Any` 存放在 Rule/DirectAction 的 `actions` 列表中。

## 公共字段

所有动作消息都包含以下公共字段，下文各动作不再重复列出：

| 字段 | 类型 | 说明 |
|------|------|------|
| customContextDataKey | CustomContextDataKey | 自定义上下文数据键映射 |
| actionOnError | ActionOnError | 出错时行为：Continue(0)继续 / Break(1)中断 |
| isDisabled | bool | 是否禁用此动作 |
| note | string | 备注 |
| id | string | 动作唯一标识（如 `A-001`） |

## 公共枚举

### ActionOnError
| 值 | 说明 |
|-----|------|
| Continue (0) | 出错后继续执行后续动作 |
| Break (1) | 出错后中断动作链 |

### ConditionOperator
| 值 | 说明 |
|-----|------|
| ALL (0) | 所有条件为真（AND） |
| ANY (1) | 任一条件为真（OR） |
| NONE (2) | 所有条件为假（NOR） |
| MVEL (3) | MVEL 表达式求值 |

### ActionAsyncMode — 动作内异步模式
| 值 | 说明 |
|-----|------|
| ActionAsyncMode_Sync (0) | 动作按顺序依次执行 |
| ActionAsyncMode_Async (1) | 动作并行执行 |

### TimeUnit
| 值 | 说明 |
|-----|------|
| TimeUnit_MS (0) | 毫秒 |
| TimeUnit_S (1) | 秒 |
| TimeUnit_M (2) | 分钟 |
| TimeUnit_H (3) | 小时 |
| TimeUnit_D (4) | 天 |

### OnOffToggle
| 值 | 说明 |
|-----|------|
| OnOffToggle_On (0) | 开启 |
| OnOffToggle_Off (1) | 关闭 |
| OnOffToggle_Toggle (2) | 切换 |

---

## 公共子消息

### CustomContextDataKey
自定义上下文数据键映射，允许将上下文数据绑定到自定义键名。

| 字段 | 类型 | 说明 |
|------|------|------|
| keys | repeated StringPair | 键值对列表，每个 StringPair 包含 first(键名) 和 second(值) |

### StringPair
通用字符串键值对，广泛用于传递包名+用户ID等二元组。

| 字段 | 类型 | 说明 |
|------|------|------|
| first | string | 第一个值（常为包名 pkgName） |
| second | string | 第二个值（常为用户ID userId） |

### AppPkg
应用包标识，唯一定位一个用户下的应用。

| 字段 | 类型 | 说明 |
|------|------|------|
| pkgName | string | 应用包名 |
| userId | int32 | 用户 ID（多用户/工作空间） |

### AppComponent
应用组件标识，定位到具体的 Activity/Service/Receiver。

| 字段 | 类型 | 说明 |
|------|------|------|
| pkg | AppPkg | 所属应用 |
| className | string | 组件类名 |

### ConditionOperatorPayload
条件操作符附加载荷，当 ConditionOperator 为 MVEL 时使用。

| 字段 | 类型 | 说明 |
|------|------|------|
| expression | string | MVEL 表达式字符串 |

### AndroidIntent
Android Intent 描述。

| 字段 | 类型 | 说明 |
|------|------|------|
| action | string | Intent Action（如 `android.intent.action.VIEW`） |
| flags | int32 | Intent Flags |
| pkgName | string | 目标包名 |
| className | string | 目标类名 |
| data | string | Intent Data URI |
| extras | repeated AndroidIntentExtra | 附加数据列表 |

### AndroidIntentExtra
Intent 附加数据。

| 字段 | 类型 | 说明 |
|------|------|------|
| key | string | 键名 |
| value | string | 值（字符串表示） |
| type | AndroidIntentExtraType | 值类型：Int(0)/Long(1)/String(2)/Bool(3)/Float(4)/Double(5) |

### AndroidIntentComponentType
| 值 | 说明 |
|-----|------|
| AndroidIntentComponentTypeActivity (0) | Activity |
| AndroidIntentComponentTypeBroadcast (1) | 广播接收器 |
| AndroidIntentComponentTypeService (2) | 服务 |

### ProcessName
进程名标识。

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | int32 | 用户 ID |
| processName | string | 进程名 |

### QSTile
快速设置磁贴标识。

| 字段 | 类型 | 说明 |
|------|------|------|
| tileSpec | string | 磁贴规格标识符 |
| label | string | 磁贴显示名称 |

### NotificationButton
通知按钮定义。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 按钮唯一标识 |
| action | repeated Any | 点击按钮时执行的动作列表 |
| label | string | 按钮文本 |
| labelRegexOptions | RegexMatchOptions | 标签正则匹配选项：Match(0)精确匹配 / ContainsMatchIn(1)包含匹配 |

### Notification (子消息，用于匹配通知)
用于 RemoveNotification / ClickNotification 等动作中匹配目标通知。

| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 通知标题（或正则表达式） |
| titleRegexOptions | RegexMatchOptions | 标题正则匹配选项 |
| contentText | string | 通知内容（或正则表达式） |
| contentRegexOptions | RegexMatchOptions | 内容正则匹配选项 |
| apps | repeated AppPkg | 来源应用列表 |
| pkgSets | repeated string | 来源应用集合 |
| notificationId | string | 通知 ID |
| notificationChannel | string | 通知渠道 |
| isFgService | bool | 是否前台服务通知 |
| tag | string | 通知 Tag |
| key | string | 通知 Key |
| ongoing | bool | 是否持续通知 |
| extras | repeated AndroidIntentExtra | 通知附加数据 |

### RemoteRuleContextAndVars
跨进程传递上下文和变量。

| 字段 | 类型 | 说明 |
|------|------|------|
| localVar | repeated LocalVar | 局部变量列表 |
| contextData | repeated StringPair | 上下文数据键值对 |
| funcParameter | repeated FuncParameterInput | 函数参数输入列表 |

---

## 一、流程控制 (Flow Control)

---

### IfThenElse — 条件分支
根据条件列表的求值结果执行 if 分支或 else 分支的动作。支持为两个分支分别设置异步模式。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| _if | repeated Any | 条件列表（每个元素为一个 Condition 消息） |
| _ifCondOp | ConditionOperator | 条件组合方式：ALL(0)/ANY(1)/NONE(2)/MVEL(3) |
| _ifCondOpPayload | ConditionOperatorPayload | 当 _ifCondOp 为 MVEL 时的表达式载荷 |
| _ifActions | repeated Any | 条件为真时执行的动作列表 |
| _elseActions | repeated Any | 条件为假时执行的动作列表 |
| _ifActionAsyncMode | ActionAsyncMode | if 分支动作的异步模式 |
| _elseActionAsyncMode | ActionAsyncMode | else 分支动作的异步模式 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/IfThenElse",
  "_if": [],
  "_ifCondOp": "ALL",
  "_ifCondOpPayload": { "expression": "" },
  "_ifActions": [],
  "_elseActions": [],
  "_ifActionAsyncMode": "ActionAsyncMode_Sync",
  "_elseActionAsyncMode": "ActionAsyncMode_Sync"
}
```

---

### SwitchCase — 多路分支
类似 switch-case 语句，按顺序评估每个 case 的条件，匹配时执行对应动作。支持 break 控制、禁用单个 case、以及 default 分支。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| case | repeated SwitchCase_Case | case 分支列表 |
| deft | SwitchCase_Default | 默认分支（所有 case 均不匹配时执行） |

**子消息 SwitchCase_Case：**
| 字段 | 类型 | 说明 |
|------|------|------|
| case | repeated Any | 此分支的条件列表 |
| caseCondOp | ConditionOperator | 条件组合方式 |
| caseCondOpPayload | ConditionOperatorPayload | MVEL 表达式载荷 |
| action | repeated Any | 匹配时执行的动作列表 |
| description | string | 分支描述/备注 |
| id | string | 分支唯一标识 |
| isBreak | bool | 匹配后是否中断（不再评估后续 case） |
| isDisabled | bool | 是否禁用此分支 |
| actionAsyncMode | ActionAsyncMode | 动作异步模式 |

**子消息 SwitchCase_Default：**
| 字段 | 类型 | 说明 |
|------|------|------|
| defaultAction | repeated Any | 默认分支的动作列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SwitchCase",
  "case": [
    {
      "case": [],
      "caseCondOp": "ALL",
      "caseCondOpPayload": {},
      "action": [],
      "description": "case 1",
      "id": "C-001",
      "isBreak": true,
      "isDisabled": false,
      "actionAsyncMode": "ActionAsyncMode_Sync"
    }
  ],
  "deft": {
    "defaultAction": []
  }
}
```

---

### ForEach — 遍历循环
将数据按分隔符拆分为元素列表，对每个元素执行一组动作。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| data | string | 待遍历数据（字符串或变量引用） |
| delimiter | repeated string | 分隔符列表（可指定多个分隔符） |
| actions | repeated Any | 每次迭代执行的动作列表 |
| actionAsyncMode | ActionAsyncMode | 迭代动作的异步模式 |

**上下文变量：**
| 变量 | 说明 |
|------|------|
| `{foreachData}` | 当前迭代元素的值 |
| `{foreachIndex}` | 当前迭代索引（从 0 开始） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ForEach",
  "data": "a,b,c",
  "delimiter": [","],
  "actions": [],
  "actionAsyncMode": "ActionAsyncMode_Sync"
}
```

---

### ForEachPkgSet — 遍历应用集合
遍历指定应用集合（PkgSet）中的每个应用，对每个应用执行一组动作。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgSet | string | 应用集合名称 |
| action | repeated Any | 每次迭代执行的动作列表 |

**上下文变量：**
| 变量 | 说明 |
|------|------|
| `{loopAppPkgName}` | 当前应用的包名 |
| `{loopAppLabel}` | 当前应用的显示名称 |
| `{loopAppUserId}` | 当前应用所属用户 ID |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ForEachPkgSet",
  "pkgSet": "我的应用集合",
  "action": []
}
```

---

### WhileLoop — 条件循环
在条件满足时重复执行动作列表，支持设置迭代间延迟和最大重复次数。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| conditions | repeated Any | 循环条件列表 |
| actions | repeated Any | 循环体动作列表 |
| condOp | ConditionOperator | 条件组合方式 |
| condOpPayload | ConditionOperatorPayload | MVEL 表达式载荷 |
| delay | int32 | 每次迭代之间的延迟（毫秒） |
| repeatTimes | int32 | 最大重复次数（0 表示无限循环） |
| actionAsyncMode | ActionAsyncMode | 循环体动作的异步模式 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/WhileLoop",
  "conditions": [],
  "actions": [],
  "condOp": "ALL",
  "condOpPayload": {},
  "delay": 1000,
  "repeatTimes": 10,
  "actionAsyncMode": "ActionAsyncMode_Sync"
}
```

---

### BreakActionExecute — 中断执行
中断当前动作链的执行，可指定中断范围。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| scope | BreakActionExecuteScope | 中断范围 |

**枚举 BreakActionExecuteScope：**
| 值 | 说明 |
|-----|------|
| BreakActionExecuteScope_Current (0) | 中断当前层级（如 ForEach/WhileLoop 内部） |
| BreakActionExecuteScope_Parent (1) | 中断父层级 |
| BreakActionExecuteScope_Root (2) | 中断整个动作链（根层级） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/BreakActionExecute",
  "scope": "BreakActionExecuteScope_Current"
}
```

---

### WaitUtilConditionMatch — 等待条件满足
阻塞执行直到指定条件满足为止。支持超时设置和退出条件。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| condition | repeated Any | 等待的条件列表 |
| conditionOp | ConditionOperator | 条件组合方式 |
| condOpPayload | ConditionOperatorPayload | MVEL 表达式载荷 |
| timeout | int64 | **[已废弃]** 超时时间 |
| timeoutStr | string | 超时时间（毫秒，字符串格式，支持变量） |
| quitFacts | repeated Any | 退出触发器列表（当这些事实发生时退出等待） |
| quitCondition | repeated Any | 退出条件列表 |
| quitConditionOp | ConditionOperator | 退出条件组合方式 |
| quitCondOpPayload | ConditionOperatorPayload | 退出条件 MVEL 表达式载荷 |
| quitEnabled | bool | 是否启用退出机制 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/WaitUtilConditionMatch",
  "condition": [],
  "conditionOp": "ALL",
  "condOpPayload": {},
  "timeoutStr": "30000",
  "quitFacts": [],
  "quitCondition": [],
  "quitConditionOp": "ALL",
  "quitCondOpPayload": {},
  "quitEnabled": false
}
```

---

### Delay — 延时
暂停执行指定时长后继续。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| time | int64 | **[已废弃]** 延时时长 |
| timeString | string | 延时时长（字符串格式，支持变量引用） |
| useAlarm | bool | 是否使用 AlarmManager（设备休眠时更可靠） |
| showCD | bool | 是否显示倒计时 UI |
| timeUnit | TimeUnit | 时间单位：MS(0)/S(1)/M(2)/H(3)/D(4) |

**Proto：**
```json
{
  "@type": "type.googleapis.com/Delay",
  "timeString": "3",
  "useAlarm": false,
  "showCD": false,
  "timeUnit": "TimeUnit_S"
}
```

---

### StopAllActions — 停止所有动作
停止当前规则/一键指令中所有正在执行的动作。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/StopAllActions"
}
```

---

### NoAction — 占位动作
不执行任何操作的占位动作，可用于预留位置或作为视觉分组标记。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| icon | string | 显示图标（材质图标名称） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/NoAction",
  "icon": "label"
}
```

---

## 二、应用管理 (App Management)

---

### LaunchApp — 启动应用
通过应用包标识启动应用的主 Activity。注意：此动作的 appPkg 是单个 AppPkg，不是 repeated。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| appPkg | AppPkg | 目标应用（单个，非列表） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/LaunchApp",
  "appPkg": {
    "pkgName": "com.example.app",
    "userId": 0
  }
}
```

---

### LaunchAppByPkg — 按包名启动应用
通过包名和用户 ID 键值对启动应用，支持同时指定多个。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表（first=包名, second=用户ID） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/LaunchAppByPkg",
  "pkgAndUsers": [
    { "first": "com.example.app", "second": "0" }
  ]
}
```

---

### StopApp — 停止应用
强制停止指定应用或应用集合中的所有应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| appPkg | repeated AppPkg | 目标应用列表 |
| pkgSets | repeated string | 应用集合名称列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/StopApp",
  "appPkg": [
    { "pkgName": "com.example.app", "userId": 0 }
  ],
  "pkgSets": ["后台应用"]
}
```

---

### StopAppByPkg — 按包名停止应用
通过包名和用户 ID 键值对停止应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/StopAppByPkg",
  "pkgAndUsers": [
    { "first": "com.example.app", "second": "0" }
  ]
}
```

---

### StopCurrentApp — 停止当前应用
强制停止当前前台应用。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/StopCurrentApp"
}
```

---

### SetAppEnabled — 启用/禁用应用
启用或禁用指定的应用。被禁用的应用将无法运行，图标可能从桌面隐藏。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| appPkg | repeated AppPkg | 目标应用列表 |
| pkgSets | repeated string | 应用集合名称列表 |
| enable | bool | true 启用 / false 禁用 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetAppEnabled",
  "appPkg": [
    { "pkgName": "com.example.app", "userId": 0 }
  ],
  "pkgSets": [],
  "enable": false
}
```

---

### SetAppEnabledByPkg — 按包名启用/禁用应用
通过包名和用户 ID 键值对启用或禁用应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表 |
| enable | bool | true 启用 / false 禁用 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetAppEnabledByPkg",
  "pkgAndUsers": [
    { "first": "com.example.app", "second": "0" }
  ],
  "enable": true
}
```

---

### SetAppSuspend — 挂起/取消挂起应用
挂起或取消挂起指定应用。被挂起的应用图标会变灰，用户点击时会收到提示。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| appPkg | repeated AppPkg | 目标应用列表 |
| pkgSets | repeated string | 应用集合名称列表 |
| suspend | bool | true 挂起 / false 取消挂起 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetAppSuspend",
  "appPkg": [
    { "pkgName": "com.example.app", "userId": 0 }
  ],
  "pkgSets": [],
  "suspend": true
}
```

---

### SetAppSuspendByPkg — 按包名挂起/取消挂起应用
通过包名和用户 ID 键值对挂起或取消挂起应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表 |
| suspend | bool | true 挂起 / false 取消挂起 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetAppSuspendByPkg",
  "pkgAndUsers": [
    { "first": "com.example.app", "second": "0" }
  ],
  "suspend": true
}
```

---

### SetAppInactive — 设置应用为不活跃
将指定应用标记为不活跃状态（App Standby），系统将限制其后台活动。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| appPkg | repeated AppPkg | 目标应用列表 |
| pkgSets | repeated string | 应用集合名称列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetAppInactive",
  "appPkg": [
    { "pkgName": "com.example.app", "userId": 0 }
  ],
  "pkgSets": []
}
```

---

### SetAppInactiveByPkg — 按包名设置应用不活跃
通过包名和用户 ID 键值对将应用设置为不活跃。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetAppInactiveByPkg",
  "pkgAndUsers": [
    { "first": "com.example.app", "second": "0" }
  ]
}
```

---

### StartAppProcess — 启动应用进程
启动指定应用的进程（不打开 Activity），适用于需要预热应用的场景。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| appPkg | repeated AppPkg | 目标应用列表 |
| pkgSets | repeated string | 应用集合名称列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/StartAppProcess",
  "appPkg": [
    { "pkgName": "com.example.app", "userId": 0 }
  ],
  "pkgSets": []
}
```

---

### StartAppProcessByPkg — 按包名启动应用进程
通过包名和用户 ID 键值对启动应用进程。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/StartAppProcessByPkg",
  "pkgAndUsers": [
    { "first": "com.example.app", "second": "0" }
  ]
}
```

---

### RemoveTasks — 移除最近任务
从最近任务列表中移除指定应用的任务卡片。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| appPkg | repeated AppPkg | 目标应用列表 |
| pkgSets | repeated string | 应用集合名称列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/RemoveTasks",
  "appPkg": [
    { "pkgName": "com.example.app", "userId": 0 }
  ],
  "pkgSets": []
}
```

---

### RemoveTasksByPkg — 按包名移除最近任务
通过包名和用户 ID 键值对移除应用的最近任务。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/RemoveTasksByPkg",
  "pkgAndUsers": [
    { "first": "com.example.app", "second": "0" }
  ]
}
```

---

### CloseActivity — 关闭 Activity
关闭当前焦点 Activity 或指定组件的 Activity。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| mode | CloseActivityMode | 关闭模式 |
| component | AppComponent | 当 mode 为 Component 时指定的目标组件 |

**枚举 CloseActivityMode：**
| 值 | 说明 |
|-----|------|
| CloseActivityMode_Focused (0) | 关闭当前焦点 Activity |
| CloseActivityMode_Component (1) | 关闭指定组件的 Activity |

**Proto：**
```json
{
  "@type": "type.googleapis.com/CloseActivity",
  "mode": "CloseActivityMode_Focused",
  "component": {
    "pkg": { "pkgName": "com.example.app", "userId": 0 },
    "className": "com.example.app.MainActivity"
  }
}
```

---

### KillProcessByName — 按进程名杀死进程
根据进程名强制终止进程。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| processes | repeated ProcessName | 要终止的进程列表 |

**子消息 ProcessName：**
| 字段 | 类型 | 说明 |
|------|------|------|
| userId | int32 | 用户 ID |
| processName | string | 进程名 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/KillProcessByName",
  "processes": [
    { "userId": 0, "processName": "com.example.app:background" }
  ]
}
```

---

### StartPreviousApp — 启动上一个应用
启动任务栈中的上一个应用（后退导航）。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/StartPreviousApp"
}
```

---

### StartNextApp — 启动下一个应用
启动任务栈中的下一个应用（前进导航）。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/StartNextApp"
}
```

---

### StartLastApp — 启动最近使用的应用
在最近两个应用之间快速切换（类似双击最近任务键的效果）。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/StartLastApp"
}
```

---

### StartActivity — 启动 Activity（按组件名）
通过完整组件名字符串直接启动指定 Activity。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| componentNameAsString | string | 完整组件名（格式：`包名/类名`） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/StartActivity",
  "componentNameAsString": "com.example.app/.MainActivity"
}
```

---

### StartActivityIntent — 启动 Activity（按 Intent）
通过构造 AndroidIntent 启动 Activity、发送广播或启动服务。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| intent | AndroidIntent | Intent 描述 |
| userId | int32 | 目标用户 ID |
| componentType | AndroidIntentComponentType | 组件类型：Activity(0)/Broadcast(1)/Service(2) |

**子消息 AndroidIntent：**
| 字段 | 类型 | 说明 |
|------|------|------|
| action | string | Intent Action |
| flags | int32 | Intent Flags |
| pkgName | string | 目标包名 |
| className | string | 目标类名 |
| data | string | Intent Data URI |
| extras | repeated AndroidIntentExtra | 附加数据 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/StartActivityIntent",
  "intent": {
    "action": "android.intent.action.VIEW",
    "flags": 268435456,
    "pkgName": "com.example.app",
    "className": "com.example.app.MainActivity",
    "data": "",
    "extras": [
      { "key": "extra_key", "value": "extra_value", "type": "String" }
    ]
  },
  "userId": 0,
  "componentType": "AndroidIntentComponentTypeActivity"
}
```

---

### StartActivityUrlSchema — 启动 URL Schema
通过 URL Schema（深度链接）启动应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| urlSchema | string | URL Schema 字符串（如 `weixin://`） |
| userId | int32 | 目标用户 ID |

**Proto：**
```json
{
  "@type": "type.googleapis.com/StartActivityUrlSchema",
  "urlSchema": "alipayqr://platformapi/startapp?appId=20000056",
  "userId": 0
}
```

---

### StartActivityIntentUri — 启动 Intent URI
通过 Intent URI 字符串启动组件。Intent URI 是 Android Intent 的文本序列化表示。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| intentUri | string | Intent URI 字符串 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/StartActivityIntentUri",
  "intentUri": "intent:#Intent;action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;end"
}
```

---

### GetAppInfo — 获取应用信息
获取指定应用的详细信息并写入上下文变量。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgName | string | 应用包名 |
| userId | int32 | 用户 ID |

**上下文变量：**
| 变量 | 说明 |
|------|------|
| `{appLabel}` | 应用名称 |
| `{versionCode}` | 版本号（数字） |
| `{versionName}` | 版本名称（字符串） |
| `{isRunning}` | 应用是否正在运行（布尔值） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/GetAppInfo",
  "pkgName": "com.example.app",
  "userId": 0
}
```

---

### LaunchPinedItem — 启动固定项目
启动固定的快捷方式或小部件（ShortcutInfo 或 AppWidgetProviderInfo）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| intent | bytes | 序列化的 Intent 数据（二进制） |
| label | string | 项目显示名称 |
| userId | int32 | 用户 ID |

**Proto：**
```json
{
  "@type": "type.googleapis.com/LaunchPinedItem",
  "intent": "<base64 encoded bytes>",
  "label": "我的快捷方式",
  "userId": 0
}
```

---

## 三、系统开关 (System Toggles)

---

### SetWifiEnabled — 设置 Wi-Fi 开关
设置 Wi-Fi 的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetWifiEnabled",
  "enable": true
}
```

---

### ToggleWifi — 切换 Wi-Fi
切换 Wi-Fi 的开/关状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleWifi"
}
```

---

### SetBTEnabled — 设置蓝牙开关
设置蓝牙的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetBTEnabled",
  "enable": true
}
```

---

### ToggleBT — 切换蓝牙
切换蓝牙的开/关状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleBT"
}
```

---

### SetLocationEnabled — 设置定位开关
设置定位服务的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetLocationEnabled",
  "enable": true
}
```

---

### ToggleLocation — 切换定位
切换定位服务的开/关状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleLocation"
}
```

---

### SetDNDEnabled — 设置勿扰模式开关
设置勿扰（Do Not Disturb）模式的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetDNDEnabled",
  "enable": true
}
```

---

### ToggleDND — 切换勿扰模式
切换勿扰模式的开/关状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleDND"
}
```

---

### SetFlashLightEnabled — 设置手电筒开关
设置手电筒的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetFlashLightEnabled",
  "enable": true
}
```

---

### ToggleFlashLight — 切换手电筒
切换手电筒的开/关状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleFlashLight"
}
```

---

### SetNFCEnabled — 设置 NFC 开关
设置 NFC 的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetNFCEnabled",
  "enable": true
}
```

---

### ToggleNFC — 切换 NFC
切换 NFC 的开/关状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleNFC"
}
```

---

### SetHotSpotEnabled — 设置热点开关
设置 Wi-Fi 热点的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetHotSpotEnabled",
  "enable": true
}
```

---

### ToggleHotSpot — 切换热点
切换 Wi-Fi 热点的开/关状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleHotSpot"
}
```

---

### SetDataEnabled — 设置移动数据开关
设置移动数据的启用或禁用状态，支持指定 SIM 卡槽。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启 / false 关闭 |
| hasSpecificSlotId | bool | 是否指定特定 SIM 卡槽 |
| slotId | int32 | SIM 卡槽 ID（0 或 1），仅当 hasSpecificSlotId 为 true 时有效 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetDataEnabled",
  "enable": true,
  "hasSpecificSlotId": false,
  "slotId": 0
}
```

---

### ToggleData — 切换移动数据
切换移动数据的开/关状态，支持指定 SIM 卡槽。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| hasSpecificSlotId | bool | 是否指定特定 SIM 卡槽 |
| slotId | int32 | SIM 卡槽 ID（0 或 1） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleData",
  "hasSpecificSlotId": false,
  "slotId": 0
}
```

---

### SetDarkModeEnabled — 设置深色模式开关
设置系统深色模式的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启深色模式 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetDarkModeEnabled",
  "enable": true
}
```

---

### ToggleDarkMode — 切换深色模式
切换系统深色模式的开/关状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleDarkMode"
}
```

---

### SetSensorsOffEnabled — 设置传感器总开关
设置设备传感器的禁用或启用状态。关闭后所有传感器（加速度计、陀螺仪、指纹等）将停止工作。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 关闭传感器 / false 恢复传感器 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetSensorsOffEnabled",
  "enable": true
}
```

---

### ToggleSensorsOff — 切换传感器总开关
切换设备传感器的禁用/启用状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleSensorsOff"
}
```

---

### SetAPMModeEnabled — 设置飞行模式
设置飞行模式的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isEnable | bool | true 开启飞行模式 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetAPMModeEnabled",
  "isEnable": true
}
```

---

### SetMasterSync — 设置主同步开关
控制系统账户自动同步的全局开关。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| sync | OnOffToggle | 同步状态：On(0)开启/Off(1)关闭/Toggle(2)切换 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetMasterSync",
  "sync": "OnOffToggle_On"
}
```

---

### Toggle5G — 切换 5G
控制 5G 网络的开启、关闭或切换，支持指定 SIM 卡槽。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| onOff | OnOffToggle | 状态：On(0)开启/Off(1)关闭/Toggle(2)切换 |
| slotId | int32 | SIM 卡槽 ID（0 或 1） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/Toggle5G",
  "onOff": "OnOffToggle_Toggle",
  "slotId": 0
}
```

---

### ToggleSlot — 切换 SIM 卡槽状态
控制 SIM 卡槽的启用、禁用或切换。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| state | OnOffToggle | 状态：On(0)启用/Off(1)禁用/Toggle(2)切换 |
| slotId | int32 | SIM 卡槽 ID（0 或 1） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleSlot",
  "state": "OnOffToggle_Toggle",
  "slotId": 0
}
```

---

### SwitchMobileDataSlot — 切换移动数据 SIM 卡
切换默认移动数据使用的 SIM 卡槽。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| slotId | int32 | 目标 SIM 卡槽 ID（0 或 1） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SwitchMobileDataSlot",
  "slotId": 1
}
```

---

### ConnectWifi — 连接指定 Wi-Fi
连接到指定 SSID 的 Wi-Fi 网络（需要已保存过该网络的配置）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ssid | string | Wi-Fi 网络名称（SSID） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ConnectWifi",
  "ssid": "MyHomeWifi"
}
```

---

### DisconnectCurrentWifi — 断开当前 Wi-Fi
断开当前连接的 Wi-Fi 网络。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/DisconnectCurrentWifi"
}
```

---

### ClickTile — 点击快速设置磁贴
模拟点击或长按系统快速设置面板中的磁贴。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| tile | QSTile | 目标磁贴 |
| isLongClick | bool | 是否长按（false 为普通点击） |

**子消息 QSTile：**
| 字段 | 类型 | 说明 |
|------|------|------|
| tileSpec | string | 磁贴规格标识符（如 `wifi`, `bt`, `cell` 等系统磁贴，或自定义磁贴的完整组件名） |
| label | string | 磁贴显示名称 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ClickTile",
  "tile": {
    "tileSpec": "wifi",
    "label": "Wi-Fi"
  },
  "isLongClick": false
}
```

---

### SetScreenTimeout — 设置屏幕超时
设置屏幕自动关闭的超时时间。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| timeoutMillis | int64 | 超时时间（毫秒），如 30000 表示 30 秒 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetScreenTimeout",
  "timeoutMillis": 60000
}
```

---

### SetRingerMode — 设置铃声模式
设置设备的铃声模式。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| mode | RingerMode | 铃声模式 |

**枚举 RingerMode：**
| 值 | 说明 |
|-----|------|
| silent (0) | 静音模式 |
| vibrate (1) | 振动模式 |
| normal (2) | 正常模式（铃声） |
| switchMode (3) | 循环切换模式（静音→振动→正常→静音...） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetRingerMode",
  "mode": "normal"
}
```

---

### SetScreenRotate — 设置屏幕旋转角度
设置屏幕旋转到指定角度或自动旋转。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| degree | ScreenRotateDegree | 旋转角度 |

**枚举 ScreenRotateDegree：**
| 值 | 说明 |
|-----|------|
| ScreenRotateDegree_0 (0) | 竖屏（0 度） |
| ScreenRotateDegree_90 (1) | 横屏（90 度） |
| ScreenRotateDegree_180 (2) | 倒竖屏（180 度） |
| ScreenRotateDegree_270 (3) | 反向横屏（270 度） |
| ScreenRotateDegree_Any (4) | 自动旋转 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetScreenRotate",
  "degree": "ScreenRotateDegree_90"
}
```

---

### SetBrightness — 设置屏幕亮度
设置屏幕亮度值。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| value | int32 | 亮度值（0-255） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetBrightness",
  "value": 128
}
```

---

### SetAutoBrightness — 设置自动亮度
设置自动亮度的启用或禁用状态。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| enable | bool | true 开启自动亮度 / false 关闭 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/SetAutoBrightness",
  "enable": true
}
```

---

### ToggleAutoBrightness — 切换自动亮度
切换自动亮度的开/关状态。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ToggleAutoBrightness"
}
```

---

### StayAwake — 保持唤醒
控制设备是否保持屏幕常亮。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isStay | OnOffToggle | 状态：On(0)保持唤醒/Off(1)取消保持/Toggle(2)切换 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/StayAwake",
  "isStay": "OnOffToggle_On"
}
```

---

### ShowHideInsets — 显示/隐藏系统栏
显示或隐藏系统窗口装饰（状态栏、导航栏、输入法等）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isHide | bool | true 隐藏 / false 显示 |
| type | repeated WindowInsetType | 要操作的窗口装饰类型列表 |

**枚举 WindowInsetType：**
| 值 | 说明 |
|-----|------|
| WindowInsetType_StatusBar (0) | 状态栏 |
| WindowInsetType_NavBar (1) | 导航栏 |
| WindowInsetType_Ime (2) | 输入法 |
| WindowInsetType_SystemOverlays (3) | 系统覆盖层 |
| WindowInsetType_displayCutout (4) | 显示刘海区域 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ShowHideInsets",
  "isHide": true,
  "type": ["WindowInsetType_StatusBar", "WindowInsetType_NavBar"]
}
```

---

## 四、通知 (Notification)

---

### PostNotification — 发送通知
发送一条自定义系统通知，支持点击动作、按钮、图标、振动、声音等高级选项。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| tag | string | 通知标签（用于更新或取消通知的唯一标识） |
| title | string | 通知标题 |
| message | string | 通知内容文本 |
| isImportant | bool | 是否为重要通知（高优先级，可能弹出横幅） |
| largeIcon | string | 大图标路径或 URL |
| smallIcon | string | 小图标（材质图标名称） |
| vibrate | bool | 是否振动 |
| sound | bool | 是否播放声音 |
| clickAction | repeated Any | 点击通知时执行的动作列表 |
| button | repeated NotificationButton | 通知操作按钮列表 |
| overrideAppName | string | 覆盖通知显示的应用名称 |
| onGoing | bool | 是否为持续通知（不可滑动清除） |
| extras | repeated AndroidIntentExtra | 附加数据 |
| contextAndVars | RemoteRuleContextAndVars | 跨进程传递的上下文和变量 |

**子消息 NotificationButton：**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 按钮唯一标识 |
| action | repeated Any | 按钮点击时执行的动作列表 |
| label | string | 按钮文本 |
| labelRegexOptions | RegexMatchOptions | 标签正则匹配选项（用于匹配场景） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/PostNotification",
  "tag": "my_notification",
  "title": "任务完成",
  "message": "文件下载已完成",
  "isImportant": true,
  "largeIcon": "",
  "smallIcon": "download_done",
  "vibrate": true,
  "sound": true,
  "clickAction": [],
  "button": [
    {
      "id": "btn_open",
      "action": [],
      "label": "打开"
    }
  ],
  "overrideAppName": "",
  "onGoing": false,
  "extras": [],
  "contextAndVars": {}
}
```

---

### RemoveNotification — 移除通知
移除匹配指定条件的通知。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| tag | string | **[已废弃]** 通知标签 |
| notification | Notification | 通知匹配条件（见公共子消息 Notification） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/RemoveNotification",
  "notification": {
    "title": ".*下载.*",
    "titleRegexOptions": "ContainsMatchIn",
    "apps": [
      { "pkgName": "com.example.app", "userId": 0 }
    ]
  }
}
```

---

### ClickNotification — 点击通知
模拟点击匹配指定条件的通知（触发通知的 contentIntent）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| notification | Notification | 通知匹配条件 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ClickNotification",
  "notification": {
    "title": "新消息",
    "titleRegexOptions": "Match",
    "apps": [
      { "pkgName": "com.tencent.mm", "userId": 0 }
    ]
  }
}
```

---

### ClickNotificationActionButton — 点击通知操作按钮
模拟点击通知上的指定操作按钮。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| notification | Notification | 通知匹配条件 |
| button | NotificationButton | 要点击的按钮匹配条件 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ClickNotificationActionButton",
  "notification": {
    "title": "来电",
    "apps": [
      { "pkgName": "com.android.dialer", "userId": 0 }
    ]
  },
  "button": {
    "label": "接听",
    "labelRegexOptions": "ContainsMatchIn"
  }
}
```

---

### RemoveNotificationForPackage — 移除应用通知
移除指定应用（或应用集合）发出的所有通知。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| appPkg | repeated AppPkg | 目标应用列表 |
| pkgSets | repeated string | 应用集合名称列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/RemoveNotificationForPackage",
  "appPkg": [
    { "pkgName": "com.example.app", "userId": 0 }
  ],
  "pkgSets": []
}
```

---

### RemoveNotificationForPackageByPkg — 按包名移除应用通知
通过包名和用户 ID 键值对移除应用的所有通知。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgAndUsers | repeated StringPair | 包名与用户 ID 的键值对列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/RemoveNotificationForPackageByPkg",
  "pkgAndUsers": [
    { "first": "com.example.app", "second": "0" }
  ]
}
```

---

### ExpandNotification — 展开通知面板
展开系统通知面板（下拉通知栏）。

**参数：** 无自定义参数。

**Proto：**
```json
{
  "@type": "type.googleapis.com/ExpandNotification"
}
```

---

### ShowPPN — 显示弹出式通知
显示一个应用内弹出式持久通知（PPN = Pop-up Persistent Notification），在屏幕顶部浮动显示。支持点击动作和按钮。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| tag | string | 通知标签（唯一标识，用于更新或移除） |
| title | string | 通知标题 |
| message | string | 通知内容 |
| icon | string | 图标（材质图标名称） |
| vibrate | bool | 是否振动 |
| sound | bool | 是否播放声音 |
| clickAction | repeated Any | 点击时执行的动作列表 |
| button | repeated NotificationButton | 操作按钮列表 |
| displayTimeSeconds | int32 | 显示持续时间（秒），0 表示持续显示直到手动移除 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/ShowPPN",
  "tag": "ppn_alert",
  "title": "提醒",
  "message": "该休息了",
  "icon": "alarm",
  "vibrate": true,
  "sound": false,
  "clickAction": [],
  "button": [],
  "displayTimeSeconds": 10
}
```

---

### RemovePPN — 移除弹出式通知
移除指定标签的弹出式持久通知。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| tag | string | 要移除的 PPN 标签 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/RemovePPN",
  "tag": "ppn_alert"
}
```
## UI 交互

### ShowToast — 显示 Toast 提示
在屏幕上显示一条短暂的 Toast 提示消息。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| message | string | 要显示的提示文本，支持变量引用 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowToast",
  "message": "操作完成"
}
```

---

### ShowAlertDialog — 显示确认对话框
弹出一个带有最多三个按钮（确定/取消/中立）的对话框，每个按钮可绑定不同的后续动作列表。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 对话框标题 |
| message | string | 对话框内容 |
| positive | string | 确定按钮文本 |
| onPositive | repeated Any | 点击确定后执行的动作列表 |
| negative | string | 取消按钮文本 |
| onNegative | repeated Any | 点击取消后执行的动作列表 |
| neutral | string | 中立按钮文本 |
| onNeutral | repeated Any | 点击中立按钮后执行的动作列表 |
| cancelable | bool | 是否允许点击外部关闭 |
| style | DialogUiStyleSettings | 样式设置（fontScale: float 字体缩放, themeMode: UiThemeMode 主题模式） |

> DialogUiStyleSettings: `fontScale`(float) 字体缩放比例, `themeMode`(UiThemeMode) 主题模式  
> UiThemeMode 枚举: `System=0` 跟随系统, `Light=1` 浅色, `Dark=2` 深色

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowAlertDialog",
  "title": "确认",
  "message": "是否继续？",
  "positive": "确定",
  "onPositive": [],
  "negative": "取消",
  "onNegative": [],
  "cancelable": true
}
```

---

### ShowMenuDialog — 显示菜单对话框
弹出一个包含多个菜单项的对话框，每个菜单项可绑定点击动作。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| items | repeated DialogMenuItem | 菜单项列表 |
| title | string | 对话框标题 |
| message | string | 对话框描述 |
| cancelable | bool | 是否允许点击外部关闭 |
| style | DialogUiStyleSettings | 样式设置 |

> DialogMenuItem: `title`(string) 菜单项标题, `message`(string) 菜单项描述, `clickActions`(repeated Any) 点击后执行的动作列表

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowMenuDialog",
  "title": "请选择",
  "items": [
    {"title": "选项A", "message": "描述A", "clickActions": []},
    {"title": "选项B", "message": "描述B", "clickActions": []}
  ],
  "cancelable": true
}
```

---

### ShowTextFieldDialog — 显示文本输入对话框
弹出一个包含一个或多个文本输入框的对话框，用户输入的内容可通过上下文变量获取。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 对话框标题 |
| message | string | 对话框描述 |
| cancelable | bool | 是否允许点击外部关闭 |
| textFields | repeated TextFieldProp | 文本输入框定义列表 |
| style | DialogUiStyleSettings | 样式设置 |

> TextFieldProp: `label`(string) 输入框标签, `placeholder`(string) 占位提示文本, `isRequired`(string) 是否必填, `value`(string) 默认值

**上下文变量：**
- `{textFieldInput1}` — 第一个文本框的输入内容
- `{textFieldInput2}` — 第二个文本框的输入内容（以此类推）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowTextFieldDialog",
  "title": "请输入信息",
  "textFields": [
    {"label": "名称", "placeholder": "请输入名称", "isRequired": "true", "value": ""}
  ],
  "cancelable": true
}
```

---

### ShowChoiceDialog — 显示选择对话框
弹出一个单选或多选对话框，用户选择的内容通过上下文变量返回。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 对话框标题 |
| message | string | 对话框描述 |
| cancelable | bool | 是否允许点击外部关闭 |
| choices | repeated ChoiceProp | 选项列表 |
| isMultipleChoice | bool | 是否多选模式 |
| style | DialogUiStyleSettings | 样式设置 |

> ChoiceProp: `label`(string) 选项显示文本, `value`(string) 选项值, `isSelectedByDefault`(bool) 是否默认选中

**上下文变量：**
- `{choices}` — 用户选中的值

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowChoiceDialog",
  "title": "请选择",
  "choices": [
    {"label": "选项A", "value": "a", "isSelectedByDefault": false},
    {"label": "选项B", "value": "b", "isSelectedByDefault": true}
  ],
  "isMultipleChoice": false,
  "cancelable": true
}
```

---

### ShowListDialog — 显示列表对话框
弹出一个列表对话框，数据可以来自变量或字符串，使用分隔符分割。支持单选和多选。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 对话框标题 |
| message | string | 对话框描述 |
| cancelable | bool | 是否允许点击外部关闭 |
| data | string | 列表数据，可以是变量引用或用分隔符连接的字符串 |
| isMultipleChoice | bool | 是否多选模式 |
| delimiter | repeated string | 分隔符列表 |
| needConfirmAction | bool | 是否需要确认按钮 |
| dataType | ShowListDialogDataType | 数据类型 |
| style | DialogUiStyleSettings | 样式设置 |

> ShowListDialogDataType 枚举: `String=0` 纯文本, `Json=1` JSON 数据

**上下文变量：**
- `{selectedListItem}` — 用户选中的列表项

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowListDialog",
  "title": "选择一项",
  "data": "苹果,香蕉,橙子",
  "delimiter": [","],
  "isMultipleChoice": false,
  "cancelable": true,
  "dataType": 0
}
```

---

### ShowDanmu — 显示弹幕
在屏幕顶部显示一条弹幕样式的通知，可带图标。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 弹幕文本 |
| icon | string | 图标名称 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowDanmu",
  "text": "WiFi 已连接",
  "icon": "wifi"
}
```

---

### ShowStatusBarChip — 显示状态栏标签
在状态栏显示一个可点击的标签（Chip），支持点击和长按动作。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 标签显示文本 |
| icon | string | 图标名称 |
| clickAction | repeated Any | 点击时执行的动作列表 |
| longClickAction | repeated Any | 长按时执行的动作列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowStatusBarChip",
  "text": "计时中",
  "icon": "timer",
  "clickAction": [],
  "longClickAction": []
}
```

---

### HideStatusBarClip — 隐藏状态栏标签
隐藏当前显示的状态栏标签。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.HideStatusBarClip"
}
```

---

### SetStatusBarIcon — 设置状态栏图标
在指定的状态栏槽位设置一个自定义图标。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| slot | string | 图标槽位标识 |
| icon | string | 图标名称 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.SetStatusBarIcon",
  "slot": "slot1",
  "icon": "bluetooth"
}
```

---

### RemoveStatusBarIcon — 移除状态栏图标
移除指定槽位的自定义状态栏图标。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| slot | string | 要移除的图标槽位标识 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.RemoveStatusBarIcon",
  "slot": "slot1"
}
```

---

### ShowOverlayButton — 显示悬浮按钮
在屏幕上显示一组悬浮按钮面板，支持丰富的自定义外观和行为。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| buttonSettings | repeated OverlayButtonSetting | 按钮配置列表 |
| autoCollapse | bool | 是否自动折叠 |
| tag | string | 悬浮按钮的唯一标签，用于后续隐藏操作 |
| orientation | OverlayOrientation | 排列方向 |
| maxHeightInDp | int32 | 最大高度（dp） |
| maxWidthInDp | int32 | 最大宽度（dp） |
| backgroundAlpha | float | 背景透明度（0.0~1.0） |
| backgroundColor | string | 背景颜色值 |
| buttonMinWidth | int32 | 按钮最小宽度（dp） |
| enableGlobalDrag | bool | 是否启用全局拖动 |
| overlayPaddingH | int32 | 水平内边距（dp） |
| overlayPaddingV | int32 | 垂直内边距（dp） |
| disableAutoEdge | bool | 是否禁用自动贴边 |
| closeOnTouchOutside | bool | 点击外部是否关闭 |
| closeOnAction | bool | 执行动作后是否关闭 |
| themeMode | UiThemeMode | 主题模式 |

> OverlayButtonSetting: `actions`(repeated Any) 点击动作, `icon`(string) 图标, `index`(int32) 排序索引, `label`(string) 按钮文本, `backgroundColor`(string) 背景色, `iconTintColor`(string) 图标着色, `longClickActions`(repeated Any) 长按动作, `componentType`(OverlayButtonComponentType) 组件类型, `progress`(string) 进度值  
> OverlayOrientation 枚举: `Port=0` 纵向, `Land=1` 横向  
> OverlayButtonComponentType 枚举: `Button=0` 按钮, `CircleProgress=1` 圆形进度条  
> UiThemeMode 枚举: `System=0` 跟随系统, `Light=1` 浅色, `Dark=2` 深色

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowOverlayButton",
  "buttonSettings": [
    {
      "icon": "play_arrow",
      "label": "播放",
      "actions": []
    }
  ],
  "tag": "media_controls",
  "autoCollapse": false,
  "closeOnTouchOutside": true,
  "themeMode": 0
}
```

---

### HideOverlayButton — 隐藏悬浮按钮
隐藏指定标签的悬浮按钮。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| overlayTags | repeated string | 要隐藏的悬浮按钮标签列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.HideOverlayButton",
  "overlayTags": ["media_controls"]
}
```

---

### ShowFloatWindow — 显示悬浮窗
在屏幕上显示一个悬浮窗面板。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| buttonSettings | repeated OverlayButtonSetting | 按钮配置列表 |
| tag | string | 悬浮窗唯一标签 |
| panelRadiusScale | float | 面板圆角缩放比例 |
| themeMode | UiThemeMode | 主题模式 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowFloatWindow",
  "buttonSettings": [],
  "tag": "my_float",
  "panelRadiusScale": 1.0,
  "themeMode": 0
}
```

---

### HideFloatWindow — 隐藏悬浮窗
隐藏指定标签的悬浮窗。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| overlayTags | repeated string | 要隐藏的悬浮窗标签列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.HideFloatWindow",
  "overlayTags": ["my_float"]
}
```

---

### ShowSideBar — 显示侧边栏
在屏幕侧边显示一个快捷操作栏。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| buttonSettings | repeated OverlayButtonSetting | 按钮配置列表 |
| tag | string | 侧边栏唯一标签 |
| themeMode | UiThemeMode | 主题模式 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowSideBar",
  "buttonSettings": [],
  "tag": "quick_sidebar",
  "themeMode": 0
}
```

---

### HideSideBar — 隐藏侧边栏
隐藏指定标签的侧边栏。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| overlayTags | repeated string | 要隐藏的侧边栏标签列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.HideSideBar",
  "overlayTags": ["quick_sidebar"]
}
```

---

### ShowActionSidebar — 显示动作侧边栏
在屏幕边缘显示一个功能更丰富的动作侧边栏，支持自定义位置、样式和交互行为。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| buttons | repeated ActionSidebarButton | 按钮列表 |
| dismissBehavior | ActionSidebarDismissBehavior | 关闭行为 |
| displayTitle | string | 侧边栏显示标题 |
| tag | string | 唯一标签 |
| position | ActionSidebarPosition | 显示位置 |
| style | ActionSidebarStyleSettings | 样式设置 |
| themeMode | UiThemeMode | 主题模式 |

> ActionSidebarButton: `icon`(string) 图标, `text`(string) 文本, `order`(int32) 排序, `tapActions`(repeated Any) 点击动作, `longPressActions`(repeated Any) 长按动作  
> ActionSidebarDismissBehavior 枚举: `OutsideTapOrClose=0` 点击外部或关闭  
> ActionSidebarPosition 枚举: `Left=0` 左侧, `Right=1` 右侧, `Top=2` 顶部, `Bottom=3` 底部  
> ActionSidebarStyleSettings: `backgroundColor`(int32), `backgroundAlphaPercent`(int32), `panelCornerRadiusDp`(int32), `buttonCornerRadiusDp`(int32), `panelWidthDp`(int32), `maxHeightDp`(int32), `iconSizeDp`(int32), `iconBackgroundSizeDp`(int32), `iconColor`(int32), `iconBackgroundColor`(int32), `textColor`(int32), `textSizeSp`(int32), `contentPaddingHorizontalDp`(int32), `contentPaddingVerticalDp`(int32), `itemSpacingDp`(int32)

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowActionSidebar",
  "buttons": [
    {"icon": "wifi", "text": "WiFi", "order": 0, "tapActions": [], "longPressActions": []}
  ],
  "displayTitle": "快捷工具",
  "tag": "tool_sidebar",
  "position": 1,
  "dismissBehavior": 0,
  "themeMode": 0
}
```

---

### DisplayImage — 显示图片
全屏显示一张图片，支持多种缩放模式。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| imageUrl | string | 图片路径或 URL |
| scaleType | ImageScaleType | 缩放类型 |
| themeMode | UiThemeMode | 主题模式 |

> ImageScaleType 枚举: `FIT_CENTER=0` 适应居中, `FIT_XY=1` 拉伸填充, `CENTER=2` 居中不缩放, `CENTER_CROP=3` 居中裁剪, `CENTER_INSIDE=4` 居中缩小, `MATRIX=5` 矩阵变换

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.DisplayImage",
  "imageUrl": "/sdcard/Pictures/photo.jpg",
  "scaleType": 0,
  "themeMode": 0
}
```

---

### BiometricVerify — 生物识别验证
弹出生物识别（指纹/面容）验证对话框，验证成功或失败后分别执行不同的动作列表。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 验证对话框标题 |
| subTitle | string | 验证对话框副标题 |
| allowActions | repeated Any | 验证通过后执行的动作列表 |
| denyActions | repeated Any | 验证失败后执行的动作列表 |
| themeMode | UiThemeMode | 主题模式 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.BiometricVerify",
  "title": "身份验证",
  "subTitle": "请验证指纹以继续",
  "allowActions": [],
  "denyActions": [],
  "themeMode": 0
}
```

---

### ShowDrawBoard — 显示画板
在屏幕上显示一个绘画面板。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| themeMode | UiThemeMode | 主题模式 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowDrawBoard",
  "themeMode": 0
}
```

---

### ShowClipboardView — 显示剪贴板视图
在屏幕上显示剪贴板管理界面，可查看和管理剪贴板历史。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| themeMode | UiThemeMode | 主题模式 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowClipboardView",
  "themeMode": 0
}
```

---

### EnableUniversalCopy — 启用万能复制
启用万能复制模式，允许用户长按选择并复制屏幕上任意位置的文本。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| themeMode | UiThemeMode | 主题模式 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.EnableUniversalCopy",
  "themeMode": 0
}
```

---

### EnableViewIdViewer — 启用控件 ID 查看器
启用控件 ID 查看模式，在屏幕上显示所有 UI 控件的 ID 信息，便于开发和调试。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| themeMode | UiThemeMode | 主题模式 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.EnableViewIdViewer",
  "themeMode": 0
}
```

---

### ShowRecentApps — 显示最近任务
显示或隐藏最近应用（多任务）界面。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| state | OnOffToggle | 开关状态 |

> OnOffToggle 枚举: `On=0` 开, `Off=1` 关, `Toggle=2` 切换

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowRecentApps",
  "state": 0
}
```

---

### ShowGlobalActionsMenu — 显示全局操作菜单
显示系统全局操作菜单（通常包含关机、重启等选项）。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShowGlobalActionsMenu"
}
```

---

### ScreenFlash — 屏幕闪烁
使屏幕闪烁指定颜色和次数，可用作视觉提醒。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| colorInt | string | 颜色值（整数字符串），支持变量 |
| times | string | 闪烁次数（字符串），支持变量 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ScreenFlash",
  "colorInt": "-65536",
  "times": "3"
}
```

---

### PanoramicLightEffect — 全景灯光效果
在屏幕边缘显示流光/火焰般的灯光效果，可自定义颜色、速度、宽度、强度和抖动等参数。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| colorInt | string | 颜色值（整数字符串），支持变量 |
| times | string | 播放次数，支持变量 |
| speedScale | string | 速度缩放比例，支持变量 |
| glowWidthScale | string | 发光宽度缩放比例，支持变量 |
| intensityScale | string | 强度缩放比例，支持变量 |
| flameJitterScale | string | 火焰抖动缩放比例，支持变量 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.PanoramicLightEffect",
  "colorInt": "-16711936",
  "times": "2",
  "speedScale": "1.0",
  "glowWidthScale": "1.0",
  "intensityScale": "1.0",
  "flameJitterScale": "0.5"
}
```

---

### ScrollViewTo — 滚动视图
将当前焦点视图滚动到指定位置。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| location | ScrollViewToLocation | 滚动目标位置 |

> ScrollViewToLocation 枚举: `Top=0` 顶部, `Bottom=1` 底部, `TopForce=2` 强制顶部, `BottomForce=3` 强制底部, `Forward=4` 向前, `Backward=5` 向后

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ScrollViewTo",
  "location": 0
}
```

---

### WaitForIdle — 等待界面空闲
等待当前界面进入空闲状态（无动画、无布局变化），常用于自动化操作之间的同步。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WaitForIdle"
}
```

---

## 变量操作

### CreateGlobalVar — 创建全局变量
创建一个新的全局变量，支持多种数据类型。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| globalVar | GlobalVar | 全局变量定义 |

> GlobalVar: `name`(string) 变量名, `type`(Any) 变量类型  
> 支持的类型: `StringVar`(string 类型), `Int64Var`(int64 类型), `BoolVar`(bool 类型), `StringListVar`(string 列表), `Int64ListVar`(int64 列表), `BoolListVar`(bool 列表)

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.CreateGlobalVar",
  "globalVar": {
    "name": "counter",
    "type": {"@type": "type.googleapis.com/shortx.Int64Var", "value": "0"}
  }
}
```

---

### WriteGlobalVar — 写入全局变量
修改全局变量的值，支持多种写入操作（覆盖、追加、删除、算术运算等）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| varName | string | 变量名 |
| valueAsString | string | 要写入的值（字符串形式），支持变量引用 |
| op | WriteGlobalVarOp | 写入操作类型 |
| autoCreateIfMissing | bool | 变量不存在时是否自动创建 |

> WriteGlobalVarOp 枚举:
> - `Auto=0` 自动判断
> - `AppendToLast=1` 追加到列表末尾
> - `AppendToFirst=2` 追加到列表开头
> - `Override=3` 覆盖写入
> - `DeleteValue=4` 删除指定值
> - `DeleteLast=5` 删除列表末尾元素
> - `DeleteFirst=6` 删除列表开头元素
> - `Clear=7` 清空
> - `Reverse=8` 反转列表
> - `Shuffle=9` 随机打乱列表
> - `Plus1=10` 数值加 1
> - `Minus1=11` 数值减 1
> - `Invert=12` 布尔值取反
> - `PlusDelta=13` 数值加 delta（valueAsString 为增量）
> - `MinusDelta=14` 数值减 delta（valueAsString 为减量）
> - `RemoveAtIndex=15` 删除指定索引的元素（valueAsString 为索引）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WriteGlobalVar",
  "varName": "counter",
  "valueAsString": "10",
  "op": 3,
  "autoCreateIfMissing": true
}
```

---

### DeleteGlobalVar — 删除全局变量
删除指定名称的全局变量。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| varName | string | 要删除的变量名 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.DeleteGlobalVar",
  "varName": "counter"
}
```

---

### AddToGlobalVar — 添加到全局变量
向列表类型的全局变量中添加一个元素。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| varName | string | 列表变量名 |
| valueAsString | string | 要添加的值（字符串形式） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.AddToGlobalVar",
  "varName": "myList",
  "valueAsString": "新元素"
}
```

---

### CreateLocalVar — 创建局部变量
在当前指令执行上下文中创建一个局部变量，仅在当前指令生命周期内有效。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| localVar | LocalVar | 局部变量定义 |

> LocalVar: `name`(string) 变量名, `type`(Any) 变量类型（支持 StringVar/Int64Var/BoolVar/StringListVar/Int64ListVar/BoolListVar）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.CreateLocalVar",
  "localVar": {
    "name": "tempStr",
    "type": {"@type": "type.googleapis.com/shortx.StringVar", "value": ""}
  }
}
```

---

### WriteLocalVar — 写入局部变量
修改当前指令执行上下文中的局部变量的值。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| varName | string | 局部变量名 |
| valueAsString | string | 要写入的值（字符串形式），支持变量引用 |
| autoCreateIfMissing | bool | 变量不存在时是否自动创建 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WriteLocalVar",
  "varName": "tempStr",
  "valueAsString": "hello {globalVarName}",
  "autoCreateIfMissing": false
}
```

---

### CreatePkgSet — 创建应用集
创建一个新的应用集合（包集），用于批量管理应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| label | string | 应用集名称/标签 |
| description | string | 应用集描述 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.CreatePkgSet",
  "label": "社交应用",
  "description": "微信、QQ 等社交类应用"
}
```

---

### AddAppsToPkgSetByPkg — 按包名添加应用到应用集
通过包名将应用添加到指定的应用集。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgSetLabel | string | 目标应用集名称 |
| pkgAndUsers | repeated StringPair | 应用包名和用户 ID 的键值对列表（first=包名, second=用户ID） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.AddAppsToPkgSetByPkg",
  "pkgSetLabel": "社交应用",
  "pkgAndUsers": [
    {"first": "com.tencent.mm", "second": "0"}
  ]
}
```

---

### RemoveAppsFromPkgSetByPkg — 按包名从应用集移除应用
通过包名从指定的应用集中移除应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| pkgSetLabel | string | 目标应用集名称 |
| pkgAndUsers | repeated StringPair | 要移除的应用包名和用户 ID 的键值对列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.RemoveAppsFromPkgSetByPkg",
  "pkgSetLabel": "社交应用",
  "pkgAndUsers": [
    {"first": "com.tencent.mm", "second": "0"}
  ]
}
```

---

## 脚本执行

### ShellCommand — 执行 Shell 命令
在系统 Shell 环境中执行命令，可获取标准输出、标准错误和退出码。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| command | string | 要执行的 Shell 命令，支持变量引用 |
| singleShot | bool | 是否在独立进程中执行（执行完立即退出） |

**上下文变量：**
- `{shellOut}` — 命令的标准输出
- `{shellErr}` — 命令的标准错误输出
- `{shellCode}` — 命令的退出码（0 表示成功）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShellCommand",
  "command": "dumpsys battery",
  "singleShot": false
}
```

---

### ExecuteJS — 执行 JavaScript 脚本
执行一段 JavaScript 表达式，可在指定的协程上下文中运行。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| expression | string | JavaScript 表达式/脚本代码 |
| context | CoroutineContext | 执行的协程上下文 |

> CoroutineContext 枚举: `Default=0` 默认, `IO=1` IO 线程, `UI=2` 主线程

**上下文变量：**
- `{jsRet}` — JavaScript 表达式的返回值

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ExecuteJS",
  "expression": "var result = 1 + 2; result;",
  "context": 0
}
```

---

### ExecuteMVEL — 执行 MVEL 脚本
执行一段 MVEL 表达式，可在指定的协程上下文中运行。MVEL 是一种基于 Java 的表达式语言。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| expression | string | MVEL 表达式/脚本代码 |
| context | CoroutineContext | 执行的协程上下文 |

> CoroutineContext 枚举: `Default=0` 默认, `IO=1` IO 线程, `UI=2` 主线程

**上下文变量：**
- `{mvelRet}` — MVEL 表达式的返回值

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ExecuteMVEL",
  "expression": "import java.util.Date; new Date().toString()",
  "context": 0
}
```

---

### RemoteExecuteMVEL — 远程执行 MVEL 脚本
定义一个可远程触发的 MVEL 脚本，带有标题、描述和图标元信息。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 脚本标题 |
| description | string | 脚本描述 |
| icon | string | 图标名称 |
| expression | string | MVEL 表达式/脚本代码 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.RemoteExecuteMVEL",
  "title": "清除缓存",
  "description": "清除所有应用缓存",
  "icon": "delete_sweep",
  "expression": "context.clearAllCache()"
}
```

---

## 网络

### HttpRequest — HTTP 请求
发送 HTTP/HTTPS 请求，支持多种请求方法、自定义请求头、请求体，以及多种响应适配器。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| url | string | 请求 URL，支持变量引用 |
| method | HttpRequestMethod | 请求方法 |
| headers | repeated HttpRequestHeader | 请求头列表 |
| requestBody | Any | 请求体（可选） |
| adapter | Any | 响应适配器 |
| withCookieJar | bool | 是否启用 Cookie 管理 |
| trustAllCerts | bool | 是否信任所有 SSL 证书 |
| executeInAppProcess | bool | 是否在应用进程中执行 |

> HttpRequestMethod 枚举: `GET=0`, `POST=1`, `PUT=2`, `PATCH=3`, `DELETE=4`, `HEAD=5`  
> HttpRequestHeader: `key`(string) 请求头名, `value`(string) 请求头值  
> 请求体类型:
> - `HttpRequestBodyJson`: `json`(string) JSON 格式请求体
> - `HttpRequestBodyForm`: `items`(repeated HttpRequestBodyFormItem) 表单项列表；HttpRequestBodyFormItem: `key`(string), `value`(string)
>
> 响应适配器类型:
> - `HttpRequestRawAdapter`: 原始响应 → 上下文变量 `{httpRequestRet}` 包含完整响应
> - `HttpRequestJsonMapAdapter`: `expressions`(repeated string) JSONPath 表达式列表 → 上下文变量 `{httpRequestRet1}`, `{httpRequestRet2}`...
> - `HttpRequestHeaderBodyJsonMapAdapter`: `expressions`(repeated string) 表达式列表 → 上下文变量 `{httpRequestRet1}`, `{httpRequestRet2}`...

**上下文变量：**
- 使用 `HttpRequestRawAdapter` 时: `{httpRequestRet}` — 原始响应内容
- 使用 `HttpRequestJsonMapAdapter` 时: `{httpRequestRet1}`, `{httpRequestRet2}`... — 各表达式提取的值

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.HttpRequest",
  "url": "https://api.example.com/data",
  "method": 0,
  "headers": [
    {"key": "Content-Type", "value": "application/json"}
  ],
  "adapter": {"@type": "type.googleapis.com/shortx.HttpRequestRawAdapter"},
  "withCookieJar": false,
  "trustAllCerts": false
}
```

---

### WebSocketConnect — WebSocket 连接
建立 WebSocket 连接，并为各个生命周期事件绑定回调动作。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| url | string | WebSocket 服务器 URL |
| onOpen | repeated Any | 连接建立时执行的动作列表 |
| onMessage | repeated Any | 收到消息时执行的动作列表 |
| onClosed | repeated Any | 连接关闭时执行的动作列表 |
| onFailure | repeated Any | 连接失败时执行的动作列表 |

**上下文变量：**
- `{wsMessage}` — 收到的 WebSocket 消息内容
- `{wsReason}` — 关闭原因
- `{wsEvent}` — 当前事件类型（WebSocketEvent: `WS_OPEN=0`, `WS_MESSAGE=1`, `WS_CLOSED=2`, `WS_FAILURE=3`）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WebSocketConnect",
  "url": "wss://echo.websocket.org",
  "onOpen": [],
  "onMessage": [],
  "onClosed": [],
  "onFailure": []
}
```

---

### WebSocketSend — WebSocket 发送消息
通过已建立的 WebSocket 连接发送消息。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| url | string | WebSocket 连接 URL（标识连接） |
| message | string | 要发送的消息内容 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WebSocketSend",
  "url": "wss://echo.websocket.org",
  "message": "Hello WebSocket"
}
```

---

### DownloadFile — 下载文件
从指定 URL 下载文件到本地。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| subject | DownloadSubject | 下载配置 |

> DownloadSubject: `title`(string) 下载标题, `description`(string) 下载描述, `url`(string) 文件下载 URL, `fileName`(string) 保存的文件名

**上下文变量：**
- `{isDownloadSuccess}` — 下载是否成功（boolean）
- `{downloadFileUri}` — 下载文件的 URI
- `{downloadFilePath}` — 下载文件的本地路径

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.DownloadFile",
  "subject": {
    "title": "下载文件",
    "description": "从服务器下载配置文件",
    "url": "https://example.com/file.zip",
    "fileName": "file.zip"
  }
}
```

---

### SendSMS — 发送短信
通过指定 SIM 卡槽发送短信。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| slotId | int32 | SIM 卡槽 ID（0 或 1） |
| message | string | 短信内容，支持变量引用 |
| to | string | 接收方电话号码 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.SendSMS",
  "slotId": 0,
  "message": "这是一条测试短信",
  "to": "10086"
}
```

---

### WebDavList — WebDAV 列出目录
列出 WebDAV 服务器上指定 URL 下的文件和目录。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| profileId | string | WebDAV 配置文件 ID |
| url | string | WebDAV 资源 URL |
| depth | string | 遍历深度 |

**上下文变量：**
- `{webdavPaths}` — 文件路径列表
- `{webdavNames}` — 文件名列表

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WebDavList",
  "profileId": "profile1",
  "url": "https://dav.example.com/files/",
  "depth": "1"
}
```

---

### WebDavGet — WebDAV 下载文件
从 WebDAV 服务器下载文件到本地。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| profileId | string | WebDAV 配置文件 ID |
| url | string | 文件的 WebDAV URL |
| headers | repeated HttpRequestHeader | 额外的请求头 |
| destPath | string | 本地保存路径 |

**上下文变量：**
- `{webdavGetPath}` — 下载后的本地文件路径

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WebDavGet",
  "profileId": "profile1",
  "url": "https://dav.example.com/files/backup.zip",
  "destPath": "/sdcard/Download/backup.zip"
}
```

---

### WebDavPut — WebDAV 上传文件
将本地文件上传到 WebDAV 服务器。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| profileId | string | WebDAV 配置文件 ID |
| url | string | 目标 WebDAV URL |
| localFilePath | string | 本地文件路径 |
| contentType | string | 文件 MIME 类型（如 "application/octet-stream"） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WebDavPut",
  "profileId": "profile1",
  "url": "https://dav.example.com/files/upload.zip",
  "localFilePath": "/sdcard/Download/upload.zip",
  "contentType": "application/octet-stream"
}
```

---

## 媒体与音频

### MediaPlayback — 媒体播放控制
控制当前媒体的播放状态（播放、暂停、下一曲、上一曲等）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| action | MediaPlaybackAction | 播放控制动作 |

> MediaPlaybackAction 枚举: `Play=0` 播放, `Pause=1` 暂停, `SkipToNext=2` 下一曲, `SkipToPrevious=3` 上一曲, `FastForward=4` 快进, `Rewind=5` 倒退, `Stop=6` 停止

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.MediaPlayback",
  "action": 0
}
```

---

### TTS — 文字转语音
将文本转换为语音进行播放。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 要朗读的文本内容，支持变量引用 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.TTS",
  "text": "当前温度 25 度"
}
```

---

### AudioRecording — 开始录音
开始录制音频，可选择音频源（麦克风、系统内部音频或两者混合）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| src | AudioSource | 音频来源 |
| fileNamePrefix | string | 录音文件名前缀 |

> AudioSource 枚举: `Mic=0` 麦克风, `Internal=1` 系统内部音频, `MicAndInternal=2` 麦克风和系统内部音频混合

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.AudioRecording",
  "src": 0,
  "fileNamePrefix": "recording_"
}
```

---

### StopAudioRecording — 停止录音
停止当前进行中的录音。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.StopAudioRecording"
}
```

---

### TakePhoto — 拍照
使用摄像头拍摄一张照片并保存到指定路径。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| targetFilePath | string | 照片保存路径 |

**上下文变量：**
- `{photoFilePath}` — 照片文件的本地路径
- `{photoFileUri}` — 照片文件的 URI

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.TakePhoto",
  "targetFilePath": "/sdcard/DCIM/auto_photo.jpg"
}
```

---

### AdjustVolume — 调节音量
调节设备音量，支持升高、降低、静音、取消静音、切换静音。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| direction | VolumeDirection | 音量调节方向 |
| showUI | bool | 是否显示系统音量调节 UI |

> VolumeDirection 枚举: `ADJUST_SAME=0` 保持不变（仅显示UI）, `ADJUST_RAISE=1` 提高, `ADJUST_LOWER=-1` 降低, `ADJUST_MUTE=-100` 静音, `ADJUST_UNMUTE=100` 取消静音, `ADJUST_TOGGLE_MUTE=101` 切换静音

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.AdjustVolume",
  "direction": 1,
  "showUI": true
}
```

---

### SetVolume — 设置音量
将指定音频流的音量直接设置为目标值。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| type | int32 | 音频流类型（Android AudioManager 流类型：0=VOICE_CALL, 1=SYSTEM, 2=RING, 3=MUSIC, 4=ALARM, 5=NOTIFICATION） |
| index | int32 | 目标音量级别 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.SetVolume",
  "type": 3,
  "index": 10
}
```

---

### Vibrate — 振动
使设备振动，可自定义三段振动时长的模式。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| vib1 | int32 | 第一段振动时长（毫秒） |
| vib2 | int32 | 第二段振动时长（毫秒） |
| vib3 | int32 | 第三段振动时长（毫秒） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.Vibrate",
  "vib1": 200,
  "vib2": 100,
  "vib3": 200
}
```

---

### PlayRingtone — 播放铃声
播放系统铃声。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ringtone | Ringtone | 铃声配置 |

> Ringtone: `title`(string) 铃声名称, `uri`(string) 铃声 URI, `type`(int32) 铃声类型（1=RINGTONE, 2=NOTIFICATION, 4=ALARM）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.PlayRingtone",
  "ringtone": {
    "title": "默认通知铃声",
    "uri": "content://settings/system/notification_sound",
    "type": 2
  }
}
```

---

### RequestAudioFocus — 请求/释放音频焦点
请求或释放音频焦点，可用于暂停其他应用的音频播放。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| isRequest | bool | true 表示请求音频焦点，false 表示释放音频焦点 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.RequestAudioFocus",
  "isRequest": true
}
```

---

### ContinuousAdjustVolume — 连续调节音量
启动连续音量调节模式（通常与手势配合使用），支持指定音频流类型和灵敏度。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| streamType | int32 | 音频流类型（同 SetVolume 的 type 字段） |
| sensitivityScale | float | 灵敏度缩放比例（>1 更灵敏，<1 更迟钝） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ContinuousAdjustVolume",
  "streamType": 3,
  "sensitivityScale": 1.0
}
```

---

## 屏幕与显示

### TakeScreenshot — 截屏
截取当前屏幕的截图。

**参数：** 无

**上下文变量：**
- `{screenshotFilePath}` — 截图文件的本地路径
- `{screenshotFileUri}` — 截图文件的 URI

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.TakeScreenshot"
}
```

---

### AreaScreenshot — 区域截屏
截取用户选择的屏幕区域。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| themeMode | UiThemeMode | 选择界面的主题模式 |

**上下文变量：**
- `{screenshotFilePath}` — 截图文件的本地路径
- `{screenshotFileUri}` — 截图文件的 URI

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.AreaScreenshot",
  "themeMode": 0
}
```

---

### SelectScreenArea — 选择屏幕区域
弹出选择界面让用户框选一个屏幕区域，返回区域的坐标信息。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| themeMode | UiThemeMode | 选择界面的主题模式 |

**上下文变量：**
- `{rectLeft}` — 区域左边界坐标
- `{rectTop}` — 区域上边界坐标
- `{rectRight}` — 区域右边界坐标
- `{rectBottom}` — 区域下边界坐标
- `{rectFlattenToString}` — 区域坐标的扁平化字符串表示

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.SelectScreenArea",
  "themeMode": 0
}
```

---

### SetWallpaper — 设置壁纸
将指定图片设置为设备壁纸。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| fileUrl | string | 图片路径（content:// URI 或本地文件路径） |
| crop | bool | 是否裁剪 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.SetWallpaper",
  "fileUrl": "/sdcard/Pictures/wallpaper.jpg",
  "crop": true
}
```

---

### WakeupScreen — 唤醒屏幕
点亮设备屏幕。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WakeupScreen"
}
```

---

### SleepScreen — 熄灭屏幕
关闭设备屏幕（不锁定）。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.SleepScreen"
}
```

---

### LockDeviceNow — 立即锁定设备
立即锁定设备（关闭屏幕并需要解锁才能使用）。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.LockDeviceNow"
}
```

---

### ContinuousAdjustBrightness — 连续调节亮度
启动连续亮度调节模式（通常与手势配合使用），支持自定义灵敏度和亮度范围。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| sensitivityScale | float | 灵敏度缩放比例 |
| minValue | int32 | 最小亮度值 |
| maxValue | int32 | 最大亮度值 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ContinuousAdjustBrightness",
  "sensitivityScale": 1.0,
  "minValue": 0,
  "maxValue": 255
}
```

---

## 输入与手势

### InputText — 输入文本
在当前焦点的文本框中输入文本内容。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 要输入的文本，支持变量引用 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.InputText",
  "text": "Hello World"
}
```

---

### InputTap — 模拟点击
在屏幕指定坐标位置模拟一次点击操作。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| xs | string | X 坐标（字符串形式，支持变量引用） |
| ys | string | Y 坐标（字符串形式，支持变量引用） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.InputTap",
  "xs": "540",
  "ys": "960"
}
```

---

### InputSwipe — 模拟滑动
在屏幕上模拟从起点到终点的滑动操作。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| startXS | string | 起始 X 坐标（字符串，支持变量） |
| startYS | string | 起始 Y 坐标（字符串，支持变量） |
| endXS | string | 结束 X 坐标（字符串，支持变量） |
| endYS | string | 结束 Y 坐标（字符串，支持变量） |
| swipeTimeS | string | 滑动持续时间（毫秒，字符串，支持变量） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.InputSwipe",
  "startXS": "540",
  "startYS": "1500",
  "endXS": "540",
  "endYS": "500",
  "swipeTimeS": "300"
}
```

---

### FindAndClickViewByText — 按文本查找并点击控件
在屏幕上查找包含指定文本的控件并点击它。支持正则匹配、OCR 识别和超时等待。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 要查找的文本（可以是正则表达式） |
| isRegex | bool | 是否使用正则表达式匹配 |
| timeout | int64 | 查找超时时间（毫秒），超时后放弃 |
| rect | Rect | 限定搜索区域（left, top, right, bottom） |
| method | FindTextMethod | 查找方法 |

> FindTextMethod 枚举: `FTM_UI_AUTO=0` 使用无障碍服务（UIAutomator）, `FTM_OCR=1` 使用 OCR 识别, `FTM_UI_AUTO_OCR=2` 先尝试无障碍，失败后使用 OCR

**上下文变量：**
- `{matchedViewText}` — 匹配到的控件文本
- `{matchedViewId}` — 匹配到的控件资源 ID
- `{sourceNodeId}` — 源节点 ID
- `{windowId}` — 窗口 ID

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.FindAndClickViewByText",
  "text": "确定",
  "isRegex": false,
  "timeout": 5000,
  "method": 0
}
```

---

### FindAndClickViewById — 按 ID 查找并点击控件
在屏幕上查找具有指定资源 ID 的控件并点击它。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| viewId | string | 控件资源 ID（如 "com.example:id/button_ok"） |
| isRegex | bool | 是否使用正则表达式匹配 |
| timeout | int64 | 查找超时时间（毫秒） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.FindAndClickViewById",
  "viewId": "com.example:id/confirm_button",
  "isRegex": false,
  "timeout": 5000
}
```

---

### FindAndClickMatchedView — 点击已匹配的控件
点击由前序条件（如 UIContains 条件）已经匹配到的控件。无需额外参数。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.FindAndClickMatchedView"
}
```

---

### GetTextFromScreenNode — 获取控件文本
获取屏幕上指定节点 ID 的控件的文本内容。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| nodeId | string | 控件节点 ID |

**上下文变量：**
- `{textOfTheView}` — 控件的文本内容

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.GetTextFromScreenNode",
  "nodeId": "node_123"
}
```

---

### InjectKeyCode — 注入按键
模拟注入一个按键事件，支持长按和双击。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| keyCode | int32 | Android KeyEvent 键码（如 3=HOME, 4=BACK, 24=VOLUME_UP, 25=VOLUME_DOWN, 26=POWER 等） |
| longpress | bool | 是否长按 |
| doublepress | bool | 是否双击 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.InjectKeyCode",
  "keyCode": 4,
  "longpress": false,
  "doublepress": false
}
```

---

### InjectCombineKeyCode — 注入组合按键
模拟注入组合按键（同时按下多个键）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| keyCode | repeated int32 | 同时按下的键码列表 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.InjectCombineKeyCode",
  "keyCode": [113, 45]
}
```

---

### StartGestureRecording — 开始录制手势
开始录制用户的手势操作（触摸轨迹），用于后续回放。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.StartGestureRecording"
}
```

---

### StopGestureRecording — 停止录制手势
停止当前进行中的手势录制。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.StopGestureRecording"
}
```

---

### ToggleGestureRecording — 切换手势录制状态
如果正在录制手势则停止，如果没有录制则开始录制。

**参数：** 无

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ToggleGestureRecording"
}
```

---

### InjectGestureRecording — 回放录制的手势
回放之前录制的手势操作。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| gestureId | string | 手势录制记录的 ID |
| speed | float | 回放速度（1.0 为原速，>1 加速，<1 减速） |
| showGesturePathView | bool | 是否在屏幕上显示手势路径 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.InjectGestureRecording",
  "gestureId": "gesture_001",
  "speed": 1.0,
  "showGesturePathView": false
}
```

---

### ContinuousGesturePointer — 连续手势指针
启动连续手势指针模式，通常配合触控板或手势区域使用，将手势转换为屏幕上的指针移动和点击。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| sensitivityScale | float | 灵敏度缩放比例 |
| releaseButton | GesturePointerReleaseButton | 抬起手指时触发的按钮 |
| dragButton | GesturePointerDragButton | 拖动时触发的按钮 |
| dragHoldDurationMs | int32 | 长按多久后进入拖动模式（毫秒） |
| scrollMode | GesturePointerScrollMode | 滚动模式 |
| scrollScale | float | 滚动缩放比例 |
| cancelRegionRadiusDp | int32 | 取消区域半径（dp） |
| enableCenterActionSwitch | bool | 是否启用中心区域动作切换 |

> GesturePointerReleaseButton 枚举: `None=0` 无操作, `Primary=1` 主键点击, `Secondary=2` 次键点击, `Touch=3` 触摸点击  
> GesturePointerDragButton 枚举: `None=0` 无操作, `Primary=1` 主键拖动, `Secondary=2` 次键拖动  
> GesturePointerScrollMode 枚举: `None=0` 不滚动, `Vertical=1` 垂直滚动, `Horizontal=2` 水平滚动, `Both=3` 双向滚动

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ContinuousGesturePointer",
  "sensitivityScale": 1.0,
  "releaseButton": 1,
  "dragButton": 1,
  "dragHoldDurationMs": 500,
  "scrollMode": 1,
  "scrollScale": 1.0,
  "cancelRegionRadiusDp": 20,
  "enableCenterActionSwitch": false
}
```

---

### PerformContextMenuAction — 执行上下文菜单操作
对当前焦点的文本执行上下文菜单操作（全选、复制、粘贴等）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| action | ContextMenuAction | 上下文菜单操作类型 |

> ContextMenuAction 枚举: `SelectAll=0` 全选, `Cut=1` 剪切, `Copy=2` 复制, `Paste=3` 粘贴, `Undo=4` 撤销, `Redo=5` 重做, `StartSelectingText=6` 开始选择文本, `StopSelectingText=7` 停止选择文本, `CopyUrl=8` 复制 URL

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.PerformContextMenuAction",
  "action": 2
}
```

---

## 定位

### GetCurrentLocationInfo — 获取当前位置信息
获取设备的当前地理位置信息（经纬度、精度等）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| providerPreference | CurrentLocationProviderPreference | 定位提供者偏好 |
| timeoutMillis | int64 | 超时时间（毫秒） |

> CurrentLocationProviderPreference 枚举: `Auto=0` 自动选择, `NetworkFirst=1` 优先使用网络定位, `GpsFirst=2` 优先使用 GPS 定位

**上下文变量：**
- `{latitude}` — 纬度
- `{longitude}` — 经度
- `{provider}` — 定位提供者名称
- `{accuracy}` — 精度（米）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.GetCurrentLocationInfo",
  "providerPreference": 0,
  "timeoutMillis": 10000
}
```

---

### GetCurrentLocationAddress — 获取当前位置地址
获取设备当前位置的详细地址信息（反地理编码）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| providerPreference | CurrentLocationProviderPreference | 定位提供者偏好 |
| timeoutMillis | int64 | 超时时间（毫秒） |

> CurrentLocationProviderPreference 枚举: `Auto=0`, `NetworkFirst=1`, `GpsFirst=2`

**上下文变量：**
- `{addressLine}` — 完整地址行
- `{countryName}` — 国家名称
- `{adminArea}` — 行政区（省/州）
- `{subAdminArea}` — 次级行政区（市）
- `{locality}` — 地区（区/县）
- `{subLocality}` — 次级地区（街道）
- `{thoroughfare}` — 街道名
- `{subThoroughfare}` — 门牌号
- `{postalCode}` — 邮政编码
- `{featureName}` — 地标名称

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.GetCurrentLocationAddress",
  "providerPreference": 0,
  "timeoutMillis": 10000
}
```

---

### MapNav — 地图导航
调用第三方地图应用（百度地图或高德地图）发起导航。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| loc | Location | 目标位置坐标 |
| poi | string | 目标地点名称 |
| app | MapApp | 地图应用 |
| navType | NavType | 导航类型 |

> Location: `latitude`(string) 纬度, `longitude`(string) 经度  
> MapApp 枚举: `Baidu=0` 百度地图, `Gaode=1` 高德地图  
> NavType 枚举: `Car=0` 驾车导航, `Ride=1` 骑行导航

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.MapNav",
  "loc": {"latitude": "39.9042", "longitude": "116.4074"},
  "poi": "天安门",
  "app": 1,
  "navType": 0
}
```

---

### MapQueryBus — 地图查询公交
调用第三方地图应用查询公交线路。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| city | string | 城市名称 |
| bus | string | 公交线路号 |
| app | MapApp | 地图应用 |

> MapApp 枚举: `Baidu=0` 百度地图, `Gaode=1` 高德地图

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.MapQueryBus",
  "city": "北京",
  "bus": "1路",
  "app": 1
}
```

---

## QR 码与图像

### ParseQRCode — 解析二维码
解析图片中的二维码内容。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| imagePath | string | 包含二维码的图片路径 |

**上下文变量：**
- `{qrCodeText}` — 二维码解析出的文本内容

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ParseQRCode",
  "imagePath": "/sdcard/Pictures/qrcode.png"
}
```

---

### GenerateQRCode — 生成二维码
根据文本内容生成二维码图片。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 要编码为二维码的文本内容 |
| targetDirPath | string | 二维码图片保存目录 |

**上下文变量：**
- `{qrCodeFilePath}` — 生成的二维码图片路径
- `{qrCodeFileUri}` — 生成的二维码图片 URI

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.GenerateQRCode",
  "text": "https://example.com",
  "targetDirPath": "/sdcard/Pictures/"
}
```

---

### OcrDetect — OCR 文字识别
对屏幕区域或图片进行光学字符识别（OCR），提取文本内容。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| rectSrc | Any | 识别区域来源 |
| threads | int32 | OCR 识别使用的线程数 |
| useSlim | bool | 是否使用轻量模型 |
| separator | string | 识别结果的分隔符 |
| output_type | OcrDetectOutputType | 输出类型 |

> 区域来源类型:
> - `RectSourceRect`: `rect`(Rect{left,top,right,bottom}) 指定矩形区域
> - `RectSourcePath`: `path`(string) 从图片文件路径
> - `RectSourceSelectScreenArea`: 让用户手动选择区域
> - `RectSourceFullScreen`: 全屏识别
>
> OcrDetectOutputType 枚举: `Json=0` JSON 格式输出, `Text=1` 纯文本输出

**上下文变量：**
- `{ocrResult}` — OCR 识别结果（格式取决于 output_type）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.OcrDetect",
  "rectSrc": {"@type": "type.googleapis.com/shortx.RectSourceFullScreen"},
  "threads": 4,
  "useSlim": false,
  "separator": "\n",
  "output_type": 1
}
```

---

### FindImagePosition — 查找图片位置
在图片中查找模板图片的位置（模板匹配）。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| template | Any | 模板图片（要查找的小图） |
| image | Any | 源图片（在其中查找的大图） |
| output_type | FindImagePositionOutputType | 输出类型 |

> 图片来源类型:
> - `ImageSourceScreenshot`: 截取当前屏幕
> - `ImageSourcePath`: `path`(string) 本地图片路径
> - `ImageSourceBase64`: `base64`(string) Base64 编码的图片
>
> FindImagePositionOutputType 枚举: `Text=0` 文本输出, `Json=1` JSON 输出

**上下文变量：**
- `{pointX}` — 匹配位置的 X 坐标
- `{pointY}` — 匹配位置的 Y 坐标
- `{isImageFound}` — 是否找到图片（boolean）
- `{findImageJson}` — JSON 格式的匹配结果

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.FindImagePosition",
  "template": {"@type": "type.googleapis.com/shortx.ImageSourcePath", "path": "/sdcard/template.png"},
  "image": {"@type": "type.googleapis.com/shortx.ImageSourceScreenshot"},
  "output_type": 0
}
```

---

### FindPointsByColor — 按颜色查找像素点
在图片中查找指定颜色的像素点位置。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| config | FindPointsByColorConfig | 查找配置 |

> FindPointsByColorConfig: `image`(Any) 图片来源, `color`(int32) 目标颜色值（ARGB 整数）, `threshold`(int32) 颜色匹配阈值（容差）, `rect`(Rect) 搜索区域限制, `output_type`(FindPointsByColorOutputType) 输出类型  
> FindPointsByColorOutputType 枚举: `Text=0` 文本输出, `Json=1` JSON 输出

**上下文变量：**
- `{pointX}` — 找到的点 X 坐标
- `{pointY}` — 找到的点 Y 坐标
- `{isColorFound}` — 是否找到指定颜色（boolean）
- `{findPointsByColorJson}` — JSON 格式的查找结果

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.FindPointsByColor",
  "config": {
    "image": {"@type": "type.googleapis.com/shortx.ImageSourceScreenshot"},
    "color": -65536,
    "threshold": 10,
    "output_type": 0
  }
}
```

---

### FindPointsByColorAndClick — 按颜色查找像素点并点击
在图片中查找指定颜色的像素点并点击该位置。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| config | FindPointsByColorConfig | 查找配置（同 FindPointsByColor） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.FindPointsByColorAndClick",
  "config": {
    "image": {"@type": "type.googleapis.com/shortx.ImageSourceScreenshot"},
    "color": -16711936,
    "threshold": 15,
    "output_type": 0
  }
}
```

---

## 文本处理

### TextProcessing — 文本处理
对文本进行一系列处理操作（截断、去空格、转拼音等），按顺序依次应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 要处理的原始文本，支持变量引用 |
| processors | repeated Any | 文本处理器列表（按顺序执行） |

> 处理器类型:
> - `TextProcessingTrimLength`: `length`(string) 截断长度（保留前 N 个字符）
> - `TextProcessingTrimSpace`: 去除前后空白字符
> - `TextProcessingToPinyin`: `length`(string) 转拼音后的截断长度

**上下文变量：**
- `{textProcessResult}` — 处理后的文本结果

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.TextProcessing",
  "text": "  Hello World  ",
  "processors": [
    {"@type": "type.googleapis.com/shortx.TextProcessingTrimSpace"},
    {"@type": "type.googleapis.com/shortx.TextProcessingTrimLength", "length": "5"}
  ]
}
```

---

### MatchRegex — 正则匹配
对字符串执行正则表达式匹配，返回匹配结果。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| string | string | 要匹配的字符串，支持变量引用 |
| regex | string | 正则表达式 |
| matchOptions | RegexMatchOptions | 匹配模式 |

> RegexMatchOptions 枚举: `Match=0` 完全匹配（整个字符串必须匹配）, `ContainsMatchIn=1` 包含匹配（字符串中包含匹配即可）

**上下文变量：**
- `{isMatch}` — 是否匹配成功（boolean）
- `{matchResult}` — 匹配到的内容

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.MatchRegex",
  "string": "订单号: 20230101001",
  "regex": "\\d+",
  "matchOptions": 1
}
```

---

### ReplaceRegex — 正则替换
使用正则表达式对字符串进行查找替换。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| string | string | 原始字符串，支持变量引用 |
| regex | string | 匹配正则表达式 |
| replacement | string | 替换文本（支持正则捕获组引用如 $1, $2） |

**上下文变量：**
- `{replaceResult}` — 替换后的字符串

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ReplaceRegex",
  "string": "电话: 13812345678",
  "regex": "(\\d{3})\\d{4}(\\d{4})",
  "replacement": "$1****$2"
}
```

---

## 剪贴板

### ReadClipboard — 读取剪贴板
读取系统剪贴板中的当前内容。

**参数：** 无

**上下文变量：**
- `{clipboardContent}` — 剪贴板中的文本内容

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ReadClipboard"
}
```

---

### WriteClipboard — 写入剪贴板
向系统剪贴板写入文本或文件。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 要写入的文本内容 |
| filePath | string | 要写入的文件路径（与 text 二选一） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.WriteClipboard",
  "text": "复制的内容"
}
```

---

## 其他动作

### SetRuleEnabled — 设置指令启用状态
启用或禁用指定的自动指令。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| ruleId | string | 自动指令的 ID |
| isEnable | bool | true 启用, false 禁用 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.SetRuleEnabled",
  "ruleId": "rule_abc123",
  "isEnable": true
}
```

---

### ExecuteFunction — 执行函数
调用一个已定义的 ShortX 函数，可传入参数。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| functionId | string | 函数的 ID |
| funcParameterInputs | repeated FuncParameterInput | 函数参数列表 |

> FuncParameterInput: `name`(string) 参数名, `value`(string) 参数值

**上下文变量：**
- `{funcReturnValue}` — 函数的返回值（通过 resultContextDataKey 自定义键名）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ExecuteFunction",
  "functionId": "func_001",
  "funcParameterInputs": [
    {"name": "param1", "value": "hello"}
  ]
}
```

---

### SetFunctionReturnValue — 设置函数返回值
在函数体内部设置函数的返回值。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| value | string | 返回值（字符串形式） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.SetFunctionReturnValue",
  "value": "result_data"
}
```

---

### FromDA — 执行一键指令
调用一个已定义的一键指令（DirectAction），可传入参数。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| daId | string | 一键指令的 ID |
| funcParameterInputs | repeated FuncParameterInput | 参数列表 |

> FuncParameterInput: `name`(string) 参数名, `value`(string) 参数值

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.FromDA",
  "daId": "da_toggle_wifi",
  "funcParameterInputs": []
}
```

---

### ShareContent — 分享内容
调用系统分享功能，分享文本或文件到其他应用。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| text | string | 要分享的文本内容 |
| filePath | string | 要分享的文件路径 |
| mimeType | string | MIME 类型（如 "text/plain", "image/png"） |
| chooserTitle | string | 分享选择器的标题 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ShareContent",
  "text": "分享一段文字",
  "mimeType": "text/plain",
  "chooserTitle": "分享到"
}
```

---

### OpenUrl — 打开 URL
在浏览器或指定应用中打开 URL。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| url | string | 要打开的 URL |
| browserPkg | string | 指定浏览器包名（为空则使用默认浏览器） |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.OpenUrl",
  "url": "https://www.example.com",
  "browserPkg": ""
}
```

---

### ExportBackup — 导出备份
将 ShortX 的配置和数据导出为备份文件。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| destDir | string | 备份文件的保存目录 |

**上下文变量：**
- `{backupFilePath}` — 备份文件的完整路径

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.ExportBackup",
  "destDir": "/sdcard/Download/"
}
```

---

### GetScreenOnTime — 获取亮屏时长
获取设备的亮屏时长。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| from | ScreenOnTimeStartFrom | 计算起点 |

> ScreenOnTimeStartFrom 枚举: `LastScreenOff=0` 从上次灭屏开始计算, `SystemReady=1` 从系统启动完成开始计算

**上下文变量：**
- `{screenOnTime}` — 亮屏时长（毫秒）

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.GetScreenOnTime",
  "from": 0
}
```

---

### AppShortcut — 应用快捷方式
创建或启动应用快捷方式。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| intentUri | string | Intent URI（标识快捷方式目标） |
| label | string | 快捷方式显示名称 |

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.AppShortcut",
  "intentUri": "intent:#Intent;component=com.example/.MainActivity;end",
  "label": "打开示例应用"
}
```

---

### StopService — 停止服务
停止指定的 Android 后台服务。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| services | repeated AppComponent | 要停止的服务组件列表 |

> AppComponent: `pkg`(AppPkg{pkgName,userId}) 应用包信息, `className`(string) 服务类名

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.StopService",
  "services": [
    {"pkg": {"pkgName": "com.example", "userId": 0}, "className": "com.example.MyService"}
  ]
}
```

---

### StartService — 启动服务
启动一个 Android 服务。

**参数：**
| 字段 | 类型 | 说明 |
|------|------|------|
| intent | AndroidIntent | 启动服务的 Intent |
| userId | int32 | 用户 ID |
| isForegroundService | bool | 是否作为前台服务启动 |

> AndroidIntent: `action`(string) Intent Action, `flags`(int32) Intent 标志, `pkgName`(string) 目标包名, `className`(string) 目标类名, `data`(string) Intent 数据, `extras`(repeated AndroidIntentExtra) 附加数据

**Proto：**
```json
{
  "@type": "type.googleapis.com/shortx.StartService",
  "intent": {
    "pkgName": "com.example",
    "className": "com.example.MyService"
  },
  "userId": 0,
  "isForegroundService": false
}
```
