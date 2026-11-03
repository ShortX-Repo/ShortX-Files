# 完整指令文件示例

## 一键指令：蓝牙开关

最简单的一键指令：Shell 命令切换蓝牙 + 震动提示。

```
{
  "actions": [{
    "@type": "type.googleapis.com/ShellCommand",
    "command": "if [[ $(settings get global bluetooth_on) == \"1\" ]]; then\n  svc bluetooth disable\n  echo \"OFF\"\nelse\n  svc bluetooth enable\n  echo \"ON\"\nfi",
    "customContextDataKey": {},
    "id": "A-001"
  }, {
    "@type": "type.googleapis.com/Vibrate",
    "vib1": 100,
    "customContextDataKey": {},
    "id": "A-002"
  }, {
    "@type": "type.googleapis.com/ShowToast",
    "message": "蓝牙已切换",
    "customContextDataKey": {},
    "id": "A-003"
  }],
  "id": "DA-bluetooth-toggle",
  "title": "蓝牙开关",
  "description": "切换蓝牙开关状态",
  "versionCode": "1",
  "hook": {},
  "quit": {}
}
###------###
{"type":"da"}
```

## 一键指令：WiFi 开关（带全局变量状态记忆）

使用 IfThenElse + 全局变量实现真正的状态切换。

```
{
  "actions": [{
    "@type": "type.googleapis.com/IfThenElse",
    "If": [{
      "@type": "type.googleapis.com/EvaluateGlobalVar",
      "op": "EqualTo",
      "varName": "WiFi状态",
      "payload": {"value": "1"},
      "customContextDataKey": {},
      "id": "C-001"
    }],
    "IfActions": [{
      "@type": "type.googleapis.com/WriteGlobalVar",
      "varName": "WiFi状态",
      "valueAsString": "0",
      "customContextDataKey": {},
      "id": "A-001"
    }, {
      "@type": "type.googleapis.com/ShellCommand",
      "command": "svc wifi enable",
      "customContextDataKey": {},
      "id": "A-002"
    }, {
      "@type": "type.googleapis.com/ShowToast",
      "message": "WiFi 已开启",
      "customContextDataKey": {},
      "id": "A-003"
    }],
    "ElseActions": [{
      "@type": "type.googleapis.com/WriteGlobalVar",
      "varName": "WiFi状态",
      "valueAsString": "1",
      "customContextDataKey": {},
      "id": "A-004"
    }, {
      "@type": "type.googleapis.com/ShellCommand",
      "command": "svc wifi disable",
      "customContextDataKey": {},
      "id": "A-005"
    }, {
      "@type": "type.googleapis.com/ShowToast",
      "message": "WiFi 已关闭",
      "customContextDataKey": {},
      "id": "A-006"
    }],
    "customContextDataKey": {},
    "id": "A-000"
  }],
  "id": "DA-wifi-toggle",
  "title": "WiFi 开关",
  "description": "切换 WiFi 开关状态，带状态记忆",
  "versionCode": "1",
  "hook": {},
  "quit": {}
}
###------###
{"type":"da"}
```

## 一键指令：用户输入 + HTTP 请求

弹出输入框，发送企业微信 Webhook。

```
{
  "actions": [{
    "@type": "type.googleapis.com/ShowTextFieldDialog",
    "title": "发送消息",
    "textFields": [{"placeholder": "输入消息内容"}],
    "cancelable": true,
    "customContextDataKey": {},
    "id": "A-001"
  }, {
    "@type": "type.googleapis.com/HttpRequest",
    "url": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY",
    "method": "POST",
    "headers": [{"key": "Content-Type", "value": "application/json"}],
    "requestBody": {
      "@type": "type.googleapis.com/HttpRequestBodyJson",
      "json": "{\"msgtype\":\"text\",\"text\":{\"content\":\"{textFieldInput1}\"}}"
    },
    "adapter": {
      "@type": "type.googleapis.com/HttpRequestJsonMapAdapter",
      "expressions": ["errcode"]
    },
    "customContextDataKey": {},
    "id": "A-002"
  }, {
    "@type": "type.googleapis.com/ShowToast",
    "message": "消息已发送",
    "customContextDataKey": {},
    "id": "A-003"
  }],
  "id": "DA-send-message",
  "title": "发送消息",
  "description": "输入消息内容并发送到企业微信",
  "versionCode": "1",
  "parameters": [
    {"name": "Webhook Key", "defaultValue": "YOUR_KEY", "isRequired": true, "comments": "企业微信 Webhook Key"}
  ],
  "hook": {},
  "quit": {}
}
###------###
{"type":"da"}
```

