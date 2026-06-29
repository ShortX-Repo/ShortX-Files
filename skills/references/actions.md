# 动作 (Action) 完整参考

动作定义触发且条件满足后"执行什么操作"。所有动作有公共字段：`id`、`customContextDataKey`、`isDisabled`、`actionOnError`（Continue/Break）、`note`。

## 流程控制

### IfThenElse — 条件分支
```json
{"@type": "type.googleapis.com/IfThenElse", "If": [条件列表], "IfActions": [满足时动作], "ElseActions": [不满足时动作], "_ifCondOp": "ALL", "customContextDataKey": {}, "id": "A-001"}
```
`_ifCondOp`：ALL/ANY/NONE/MVEL

### SwitchCase — 多分支选择
```json
{"@type": "type.googleapis.com/SwitchCase", "case": [{"conditions": [], "actions": [], "isBreak": true}], "deft": {"actions": []}, "customContextDataKey": {}, "id": "A-001"}
```

### ForEach — 循环
```json
{"@type": "type.googleapis.com/ForEach", "data": "{shellOut}", "delimiter": [","], "actions": [子动作], "actionAsyncMode": "ActionAsyncMode_Sync", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{foreachData}`（当前元素）、`{foreachIndex}`（当前索引）

### ForEachPkgSet — 遍历应用集合
```json
{"@type": "type.googleapis.com/ForEachPkgSet", "pkgSet": "集合名称", "action": [子动作], "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{loopAppPkgName}`、`{loopAppLabel}`、`{loopAppUserId}`

### WhileLoop — 当循环
```json
{"@type": "type.googleapis.com/WhileLoop", "conditions": [条件列表], "actions": [子动作], "condOp": "ALL", "delay": 1000, "repeatTimes": 10, "actionAsyncMode": "ActionAsyncMode_Sync", "customContextDataKey": {}, "id": "A-001"}
```
参数：`delay`（迭代间隔毫秒）、`repeatTimes`（0=无限）

### BreakActionExecute — 中断执行
```json
{"@type": "type.googleapis.com/BreakActionExecute", "scope": "BreakActionExecuteScope_Current", "customContextDataKey": {}, "id": "A-001"}
```
scope：BreakActionExecuteScope_Current/Parent/Root

### WaitUtilConditionMatch — 等待条件满足
```json
{"@type": "type.googleapis.com/WaitUtilConditionMatch", "condition": [条件列表], "conditionOp": "ALL", "timeoutStr": "10000", "quitEnabled": false, "customContextDataKey": {}, "id": "A-001"}
```

### Delay — 延迟
```json
{"@type": "type.googleapis.com/Delay", "timeString": "3", "timeUnit": "TimeUnit_S", "showCD": false, "useAlarm": false, "customContextDataKey": {}, "id": "A-001"}
```
timeUnit：TimeUnit_MS/TimeUnit_S/TimeUnit_M/TimeUnit_H/TimeUnit_D

### StopAllActions — 停止所有动作
```json
{"@type": "type.googleapis.com/StopAllActions", "customContextDataKey": {}, "id": "A-001"}
```

## 应用管理

### LaunchApp — 启动应用
```json
{"@type": "type.googleapis.com/LaunchApp", "appPkg": [{"pkgName": "com.example.app"}], "customContextDataKey": {}, "id": "A-001"}
```

### LaunchAppByPkg — 按包名启动应用
```json
{"@type": "type.googleapis.com/LaunchAppByPkg", "pkgName": "com.example.app", "userId": 0, "customContextDataKey": {}, "id": "A-001"}
```

### StopApp — 停止应用
```json
{"@type": "type.googleapis.com/StopApp", "appPkg": [{"pkgName": "com.example.app"}], "pkgSets": [], "customContextDataKey": {}, "id": "A-001"}
```

### SetAppEnabled — 启用/禁用应用
```json
{"@type": "type.googleapis.com/SetAppEnabled", "appPkg": [{"pkgName": "com.example.app"}], "pkgSets": [], "enable": false, "customContextDataKey": {}, "id": "A-001"}
```

