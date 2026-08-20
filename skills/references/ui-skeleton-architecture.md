# ShortX UI 骨架架构

来源文件：用户提供的 `ui演示.js`（WindowManager 原生 View 悬浮窗演示）

配套参考：
- Hermes skill：`shortx-core-规则`、`shortx-rhino-js-参考`、`shortx-ui-悬浮窗`
- GitHub 快照：`https://github.com/ShortX-Repo/ShortX-Files/tree/main/skills`
- 仓库目录：`skills/`
- 模板文件：`templates/shortx-ui-skeleton.js`

仓库文件：
- JS 骨架模板：`templates/shortx-ui-skeleton.js`
- 架构说明：`references/ui-skeleton-architecture.md`

## 1. 从 ui演示.js 提取出的核心架构

`ui演示.js` 是一套 WindowManager 原生 View 悬浮窗。它的主体结构是：

```text
ShortX ExecuteJS / Rhino ES5
  -> runOnMain(fn)
  -> FloatUI 实例
  -> WindowManager TYPE_APPLICATION_OVERLAY
  -> 主面板 Panel
      -> 标题栏 TitleBar
      -> Chip TabBar
      -> ScrollView + ContentHost
  -> 遮罩 Mask
  -> 侧边栏 Sidebar
  -> 动画注册表与 close 清理
```

对应源码段落：

| 源码行 | 模块 | 职责 |
|---:|---|---|
| 8-32 | 工具与常量 | dp、状态栏高度、尺寸、动画时长、页面 key |
| 33-50 | runOnMain | 把 UI 操作投递到 Main Looper |
| 52-58 | singleton | 通过 Rhino global 关闭旧实例 |
| 60-82 | 通用工具 | 颜色、透明度、主题判断、Toast、ripple |
| 86-111 | getC / cBg | 主题色表与圆角背景工厂 |
| 115-128 | 动画注册表 | addAnim / stopAllAnims 统一取消动画 |
| 132-149 | FloatUI 状态 | panel、sidebar、mask、tab、drag、closing 状态 |
| 153-193 | build | 创建主面板、addView、渲染首页、入场动画 |
| 197-289 | titleBar | 菜单、标题拖动、关闭按钮 |
| 293-328 | tabBar | Chip Tab 生成与点击切页 |
| 332-394 | switchTab / rdTab | 页面切换、淡出淡入、竞态 token |
| 401-432 | pgH/pgS/pgT | 三个页面内容扩展区 |
| 436-571 | 组件工厂 | 分组标签、信息行、Switch、SeekBar、操作卡片 |
| 575-605 | popIn | 主面板 alpha/scale/translation 入场 |
| 610-683 | sdC | 侧边栏内容渲染 |
| 687-728 | showS | 创建侧边栏并滑入 |
| 732-793 | addMk | 遮罩创建、复用、触摸控制 |
| 797-868 | hideS / sdAnim | 侧边栏滑出、遮罩淡出、位置动画 |
| 872-958 | close | 停止动画、统一淡出、removeView、清引用 |
| 962-984 | 入口 | 关闭旧实例、创建新实例、返回运行结果 |

## 2. UI 骨架分层

### 2.1 Window 层

职责：
- 获取 `WindowManager`
- 创建 `WindowManager.LayoutParams`
- `addView / updateViewLayout / removeView`
- 管理 `TYPE_APPLICATION_OVERLAY`、`FLAG_NOT_FOCUSABLE`、`FLAG_LAYOUT_IN_SCREEN`

骨架中的位置：
- `FloatUI.prototype.build`
- `FloatUI.prototype.safeUpdate`
- `FloatUI.prototype.close`

### 2.2 Shell 层 / 根布局层

职责：
- 创建主面板 `panel`
- 挂载标题栏、TabBar、ScrollView、ContentHost
- 固定窗口尺寸和初始位置

骨架中的位置：
- `FloatUI.prototype.build`
- `FloatUI.prototype.createTitleBar`
- `FloatUI.prototype.createTabBar`

### 2.3 Navigation 层

职责：
- 维护当前页面 key
- 更新 Tab 选中态
- 更新标题文字
- 清空并重建内容容器
- 用 `fadeToken` 防快速切换竞态

骨架中的位置：
- `FloatUI.prototype.switchPage`
- `FloatUI.prototype.updateTabs`
- `FloatUI.prototype.updateHeader`
- `FloatUI.prototype.renderActivePage`

### 2.4 Page 层

职责：
- 按页面组织内容
- 只调用组件工厂
- 业务功能从这里接入

骨架中的位置：
- `FloatUI.prototype.renderHome`
- `FloatUI.prototype.renderSettings`
- `FloatUI.prototype.renderTools`

### 2.5 Component 层

职责：
- 统一 TextView、卡片、Switch、SeekBar、操作行样式
- 减少页面层重复代码
- 把点击回调作为参数传入