## 自动指令：应用进入前台时执行操作

微信进入前台且 WiFi 已连接时显示提示。

```
{
  "facts": [{
    "@type": "type.googleapis.com/AppBecomeFg",
    "apps": [{"pkgName": "com.tencent.mm"}],
    "tag": "微信前台",
    "customContextDataKey": {},
    "id": "F-001"
  }],
  "conditions": [{
    "@type": "type.googleapis.com/RequireWifiConnected",
    "requiredSSID": "*",
    "customContextDataKey": {},
    "id": "C-001"
  }],
  "actions": [{
    "@type": "type.googleapis.com/ShowToast",
    "message": "WiFi 已连接，欢迎使用微信",
    "customContextDataKey": {},
    "id": "A-001"
  }],
  "id": "RULE-app-fg",
  "title": "应用前台提示",
  "description": "微信进入前台时显示提示",
  "isEnabled": true,
  "condOp": "ALL",
  "hook": {},
  "quit": {},
  "versionCode": "1"
}
###------###
{"type":"rule"}
```

## 自动指令：通知过滤（带钩子初始化）

监听通知，训练模式下让用户标记，运行模式下自动过滤。启用时初始化全局变量。

```
{
  "facts": [{
    "@type": "type.googleapis.com/NotificationPosted",
    "record": {},
    "tag": "执行",
    "customContextDataKey": {},
    "id": "F-001"
  }],
  "conditions": [],
  "actions": [{
    "@type": "type.googleapis.com/IfThenElse",
    "If": [{
      "@type": "type.googleapis.com/EvaluateGlobalVar",
      "op": "EqualTo",
      "varName": "过滤模式",
      "payload": {"value": "训练"},
      "customContextDataKey": {},
      "id": "C-001"
    }],
    "IfActions": [{
      "@type": "type.googleapis.com/PostNotification",
      "title": "{title}",
      "message": "{contentText}",
      "smallIcon": "chat-2-line",
      "button": [{
        "id": "btn-spam",
        "label": "垃圾",
        "action": [{"@type": "type.googleapis.com/ShowToast", "message": "已标记为垃圾", "customContextDataKey": {}, "id": "A-001"}]
      }, {
        "id": "btn-normal",
        "label": "正常",
        "action": [{"@type": "type.googleapis.com/ShowToast", "message": "已标记为正常", "customContextDataKey": {}, "id": "A-002"}]
      }],
      "customContextDataKey": {},
      "id": "A-000"
    }],
    "ElseActions": [{
      "@type": "type.googleapis.com/RemoveNotification",
      "notification": {"title": "{title}", "contentText": "{contentText}"},
      "customContextDataKey": {},
      "id": "A-003"
    }],
    "customContextDataKey": {},
    "id": "A-000"
  }],
  "id": "RULE-notification-filter",
  "title": "通知过滤",
  "description": "训练模式下标记通知，运行模式下过滤垃圾通知",
  "isEnabled": true,
  "hook": {
    "actionsOnEnabled": [{
      "@type": "type.googleapis.com/CreateGlobalVar",
      "globalVar": {"name": "过滤模式", "type": {"@type": "type.googleapis.com/StringVar"}},
      "customContextDataKey": {},
      "id": "A-init-1"
    }, {
      "@type": "type.googleapis.com/WriteGlobalVar",
      "varName": "过滤模式",
      "valueAsString": "训练",
      "customContextDataKey": {},
      "id": "A-init-2"
    }]
  },
  "quit": {},
  "versionCode": "1"
}
###------###
{"type":"rule"}
```

## 自动指令：工作日早安语音播报（带定时+钩子）

每个工作日早上 8:30 语音播报。

```
{
  "facts": [{
    "@type": "type.googleapis.com/Alarm",
    "triggerAt": {"hour": 8, "minutes": 30},
    "repeat": {"days": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]},
    "workdayFilter": {"dayType": "WorkdayOnly"},
    "tag": "早安",
    "customContextDataKey": {},
    "id": "F-001"
  }],
  "conditions": [],
  "actions": [{
    "@type": "type.googleapis.com/TTS",
    "text": "早上好，今天是工作日",
    "customContextDataKey": {},
    "id": "A-001"
  }],
  "id": "RULE-good-morning",
  "title": "工作日早安",
  "description": "每个工作日早上 8:30 语音播报",
  "isEnabled": true,
  "hook": {
    "actionsOnEnabled": [{
      "@type": "type.googleapis.com/ShowToast",
      "message": "早安指令已启用",
      "customContextDataKey": {},
      "id": "A-hook-1"
    }]
  },
  "quit": {},
  "versionCode": "1"
}
###------###
{"type":"rule"}
```