### SetAppSuspend — 挂起/恢复应用
```json
{"@type": "type.googleapis.com/SetAppSuspend", "appPkg": [{"pkgName": "com.example.app"}], "pkgSets": [], "suspend": true, "customContextDataKey": {}, "id": "A-001"}
```

### RemoveTasks — 移除最近任务
```json
{"@type": "type.googleapis.com/RemoveTasks", "appPkg": [{"pkgName": "com.example.app"}], "pkgSets": [], "customContextDataKey": {}, "id": "A-001"}
```

### CloseActivity — 关闭 Activity
```json
{"@type": "type.googleapis.com/CloseActivity", "mode": "CloseActivityMode_Focused", "component": {"pkg": {"pkgName": "com.example.app"}, "className": "com.example.MainActivity"}, "customContextDataKey": {}, "id": "A-001"}
```

### KillProcessByName — 杀死进程
```json
{"@type": "type.googleapis.com/KillProcessByName", "processes": ["process_name"], "customContextDataKey": {}, "id": "A-001"}
```

### StartPreviousApp / StartNextApp / StartLastApp
```json
{"@type": "type.googleapis.com/StartPreviousApp", "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/StartNextApp", "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/StartLastApp", "customContextDataKey": {}, "id": "A-001"}
```

### GetAppInfo — 获取应用信息
```json
{"@type": "type.googleapis.com/GetAppInfo", "pkgName": "com.example.app", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{appLabel}`、`{versionCode}`、`{versionName}`、`{isRunning}`

## 系统开关

### SetWifiEnabled / ToggleWifi
```json
{"@type": "type.googleapis.com/SetWifiEnabled", "enable": true, "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/ToggleWifi", "customContextDataKey": {}, "id": "A-001"}
```

### SetBTEnabled / ToggleBT
```json
{"@type": "type.googleapis.com/SetBTEnabled", "enable": true, "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/ToggleBT", "customContextDataKey": {}, "id": "A-001"}
```

### SetLocationEnabled / ToggleLocation
```json
{"@type": "type.googleapis.com/SetLocationEnabled", "enable": true, "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/ToggleLocation", "customContextDataKey": {}, "id": "A-001"}
```

### SetDNDEnabled / ToggleDND — 勿扰模式
```json
{"@type": "type.googleapis.com/SetDNDEnabled", "enable": true, "customContextDataKey": {}, "id": "A-001"}
```

### SetFlashLightEnabled — 手电筒
```json
{"@type": "type.googleapis.com/SetFlashLightEnabled", "enable": true, "customContextDataKey": {}, "id": "A-001"}
```

### SetScreenTimeout — 屏幕超时
```json
{"@type": "type.googleapis.com/SetScreenTimeout", "timeoutMillis": 60000, "customContextDataKey": {}, "id": "A-001"}
```

### SetRingerMode — 铃声模式
```json
{"@type": "type.googleapis.com/SetRingerMode", "mode": "silent", "customContextDataKey": {}, "id": "A-001"}
```
mode：silent/vibrate/normal

### Toggle5G — 5G 开关
```json
{"@type": "type.googleapis.com/Toggle5G", "onOff": "OnOffToggle_On", "slotId": 0, "customContextDataKey": {}, "id": "A-001"}
```

### SetAPMModeEnabled — 飞行模式
```json
{"@type": "type.googleapis.com/SetAPMModeEnabled", "isEnable": true, "customContextDataKey": {}, "id": "A-001"}
```

### SetMasterSync — 主同步开关
```json
{"@type": "type.googleapis.com/SetMasterSync", "sync": "OnOffToggle_On", "customContextDataKey": {}, "id": "A-001"}
```

### ConnectWifi / DisconnectCurrentWifi
```json
{"@type": "type.googleapis.com/ConnectWifi", "ssid": "WiFi名称", "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/DisconnectCurrentWifi", "customContextDataKey": {}, "id": "A-001"}
```

### ClickTile — 点击磁贴
```json
{"@type": "type.googleapis.com/ClickTile", "tile": {}, "isLongClick": false, "customContextDataKey": {}, "id": "A-001"}
```

