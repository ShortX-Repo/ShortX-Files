# ShortX Repo

这是ShortX发现页面的在线指令数据仓库，指令更新时，通过Github Action自动创建PR更新Index文件。

[![Update index](https://github.com/ShortX-Repo/ShortX-Files/actions/workflows/update_index.yml/badge.svg)](https://github.com/ShortX-Repo/ShortX-Files/actions/workflows/update_index.yml)


## 如何贡献

1. 通过ShortX app分享功能，保存为文件
2. 按需修改文件中版本号`versionCode`字段
3. 检查文件中`id`字段是否和上个版本一致（此步骤仅在更新指令时需要）
4. 将指令文件放到指定目录下，注意，不需要手动修改index文件
5. 往主分支提交PR

> PR合并之后，Index文件会通过Github action自动更新，因此可能需要一段时间才能在App上看到最新数据。

## 文件目录

`index.json`

这是指令的索引文件，记录了所有一键指令和自动指令的基础信息以及其url

`da`

这是放一键指令的目录，每个指令对应一个文件，可以通过App分享功能直接生成文件。

`rules`

这是放自动指令的目录，每个指令对应一个文件，可以通过App分享功能直接生成文件。


## 版本控制

`versionCode`属性表示版本号，`id`用于不用的指令；以一条一键指令为例，

```json
{
  "actions": [],
  "id": "DA9122b14f-a902-48f5-8dcb-f2b98881519d",
  "lastUpdateTime": "1689414154622",
  "createTime": "1688871810016",
  "title": "IP查询",
  "versionCode": 1,
  "description": "查询归属地并用弹幕通知",
  "author": {
    "name": "Genicur"
  }
}
```

上面例子里的`id`，建议使用UUID，同一条指令请用同一个`id`，更新指令时，需要增加版本号`versionCode`;
因此，如果你要上传一个指令到仓库，通过ShortX的分享功能导出指令后，需要手动修改一下版本号，以及确认下id是否一致。


## 指令要求

1. 禁止涉及用户数据安全隐私
2. 禁止动态加载可执行逻辑

## 指令建议

1. 标题和描述都写清楚
2. 给一些动作添加备注


## Fork github 仓库

如果你想直接Fork本仓库使用，需要简单配置一下Github Action需要的`token`，否则无法自动创建Index更新的PR。步骤如下：

1. 前往Github设置，**Developer Settings**，**Personal access tokens**，点击**Tokens(Classic)**，点击**Generate new token**，token权限要选中 repo 和 workflow ，生成一个token，复制到剪贴板。
2. 进入自己Fork的仓库，点击**Settings**，最下方有**Secrets and Variales**，选择其中的**Actions**，创建一个Secret，名字为PAT，值为刚才复制的token。
3. 完成

这样操作的目的是给Github Action权限，可以自动生成commits和PR。