## 自动指令：JS 脚本处理（广播触发 + customContextDataKey）

广播触发后执行 Shell，用 customContextDataKey 重命名输出，JS 处理后显示。

```
{
  "facts": [{
    "@type": "type.googleapis.com/Broadcast",
    "actions": ["com.example.MY_ACTION"],
    "tag": "触发",
    "customContextDataKey": {},
    "id": "F-001"
  }],
  "conditions": [],
  "actions": [{
    "@type": "type.googleapis.com/ShellCommand",
    "command": "ls /sdcard/Documents/",
    "customContextDataKey": {"keys": [{"first": "shellOut", "second": "文件列表"}]},
    "id": "A-001"
  }, {
    "@type": "type.googleapis.com/ExecuteJS",
    "context": "CoroutineContext_Default",
    "expression": "var files = '{文件列表}'.split('\\n');\nvar jsRet = '找到 ' + files.length + ' 个文件';",
    "customContextDataKey": {},
    "id": "A-002"
  }, {
    "@type": "type.googleapis.com/ShowToast",
    "message": "{jsRet}",
    "customContextDataKey": {},
    "id": "A-003"
  }],
  "id": "RULE-js-example",
  "title": "JS 脚本示例",
  "description": "广播触发后用 JS 处理文件列表",
  "isEnabled": true,
  "hook": {},
  "quit": {},
  "versionCode": "1"
}
###------###
{"type":"rule"}
```

## 自动指令：带退出机制的 VPN 自动管理

VPN 应用前台开启 VPN，退出时关闭。使用 FactTag 区分触发器。

```
{
  "facts": [{
    "@type": "type.googleapis.com/AppBecomeFg",
    "pkgSets": ["翻墙"],
    "tag": "开启",
    "customContextDataKey": {},
    "id": "F-001"
  }, {
    "@type": "type.googleapis.com/PkgStopRunning",
    "pkgSets": ["翻墙"],
    "tag": "关闭",
    "customContextDataKey": {},
    "id": "F-002"
  }],
  "conditions": [],
  "actions": [{
    "@type": "type.googleapis.com/IfThenElse",
    "If": [{
      "@type": "type.googleapis.com/RequireFactTag",
      "tag": "开启",
      "customContextDataKey": {},
      "id": "C-001"
    }, {
      "@type": "type.googleapis.com/VPNIsConnected",
      "customContextDataKey": {},
      "isInvert": true,
      "id": "C-002"
    }],
    "IfActions": [{
      "@type": "type.googleapis.com/ShellCommand",
      "command": "am start-foreground-service com.v2ray.ang/com.v2ray.ang.service.V2RayVpnService",
      "singleShot": true,
      "customContextDataKey": {},
      "id": "A-001"
    }, {
      "@type": "type.googleapis.com/ShowToast",
      "message": "已开启 VPN",
      "customContextDataKey": {},
      "id": "A-002"
    }],
    "customContextDataKey": {},
    "id": "A-000"
  }, {
    "@type": "type.googleapis.com/IfThenElse",
    "If": [{
      "@type": "type.googleapis.com/RequireFactTag",
      "tag": "关闭",
      "customContextDataKey": {},
      "id": "C-003"
    }, {
      "@type": "type.googleapis.com/VPNIsConnected",
      "customContextDataKey": {},
      "id": "C-004"
    }, {
      "@type": "type.googleapis.com/AppHasTask",
      "pkgSets": ["翻墙"],
      "customContextDataKey": {},
      "isInvert": true,
      "id": "C-005"
    }],
    "IfActions": [{
      "@type": "type.googleapis.com/StopApp",
      "appPkg": [{"pkgName": "com.v2ray.ang"}],
      "customContextDataKey": {},
      "id": "A-003"
    }, {
      "@type": "type.googleapis.com/ShowToast",
      "message": "已关闭 VPN",
      "customContextDataKey": {},
      "id": "A-004"
    }],
    "customContextDataKey": {},
    "id": "A-005"
  }],
  "id": "RULE-vpn-auto",
  "title": "自动 VPN",
  "description": "VPN 应用进入前台时开启，退出时关闭",
  "isEnabled": true,
  "hook": {},
  "quit": {},
  "versionCode": "1"
}
###------###
{"type":"rule"}
```