## 通知操作

### PostNotification — 发送通知
```json
{"@type": "type.googleapis.com/PostNotification", "title": "标题", "message": "内容", "isImportant": false, "smallIcon": "notifications", "vibrate": false, "sound": false, "button": [{"id": "btn1", "label": "按钮", "action": []}], "onGoing": false, "customContextDataKey": {}, "id": "A-001"}
```

### RemoveNotification — 移除通知
```json
{"@type": "type.googleapis.com/RemoveNotification", "notification": {"title": "", "contentText": "", "apps": [{"pkgName": "com.example.app"}]}, "customContextDataKey": {}, "id": "A-001"}
```

### ClickNotification — 点击通知
```json
{"@type": "type.googleapis.com/ClickNotification", "notification": {"title": "", "contentText": "", "apps": [{"pkgName": "com.example.app"}]}, "customContextDataKey": {}, "id": "A-001"}
```

### ShowPPN / RemovePPN — 弹出通知
```json
{"@type": "type.googleapis.com/ShowPPN", "title": "标题", "message": "内容", "icon": "", "vibrate": false, "sound": false, "button": [], "displayTimeSeconds": 5, "customContextDataKey": {}, "id": "A-001"}
```

## UI 交互

### ShowToast — Toast 消息
```json
{"@type": "type.googleapis.com/ShowToast", "message": "消息内容", "customContextDataKey": {}, "id": "A-001"}
```

### ShowAlertDialog — 对话框
```json
{"@type": "type.googleapis.com/ShowAlertDialog", "title": "标题", "message": "内容", "positive": "确认", "negative": "取消", "positiveActions": [], "negativeActions": [], "cancelable": true, "customContextDataKey": {}, "id": "A-001"}
```

### ShowMenuDialog — 菜单对话框
```json
{"@type": "type.googleapis.com/ShowMenuDialog", "title": "选择操作", "items": [{"title": "选项1", "clickActions": []}], "cancelable": true, "customContextDataKey": {}, "id": "A-001"}
```

### ShowTextFieldDialog — 输入框对话框
```json
{"@type": "type.googleapis.com/ShowTextFieldDialog", "title": "标题", "textFields": [{"placeholder": "请输入"}], "cancelable": true, "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{textFieldInput1}`、`{textFieldInput2}`...（不支持 customContextDataKey 重命名）

### ShowListDialog — 列表对话框
```json
{"@type": "type.googleapis.com/ShowListDialog", "title": "选择", "data": "{shellOut}", "delimiter": ["\n"], "isMultipleChoice": false, "dataType": "ShowListDialogDataType_String", "cancelable": true, "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{selectedListItem}`

### ShowChoiceDialog — 选择对话框
```json
{"@type": "type.googleapis.com/ShowChoiceDialog", "title": "选择", "choices": [{"label": "选项1", "value": "value1"}], "isMultipleChoice": false, "cancelable": true, "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{choices}`

### ShowDanmu — 弹幕
```json
{"@type": "type.googleapis.com/ShowDanmu", "text": "弹幕文字", "icon": "", "customContextDataKey": {}, "id": "A-001"}
```

### ShowStatusBarChip — 状态栏 Chip
```json
{"@type": "type.googleapis.com/ShowStatusBarChip", "text": "Chip文字", "icon": "", "clickAction": [], "longClickAction": [], "customContextDataKey": {}, "id": "A-001"}
```

### ShowOverlayButton — 悬浮窗按钮
```json
{"@type": "type.googleapis.com/ShowOverlayButton", "buttonSettings": [{"icon": "settings", "text": "按钮", "tapActions": [], "longPressActions": []}], "autoCollapse": false, "closeOnTouchOutside": false, "closeOnAction": false, "themeMode": "UiThemeMode_System", "customContextDataKey": {}, "id": "A-001"}
```

### ShowFloatWindow — 悬浮球
```json
{"@type": "type.googleapis.com/ShowFloatWindow", "buttonSettings": [{"icon": "settings", "text": "按钮", "tapActions": []}], "themeMode": "UiThemeMode_System", "customContextDataKey": {}, "id": "A-001"}
```