骨架中的位置：
- `sectionLabel`
- `infoRow`
- `switchRow`
- `sliderRow`
- `actionRow`
- `createText`
- `createIconText`
- `cardBase`

### 2.6 Overlay 扩展层

职责：
- 侧边栏与遮罩
- 遮罩复用
- 隐藏遮罩时设置 `FLAG_NOT_TOUCHABLE`
- 拖动主面板时同步侧边栏与遮罩坐标

骨架中的位置：
- `showSidebar`
- `renderSidebarContent`
- `ensureMask`
- `hideSidebar`
- `disableMaskTouch`
- `syncFloatingLayers`

### 2.7 Animation 层

职责：
- 所有动画集中登记到 `_animList`
- 关闭时统一取消
- 入场、淡入淡出、侧边栏滑动复用函数

骨架中的位置：
- `addAnim`
- `stopAllAnims`
- `fadeView`
- `playPanelIn`
- `slideSidebar`
- `stopAnims`

### 2.8 Lifecycle 层

职责：
- 入口创建实例
- singleton 关闭旧实例
- close 时取消动画、removeView、清引用

骨架中的位置：
- `getGlobalBox`
- 入口段 `_box / _ret`
- `FloatUI.prototype.close`
- `FloatUI.prototype.cleanRefs`

## 3. 推荐扩展方式

### 增加页面

1. 新增页面 key：

```javascript
var PAGE_LOG = 'log';
```

2. 在 `createTabBar()` 的 `tabs` 数组追加：

```javascript
{ key: PAGE_LOG, label: '日志', icon: '📄' }
```

3. 在 `renderActivePage()` 增加分支：

```javascript
else if (this.activePage === PAGE_LOG) this.renderLog(this.contentHost);
```

4. 新增页面函数：

```javascript
FloatUI.prototype.renderLog = function(parent) {
  parent.addView(this.sectionLabel('日志'));
  parent.addView(this.infoRow('状态', '这里接入日志文本', this.C.textSub, this.C.card));
};
```

### 增加动作按钮

在页面函数里调用 `actionRow`：

```javascript
parent.addView(this.actionRow('复制结果', '把当前结果写入剪贴板', this.C.card, function() {
  shortx.setClipboard('这里替换成实际文本');
  showToast('已复制');
}));
```

### 接入 ShortX 变量/规则链路

GitHub `ShortX-Files/skills/references/variables.md` 里的可用结论：
- 上下文变量：`{shellOut}`、`{jsRet}` 等
- 全局变量：`globalVarOf$变量名`
- 局部变量：`localVarOf$变量名`
- 系统环境变量：`%BatteryLevel%`、`%DeviceModel%` 等
- 多个同类动作传递结果时，用 `customContextDataKey` 重命名输出

UI 文件自身适合作为 `ExecuteJS` 的 expression 内容；若要做成可导入 DA / Rule，导出生成与校验继续走 `shortx-command-builder` 与 proto 验证链路。

## 4. 稳定性要点

- Rhino ES5：统一使用 `var`、`function`、`JavaAdapter`。
- UI 操作：集中走 `runOnMain()`。
- Handler 创建：使用 `new android.os.Handler(android.os.Looper.getMainLooper())`。
- 动画启动：使用 `runOnMain(function(){ anim.start(); })`。
- 关闭流程：先 `stopAnims()`，再统一淡出，最后 `removeView`。
- 遮罩隐藏：设置 `FLAG_NOT_TOUCHABLE` 后淡出，保留复用能力。
- 坐标一致：Panel、Sidebar、Mask 都使用 `FLAG_LAYOUT_IN_SCREEN`，拖动时同步 `x/y`。
- 页面切换：使用递增 token，动画回调只处理当前 token。
- 字段命名：避开 `jsRet`、`shellOut`、`pkgName`、`title`、`contentText` 等 ShortX 上下文保留名。

## 5. 骨架与 ui演示.js 的取舍

保留内容：
- Main Looper 投递
- FloatUI prototype 组织方式
- 主面板 + Tab + ScrollView
- 长按标题栏拖动
- 侧边栏 + 遮罩
- 动画注册与关闭清理
- singleton 关闭旧实例

整理内容：
- 页面内容替换为占位扩展区
- 变量名改为更清晰的长命名
- `latch.await` 改为 `latch['await'](...)`
- 组件工厂统一加回调参数
- 侧边栏内容转成通用菜单模板
- 文档中单独列出分层职责与扩展入口

## 6. 使用方式

把 `templates/shortx-ui-skeleton.js` 作为新的 ShortX ExecuteJS 内容导入或复制到外部 JS 路径。后续只改三个区域：

1. `renderHome / renderSettings / renderTools`：替换页面内容。
2. `getColors`：替换主题色。
3. `actionRow` 的 callback：接入业务动作、ShortX API 或 `shortx.executeAction(...)`。