### ShowSideBar / ShowActionSidebar — 侧边栏
```json
{"@type": "type.googleapis.com/ShowSideBar", "buttonSettings": [{"icon": "settings", "text": "按钮", "tapActions": []}], "themeMode": "UiThemeMode_System", "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/ShowActionSidebar", "buttons": [{"icon": "settings", "text": "按钮", "tapActions": []}], "position": "ActionSidebarPosition_Right", "tag": "sidebar-1", "customContextDataKey": {}, "id": "A-001"}
```

### DisplayImage — 显示图片
```json
{"@type": "type.googleapis.com/DisplayImage", "imageUrl": "路径或URL", "scaleType": "IMAGE_SCALE_TYPE_FIT_CENTER", "themeMode": "UiThemeMode_System", "customContextDataKey": {}, "id": "A-001"}
```

### BiometricVerify — 生物识别验证
```json
{"@type": "type.googleapis.com/BiometricVerify", "title": "验证身份", "subTitle": "请验证指纹", "allowActions": [], "denyActions": [], "themeMode": "UiThemeMode_System", "customContextDataKey": {}, "id": "A-001"}
```

## 变量操作

### CreateGlobalVar — 创建全局变量
```json
{"@type": "type.googleapis.com/CreateGlobalVar", "globalVar": {"name": "变量名", "type": {"@type": "type.googleapis.com/StringVar"}}, "customContextDataKey": {}, "id": "A-001"}
```
类型：StringVar/Int64Var/BoolVar/StringListVar/Int64ListVar/BoolListVar

### WriteGlobalVar — 写入全局变量
```json
{"@type": "type.googleapis.com/WriteGlobalVar", "varName": "变量名", "valueAsString": "值", "op": "WriteGlobalVarOp_Override", "customContextDataKey": {}, "id": "A-001"}
```
op：Override/AppendToLast/AppendToFirst/DeleteValue/DeleteLast/DeleteFirst/RemoveAtIndex/Clear/Reverse/Shuffle/Plus1/Minus1/Invert/PlusDelta/MinusDelta

### DeleteGlobalVar — 删除全局变量
```json
{"@type": "type.googleapis.com/DeleteGlobalVar", "varName": "变量名", "customContextDataKey": {}, "id": "A-001"}
```

### AddToGlobalVar — 向列表变量添加元素
```json
{"@type": "type.googleapis.com/AddToGlobalVar", "varName": "列表变量名", "valueAsString": "新元素", "customContextDataKey": {}, "id": "A-001"}
```

### CreateLocalVar — 创建局部变量
```json
{"@type": "type.googleapis.com/CreateLocalVar", "localVar": {"name": "变量名", "type": {"@type": "type.googleapis.com/StringVar"}}, "customContextDataKey": {}, "id": "A-001"}
```

### WriteLocalVar — 写入局部变量
```json
{"@type": "type.googleapis.com/WriteLocalVar", "varName": "变量名", "valueAsString": "值", "customContextDataKey": {}, "id": "A-001"}
```

## 脚本执行

### ShellCommand — 执行 Shell 命令
```json
{"@type": "type.googleapis.com/ShellCommand", "command": "echo hello", "singleShot": false, "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{shellOut}`、`{shellErr}`、`{shellCode}`

### ExecuteJS — 执行 JavaScript
```json
{"@type": "type.googleapis.com/ExecuteJS", "expression": "var jsRet = 'Hello';", "context": "CoroutineContext_Default", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{jsRet}`
context：CoroutineContext_Default/CoroutineContext_IO/CoroutineContext_UI

### ExecuteMVEL — 执行 MVEL 表达式
```json
{"@type": "type.googleapis.com/ExecuteMVEL", "expression": "'Hello ' + {title}", "context": "CoroutineContext_Default", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{mvelRet}`

## 网络与通信

### HttpRequest — HTTP 请求
```json
{
  "@type": "type.googleapis.com/HttpRequest",
  "url": "https://api.example.com/data",
  "method": "GET",
  "headers": [{"key": "Content-Type", "value": "application/json"}],
  "requestBody": {
    "@type": "type.googleapis.com/HttpRequestBodyJson",
    "json": "{\"key\":\"value\"}"
  },
  "adapter": {
    "@type": "type.googleapis.com/HttpRequestRawAdapter"
  },
  "withCookieJar": false,
  "trustAllCerts": false,
  "executeInAppProcess": false,
  "customContextDataKey": {},
  "id": "A-001"
}
```

**请求体类型：**
- `HttpRequestBodyJson`：JSON 请求体，字段 `json`
- `HttpRequestBodyForm`：表单请求体，字段 `items`（键值对列表）

**响应适配器：**
- `HttpRequestRawAdapter`：原始响应 → `{httpRequestRet}`
- `HttpRequestJsonMapAdapter`：JSON 解析 → `{httpRequestRet1}`、`{httpRequestRet2}`...
  ```json
  {"@type": "type.googleapis.com/HttpRequestJsonMapAdapter", "expressions": ["temperature", "city"]}
  ```
- `HttpRequestHeaderBodyJsonMapAdapter`：Header+Body 解析
  ```json
  {"@type": "type.googleapis.com/HttpRequestHeaderBodyJsonMapAdapter", "expressions": ["body.token", "headers.Content_Type"]}
  ```

### WebSocketConnect — WebSocket 连接
```json
{"@type": "type.googleapis.com/WebSocketConnect", "url": "wss://example.com/ws", "onOpenActions": [], "onMessageActions": [], "onClosedActions": [], "onFailureActions": [], "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{wsMessage}`、`{wsReason}`、`{wsEvent}`

### WebSocketSend — WebSocket 发送
```json
{"@type": "type.googleapis.com/WebSocketSend", "message": "消息", "customContextDataKey": {}, "id": "A-001"}
```

### DownloadFile — 下载文件
```json
{"@type": "type.googleapis.com/DownloadFile", "subject": {"title": "下载", "url": "https://example.com/file.zip", "fileName": "file.zip"}, "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{isDownloadSuccess}`、`{downloadFileUri}`、`{downloadFilePath}`

### SendSMS — 发送短信
```json
{"@type": "type.googleapis.com/SendSMS", "slotId": 0, "message": "消息内容", "to": "13800000000", "customContextDataKey": {}, "id": "A-001"}
```

## 媒体与音频

### MediaPlayback — 媒体播放控制
```json
{"@type": "type.googleapis.com/MediaPlayback", "action": "MediaPlaybackAction_Play", "customContextDataKey": {}, "id": "A-001"}
```
action：Play/Pause/Next/Previous/FastForward/Rewind/Stop

### TTS — 文字转语音
```json
{"@type": "type.googleapis.com/TTS", "text": "朗读内容", "customContextDataKey": {}, "id": "A-001"}
```

### AudioRecording — 录音
```json
{"@type": "type.googleapis.com/AudioRecording", "src": "Mic", "fileNamePrefix": "recording", "customContextDataKey": {}, "id": "A-001"}
```

### TakePhoto — 拍照
```json
{"@type": "type.googleapis.com/TakePhoto", "targetFilePath": "/sdcard/photo.jpg", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{photoFilePath}`、`{photoFileUri}`

### AdjustVolume — 调节音量
```json
{"@type": "type.googleapis.com/AdjustVolume", "direction": "ADJUST_RAISE", "showUI": false, "customContextDataKey": {}, "id": "A-001"}
```
direction：ADJUST_RAISE/ADJUST_LOWER/ADJUST_MUTE/ADJUST_UNMUTE/ADJUST_TOGGLE_MUTE/ADJUST_SAME

### SetVolume — 设置音量
```json
{"@type": "type.googleapis.com/SetVolume", "streamType": "STREAM_MUSIC", "volume": 10, "customContextDataKey": {}, "id": "A-001"}
```

### Vibrate — 震动
```json
{"@type": "type.googleapis.com/Vibrate", "vib1": 100, "vib2": 0, "vib3": 0, "customContextDataKey": {}, "id": "A-001"}
```

## 屏幕与显示

### TakeScreenshot — 截图
```json
{"@type": "type.googleapis.com/TakeScreenshot", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{screenshotFilePath}`、`{screenshotFileUri}`

### AreaScreenshot — 区域截图
```json
{"@type": "type.googleapis.com/AreaScreenshot", "customContextDataKey": {}, "id": "A-001"}
```

### SelectScreenArea — 选择屏幕区域
```json
{"@type": "type.googleapis.com/SelectScreenArea", "themeMode": "UiThemeMode_System", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{rectLeft}`、`{rectTop}`、`{rectRight}`、`{rectBottom}`、`{rectFlattenToString}`

### ScreenFlash — 屏幕闪烁
```json
{"@type": "type.googleapis.com/ScreenFlash", "colorInt": "-65536", "times": "3", "customContextDataKey": {}, "id": "A-001"}
```

### SetWallpaper — 设置壁纸
```json
{"@type": "type.googleapis.com/SetWallpaper", "fileUrl": "路径或URL", "crop": false, "customContextDataKey": {}, "id": "A-001"}
```

### WakeupScreen / SleepScreen / LockDeviceNow
```json
{"@type": "type.googleapis.com/WakeupScreen", "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/SleepScreen", "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/LockDeviceNow", "customContextDataKey": {}, "id": "A-001"}
```

## 输入与手势

### InputText — 输入文本
```json
{"@type": "type.googleapis.com/InputText", "text": "输入内容", "customContextDataKey": {}, "id": "A-001"}
```

### InputTap — 点击坐标
```json
{"@type": "type.googleapis.com/InputTap", "x": 500, "y": 800, "xs": "", "ys": "", "customContextDataKey": {}, "id": "A-001"}
```
xs/ys 为字符串版，支持变量插值

### InputSwipe — 滑动
```json
{"@type": "type.googleapis.com/InputSwipe", "x1": 500, "y1": 1500, "x2": 500, "y2": 500, "duration": 300, "customContextDataKey": {}, "id": "A-001"}
```

### FindAndClickViewByText — 查找并点击视图
```json
{"@type": "type.googleapis.com/FindAndClickViewByText", "text": "确认", "isRegex": false, "timeout": 5000, "method": "FTM_UI_AUTO", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{matchedViewText}`、`{matchedViewId}`
method：FTM_UI_AUTO/FTM_A11Y/FTM_COORD

### GetTextFromScreenNode — 获取屏幕节点文本
```json
{"@type": "type.googleapis.com/GetTextFromScreenNode", "nodeId": "", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{textOfTheView}`

### InjectKeyCode — 注入按键
```json
{"@type": "type.googleapis.com/InjectKeyCode", "keyCode": 3, "longpress": false, "doublepress": false, "customContextDataKey": {}, "id": "A-001"}
```
常用 keyCode：3(Home), 4(Back), 24(Vol+), 25(Vol-), 26(Power), 187(Recents)

### StartGestureRecording / InjectGestureRecording — 手势录制与回放
```json
{"@type": "type.googleapis.com/StartGestureRecording", "customContextDataKey": {}, "id": "A-001"}
{"@type": "type.googleapis.com/InjectGestureRecording", "speed": 1.0, "customContextDataKey": {}, "id": "A-001"}
```

## 定位与导航

### GetCurrentLocationInfo — 获取位置信息
```json
{"@type": "type.googleapis.com/GetCurrentLocationInfo", "providerPreference": "CurrentLocationProviderPreference_Auto", "timeoutMillis": 10000, "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{latitude}`、`{longitude}`、`{provider}`、`{accuracy}`

### GetCurrentLocationAddress — 获取位置地址
```json
{"@type": "type.googleapis.com/GetCurrentLocationAddress", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{addressLine}`、`{locality}` 等

### MapNav — 地图导航
```json
{"@type": "type.googleapis.com/MapNav", "loc": {"latitude": "39.9", "longitude": "116.4"}, "poi": "天安门", "app": "Baidu", "navType": "NavType_Car", "customContextDataKey": {}, "id": "A-001"}
```
app：Baidu/Gaode。navType：NavType_Car/NavType_Taxi

## 二维码与图像

### ParseQRCode — 解析二维码
```json
{"@type": "type.googleapis.com/ParseQRCode", "imagePath": "/sdcard/qrcode.png", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{qrCodeText}`

### GenerateQRCode — 生成二维码
```json
{"@type": "type.googleapis.com/GenerateQRCode", "text": "https://example.com", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{qrCodeFilePath}`、`{qrCodeFileUri}`

### OcrDetect — OCR 文字识别
```json
{"@type": "type.googleapis.com/OcrDetect", "threads": 4, "useSlim": false, "separator": "\n", "output_type": "OcrDetectOutputType_Json", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{ocrResult}`

### FindImagePosition — 图片查找
```json
{"@type": "type.googleapis.com/FindImagePosition", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{pointX}`、`{pointY}`、`{isImageFound}`、`{findImageJson}`

### FindPointsByColor — 颜色查找
```json
{"@type": "type.googleapis.com/FindPointsByColor", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{pointX}`、`{pointY}`、`{isColorFound}`、`{findPointsByColorJson}`

## 文本处理

### TextProcessing — 文本处理
```json
{"@type": "type.googleapis.com/TextProcessing", "text": "输入文本", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{textProcessResult}`

### MatchRegex — 正则匹配
```json
{"@type": "type.googleapis.com/MatchRegex", "text": "{contentText}", "regex": "\\d{6}", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{isMatch}`、`{matchResult}`

### ReplaceRegex — 正则替换
```json
{"@type": "type.googleapis.com/ReplaceRegex", "text": "{contentText}", "regex": "pattern", "replacement": "替换值", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{replaceResult}`

## 其他

### SetRuleEnabled — 开关自动指令
```json
{"@type": "type.googleapis.com/SetRuleEnabled", "ruleId": "RULE-xxx", "isEnable": true, "customContextDataKey": {}, "id": "A-001"}
```

### ExecuteFunction — 调用函数
```json
{"@type": "type.googleapis.com/ExecuteFunction", "functionId": "func-xxx", "funcParameterInputs": [{"name": "参数名", "value": "值"}], "resultContextDataKey": "返回值变量名", "customContextDataKey": {}, "id": "A-001"}
```

### SetFunctionReturnValue — 设置函数返回值
```json
{"@type": "type.googleapis.com/SetFunctionReturnValue", "value": "返回值", "customContextDataKey": {}, "id": "A-001"}
```

### FromDA — 调用一键指令
```json
{"@type": "type.googleapis.com/FromDA", "daId": "DA-xxx", "funcParameterInputs": [{"name": "参数名", "value": "值"}], "customContextDataKey": {}, "id": "A-001"}
```

### ShareContent — 分享内容
```json
{"@type": "type.googleapis.com/ShareContent", "text": "分享文本", "filePath": "", "mimeType": "text/plain", "chooserTitle": "分享到", "customContextDataKey": {}, "id": "A-001"}
```

### OpenUrl — 打开 URL
```json
{"@type": "type.googleapis.com/OpenUrl", "url": "https://example.com", "browserPkg": "", "customContextDataKey": {}, "id": "A-001"}
```

### ReadClipboard — 读取剪贴板
```json
{"@type": "type.googleapis.com/ReadClipboard", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{clipboardContent}`

### SetClipboard — 设置剪贴板
```json
{"@type": "type.googleapis.com/SetClipboard", "text": "内容", "customContextDataKey": {}, "id": "A-001"}
```

### ExportBackup — 导出备份
```json
{"@type": "type.googleapis.com/ExportBackup", "destDir": "/sdcard/Download/", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{backupFilePath}`

### GetScreenOnTime — 获取亮屏时间
```json
{"@type": "type.googleapis.com/GetScreenOnTime", "customContextDataKey": {}, "id": "A-001"}
```
上下文变量：`{screenOnTime}`
