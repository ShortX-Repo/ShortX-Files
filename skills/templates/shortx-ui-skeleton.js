// ============================================================
// ShortX UI 骨架架构 — WindowManager 原生 View 版
// 来源：/storage/emulated/0/ShortX配置/js代码/ui演示.js
// 目标：保留 UI 架构、生命周期和扩展点；业务内容留空替换
// 语法：Rhino ES5，只使用 var 与 function
// ============================================================

// ===================== 0. 工具与常量 =====================

var _density = 1;
try { _density = context.getResources().getDisplayMetrics().density; } catch(e) {}
function dp(v) { return Math.round(Number(v) * _density); }

var _statusBarH = 0;
try {
  var _resId = context.getResources().getIdentifier('status_bar_height', 'dimen', 'android');
  if (_resId > 0) _statusBarH = context.getResources().getDimensionPixelSize(_resId);
} catch(e) {}

var PANEL_W = 300;
var PANEL_H = 480;
var SIDE_W = 300;
var CORNER_R = 16;
var ROW_MARGIN = 3;
var TOUCH_SLOP_DP = 6;
var LONG_PRESS_MS = 400;
var ANIM_PANEL_IN = 320;
var ANIM_CLOSE = 220;
var ANIM_SIDE_IN = 260;
var ANIM_SIDE_OUT = 200;
var ANIM_FADE = 180;
var RUN_TIMEOUT = 5000;

var PAGE_HOME = 'home';
var PAGE_SETTINGS = 'settings';
var PAGE_TOOLS = 'tools';
var SINGLETON_KEY = '__SHORTX_UI_SKELETON_APP__';

function runOnMain(fn, timeoutMs) {
  try {
    var mainLooper = android.os.Looper.getMainLooper();
    var myLooper = android.os.Looper.myLooper();
    if (mainLooper && myLooper && (myLooper === mainLooper || myLooper.equals(mainLooper))) {
      return { ok: true, value: fn() };
    }
  } catch(e) {}

  var box = { ok: false, value: null, error: null };
  var latch = new java.util.concurrent.CountDownLatch(1);
  var handler = new android.os.Handler(android.os.Looper.getMainLooper());
  handler.post(new java.lang.Runnable({
    run: function() {
      try {
        box.value = fn();
        box.ok = true;
      } catch(er) {
        box.error = er;
      } finally {
        latch.countDown();
      }
    }
  }));
  try { latch['await'](timeoutMs || RUN_TIMEOUT, java.util.concurrent.TimeUnit.MILLISECONDS); } catch(e2) {}
  return box;
}

function getGlobalBox() {
  try { return (function() { return this; })(); } catch(e) {}
  try { return this; } catch(e2) {}
  return null;
}

function parseColor(hexValue) {
  try { return android.graphics.Color.parseColor(String(hexValue)); } catch(e) { return 0; }
}

function withAlpha(colorValue, alphaValue) {
  var a = Math.max(0, Math.min(255, Math.floor(Number(alphaValue) * 255)));
  return (colorValue & 0x00FFFFFF) | (a << 24);
}

function isDarkTheme() {
  try {
    var mode = context.getResources().getConfiguration().uiMode & android.content.res.Configuration.UI_MODE_NIGHT_MASK;
    return mode === android.content.res.Configuration.UI_MODE_NIGHT_YES;
  } catch(e) { return false; }
}

function showToast(msg) {
  try { android.widget.Toast.makeText(context, String(msg), android.widget.Toast.LENGTH_SHORT).show(); } catch(e) {}
}

function rippleResId() {
  try {
    var outValue = new android.util.TypedValue();
    context.getTheme().resolveAttribute(android.R.attr.selectableItemBackground, outValue, true);
    return outValue.resourceId;
  } catch(e) { return 0; }
}

function makeBg(colorValue, radiusDp) {
  var bg = new android.graphics.drawable.GradientDrawable();
  bg.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
  bg.setCornerRadius(dp(Number(radiusDp || CORNER_R)));
  bg.setColor(colorValue);
  return bg;
}

function setMargins(lp, left, top, right, bottom) {
  try { lp.setMargins(dp(left), dp(top), dp(right), dp(bottom)); } catch(e) {}
  return lp;
}

// ===================== 1. 主题系统 =====================

function getColors() {
  var dark = isDarkTheme();
  return {
    dark: dark,
    surface: dark ? parseColor('#1A1A2E') : parseColor('#FFFFFF'),
    card: dark ? parseColor('#192038') : parseColor('#F0F1F3'),
    primary: parseColor('#7C5CFC'),
    textMain: dark ? parseColor('#E3E3E3') : parseColor('#1F1F1F'),
    textSub: dark ? parseColor('#9AA0A6') : parseColor('#5F6368'),
    textHint: dark ? parseColor('#666680') : parseColor('#9AA0A6'),
    divider: dark ? parseColor('#2A2A3E') : parseColor('#E0E0E0'),
    tabActive: parseColor('#7C5CFC'),
    tabInactive: dark ? parseColor('#2A2A3E') : parseColor('#E8EAED'),
    tabTextActive: parseColor('#FFFFFF'),
    tabTextInactive: dark ? parseColor('#8888AA') : parseColor('#5F6368'),
    mask: dark ? parseColor('#80000000') : parseColor('#40000000')
  };
}

// ===================== 2. 动画注册表 =====================

var _animList = [];
function addAnim(anim) {
  if (anim) _animList.push(anim);
  return anim;
}

function stopAllAnims() {
  for (var i = 0; i < _animList.length; i++) {
    try { _animList[i].cancel(); } catch(e) {}
  }
  _animList = [];
}

// ===================== 3. 应用对象与状态 =====================

function FloatUI() {
  this.C = getColors();
  this.activePage = PAGE_HOME;
  this.wm = null;
  try { this.wm = context.getSystemService(android.content.Context.WINDOW_SERVICE); } catch(e) {}

  this.panel = null;
  this.panelLp = null;
  this.addedPanel = false;

  this.contentHost = null;
  this.scrollView = null;
  this.headerText = null;
  this.tabViews = [];
  this.fadeToken = 0;

  this.sidebar = null;
  this.sidebarLp = null;
  this.addedSidebar = false;

  this.mask = null;
  this.maskLp = null;
  this.addedMask = false;

  this.panelAnim = null;
  this.sideAnim = null;
  this.maskAnim = null;

  this.dragging = false;
  this.downX = 0;
  this.downY = 0;
  this.startX = 0;
  this.startY = 0;

  this.closing = false;
}

// ===================== 4. Window 层：创建与挂载 =====================

FloatUI.prototype.build = function() {
  if (!this.wm) {
    showToast('WindowManager 获取失败');
    return false;
  }

  var root = new android.widget.LinearLayout(context);
  root.setOrientation(android.widget.LinearLayout.VERTICAL);
  root.setBackground(makeBg(this.C.surface, CORNER_R));
  try { root.setElevation(dp(4)); } catch(e) {}
  try { root.setClipToOutline(true); } catch(e2) {}

  root.addView(this.createTitleBar());
  root.addView(this.createTabBar());

  var scroller = new android.widget.ScrollView(context);
  scroller.setLayoutParams(new android.widget.LinearLayout.LayoutParams(-1, 0, 1.0));
  scroller.setVerticalScrollBarEnabled(false);
  try { scroller.setOverScrollMode(android.view.View.OVER_SCROLL_NEVER); } catch(e3) {}

  var host = new android.widget.LinearLayout(context);
  host.setOrientation(android.widget.LinearLayout.VERTICAL);
  host.setPadding(dp(12), dp(6), dp(12), dp(8));
  scroller.addView(host);
  root.addView(scroller);

  this.contentHost = host;
  this.scrollView = scroller;

  var lp = new android.view.WindowManager.LayoutParams(
    dp(PANEL_W), dp(PANEL_H),
    android.view.WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
    android.view.WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | android.view.WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
    android.graphics.PixelFormat.TRANSLUCENT
  );
  lp.gravity = android.view.Gravity.TOP | android.view.Gravity.START;
  lp.x = dp(20);
  lp.y = dp(80) + _statusBarH;

  try {
    root.setAlpha(0.0);
    root.setScaleX(0.92);
    root.setScaleY(0.92);
    root.setTranslationY(dp(8));
    this.wm.addView(root, lp);
    this.panel = root;
    this.panelLp = lp;
    this.addedPanel = true;
    this.switchPage(PAGE_HOME);
    this.playPanelIn();
    return true;
  } catch(e4) {
    showToast('UI 创建失败: ' + String(e4));
  }
  return false;
};

// ===================== 5. 顶栏与拖动 =====================

FloatUI.prototype.createTitleBar = function() {
  var self = this;
  var bar = new android.widget.LinearLayout(context);
  bar.setOrientation(android.widget.LinearLayout.HORIZONTAL);
  bar.setGravity(android.view.Gravity.CENTER_VERTICAL);
  bar.setPadding(dp(12), dp(10), dp(8), dp(8));
  var ripple = rippleResId();
  if (ripple) bar.setBackgroundResource(ripple);

  var handler = new android.os.Handler(android.os.Looper.getMainLooper());
  var longPressJob = new java.lang.Runnable({
    run: function() {
      self.dragging = true;
      if (self.panelLp) {
        self.startX = self.panelLp.x;
        self.startY = self.panelLp.y;
      }
      try { if (self.panel) self.panel.setAlpha(0.86); } catch(e) {}
    }
  });

  bar.setOnTouchListener(new JavaAdapter(android.view.View.OnTouchListener, {
    onTouch: function(view, event) {
      var action = event.getAction();
      if (action === android.view.MotionEvent.ACTION_DOWN) {
        self.downX = event.getRawX();
        self.downY = event.getRawY();
        handler.postDelayed(longPressJob, LONG_PRESS_MS);
        return true;
      }
      if (action === android.view.MotionEvent.ACTION_MOVE) {
        var dx = event.getRawX() - self.downX;
        var dy = event.getRawY() - self.downY;
        if (self.dragging && self.panelLp && self.panel) {
          self.panelLp.x = self.startX + Math.round(dx);
          self.panelLp.y = self.startY + Math.round(dy);
          self.safeUpdate(self.panel, self.panelLp);
          self.syncFloatingLayers();
          return true;
        }
        if (Math.abs(dx) > dp(TOUCH_SLOP_DP) || Math.abs(dy) > dp(TOUCH_SLOP_DP)) {
          handler.removeCallbacks(longPressJob);
        }
        return true;
      }
      if (action === android.view.MotionEvent.ACTION_UP || action === android.view.MotionEvent.ACTION_CANCEL) {
        handler.removeCallbacks(longPressJob);
        if (self.dragging) {
          self.dragging = false;
          try { if (self.panel) self.panel.setAlpha(1.0); } catch(e2) {}
        }
        return true;
      }
      return true;
    }
  }));

  var menuBtn = this.createIconText('☰', 20, this.C.textMain);
  menuBtn.setOnClickListener(new JavaAdapter(android.view.View.OnClickListener, {
    onClick: function(v) { self.showSidebar(); }
  }));
  bar.addView(menuBtn);

  var header = this.createText('ShortX UI 骨架', 16, this.C.textMain, true);
  var headerLp = new android.widget.LinearLayout.LayoutParams(0, -2);
  headerLp.weight = 1;
  headerLp.setMargins(dp(8), 0, 0, 0);
  header.setLayoutParams(headerLp);
  bar.addView(header);
  this.headerText = header;

  var closeBtn = this.createIconText('✖', 18, this.C.textHint);
  closeBtn.setOnClickListener(new JavaAdapter(android.view.View.OnClickListener, {
    onClick: function(v) { self.close(); }
  }));
  bar.addView(closeBtn);

  return bar;
};

// ===================== 6. Tab 与页面渲染 =====================

FloatUI.prototype.createTabBar = function() {
  var self = this;
  var tabs = [
    { key: PAGE_HOME, label: '首页', icon: '🏠' },
    { key: PAGE_SETTINGS, label: '设置', icon: '⚙️' },
    { key: PAGE_TOOLS, label: '工具', icon: '🔧' }
  ];
  var bar = new android.widget.LinearLayout(context);
  bar.setOrientation(android.widget.LinearLayout.HORIZONTAL);
  bar.setGravity(android.view.Gravity.CENTER);
  bar.setPadding(dp(8), dp(2), dp(8), dp(2));
  this.tabViews = [];

  for (var i = 0; i < tabs.length; i++) {
    (function(tab) {
      var chip = self.createText(tab.icon + ' ' + tab.label, 12, self.C.tabTextInactive, false);
      chip.setGravity(android.view.Gravity.CENTER);
      chip.setPadding(dp(14), dp(6), dp(14), dp(6));
      chip.setTag(tab.key);
      chip.setLayoutParams(new android.widget.LinearLayout.LayoutParams(0, -2, 1.0));
      chip.setOnClickListener(new JavaAdapter(android.view.View.OnClickListener, {
        onClick: function(v) { self.switchPage(tab.key); }
      }));
      bar.addView(chip);
      self.tabViews.push(chip);
    })(tabs[i]);
  }
  return bar;
};

FloatUI.prototype.switchPage = function(pageKey) {
  if (!this.contentHost) return;
  this.fadeToken = (this.fadeToken || 0) + 1;
  var token = this.fadeToken;
  this.activePage = pageKey;
  this.updateTabs(pageKey);
  this.updateHeader(pageKey);
  try { if (this.scrollView) this.scrollView.scrollTo(0, 0); } catch(e) {}

  var host = this.contentHost;
  var self = this;
  if (host.getChildCount() > 0) {
    this.fadeView(host, host.getAlpha(), 0.0, Math.floor(ANIM_FADE / 2), function() {
      if (token !== self.fadeToken) return;
      host.removeAllViews();
      host.setAlpha(0.0);
      self.renderActivePage();
      self.fadeView(host, 0.0, 1.0, ANIM_FADE, null);
    });
  } else {
    this.renderActivePage();
    host.setAlpha(1.0);
  }
};

FloatUI.prototype.updateTabs = function(pageKey) {
  for (var i = 0; i < this.tabViews.length; i++) {
    try {
      var chip = this.tabViews[i];
      var active = String(chip.getTag()) === pageKey;
      chip.setTextColor(active ? this.C.tabTextActive : this.C.tabTextInactive);
      chip.setBackgroundDrawable(makeBg(active ? this.C.tabActive : this.C.tabInactive, 20));
      chip.setTypeface(null, active ? android.graphics.Typeface.BOLD : android.graphics.Typeface.NORMAL);
    } catch(e) {}
  }
};

FloatUI.prototype.updateHeader = function(pageKey) {
  if (!this.headerText) return;
  var names = {};
  names[PAGE_HOME] = '首页';
  names[PAGE_SETTINGS] = '设置';
  names[PAGE_TOOLS] = '工具';
  this.headerText.setText('ShortX ' + String(names[pageKey] || pageKey));
};

FloatUI.prototype.renderActivePage = function() {
  if (this.activePage === PAGE_HOME) this.renderHome(this.contentHost);
  else if (this.activePage === PAGE_SETTINGS) this.renderSettings(this.contentHost);
  else if (this.activePage === PAGE_TOOLS) this.renderTools(this.contentHost);
};

// ===================== 7. 页面扩展区 =====================

FloatUI.prototype.renderHome = function(parent) {
  parent.addView(this.sectionLabel('状态'));
  parent.addView(this.infoRow('模块', '替换为你的状态数据', this.C.textSub, this.C.card));
  parent.addView(this.infoRow('数据源', '可接 globalVar / localVar / JS 结果', this.C.primary, this.C.card));
  parent.addView(this.sectionLabel('快捷入口'));
  parent.addView(this.actionRow('执行动作', '在 callback 中接入 ShortX API 或 executeAction', this.C.card, function() {
    showToast('这里接入业务动作');
  }));
};

FloatUI.prototype.renderSettings = function(parent) {
  parent.addView(this.sectionLabel('外观'));
  parent.addView(this.switchRow('深色主题', this.C.dark, function(checked) {
    showToast('主题状态: ' + checked);
  }));
  parent.addView(this.sliderRow('透明度', 85, 0, 100, function(value) {
    showToast('透明度: ' + value);
  }));
  parent.addView(this.sectionLabel('行为'));
  parent.addView(this.switchRow('启用吸边', false, null));
};

FloatUI.prototype.renderTools = function(parent) {
  parent.addView(this.sectionLabel('工具'));
  parent.addView(this.actionRow('工具一', '替换为实际功能说明', this.C.card, null));
  parent.addView(this.actionRow('工具二', '替换为实际功能说明', this.C.card, null));
  parent.addView(this.actionRow('刷新 UI', '重新渲染当前页面', this.C.card, this.bindSelf(function(app) {
    app.switchPage(app.activePage);
  })));
};

// ===================== 8. 组件工厂 =====================

FloatUI.prototype.bindSelf = function(fn) {
  var self = this;
  return function() { return fn(self); };
};

FloatUI.prototype.createText = function(textValue, spSize, colorValue, bold) {
  var view = new android.widget.TextView(context);
  view.setText(String(textValue));
  view.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, Number(spSize || 14));
  view.setTextColor(colorValue);
  if (bold) view.setTypeface(null, android.graphics.Typeface.BOLD);
  return view;
};

FloatUI.prototype.createIconText = function(textValue, spSize, colorValue) {
  var view = this.createText(textValue, spSize, colorValue, false);
  view.setGravity(android.view.Gravity.CENTER);
  view.setPadding(dp(8), dp(4), dp(8), dp(4));
  var ripple = rippleResId();
  if (ripple) view.setBackgroundResource(ripple);
  return view;
};

FloatUI.prototype.sectionLabel = function(textValue) {
  var view = this.createText(String(textValue), 13, this.C.textMain, true);
  view.setPadding(dp(4), dp(10), dp(4), dp(4));
  return view;
};

FloatUI.prototype.cardBase = function(orientation) {
  var row = new android.widget.LinearLayout(context);
  row.setOrientation(orientation);
  row.setPadding(dp(16), dp(12), dp(16), dp(12));
  row.setBackground(makeBg(this.C.card, CORNER_R));
  row.setLayoutParams(setMargins(new android.widget.LinearLayout.LayoutParams(-1, -2), 0, ROW_MARGIN, 0, ROW_MARGIN));
  return row;
};

FloatUI.prototype.infoRow = function(leftText, rightText, valueColor, bgColor) {
  var row = this.cardBase(android.widget.LinearLayout.HORIZONTAL);
  row.setGravity(android.view.Gravity.CENTER_VERTICAL);
  if (bgColor) row.setBackground(makeBg(bgColor, CORNER_R));

  var leftView = this.createText(leftText, 14, this.C.textMain, true);
  leftView.setLayoutParams(new android.widget.LinearLayout.LayoutParams(0, -2, 1.0));
  row.addView(leftView);

  var rightView = this.createText(rightText, 12, valueColor || this.C.textSub, true);
  row.addView(rightView);
  return row;
};

FloatUI.prototype.switchRow = function(labelText, checkedValue, changeCb) {
  var row = this.cardBase(android.widget.LinearLayout.HORIZONTAL);
  row.setGravity(android.view.Gravity.CENTER_VERTICAL);

  var labelView = this.createText('  ' + labelText, 14, this.C.textMain, false);
  labelView.setLayoutParams(new android.widget.LinearLayout.LayoutParams(0, -2, 1.0));
  row.addView(labelView);

  var sw = new android.widget.Switch(context);
  try {
    sw.setText(''); sw.setTextOn(''); sw.setTextOff(''); sw.setShowText(false);
    sw.setSwitchPadding(0); sw.setSwitchMinWidth(dp(46)); sw.setMinWidth(dp(46));
    sw.setMinHeight(dp(28)); sw.setMinimumHeight(dp(28)); sw.setSplitTrack(false);
  } catch(e) {}
  sw.setChecked(!!checkedValue);
  try {
    var states = [[android.R.attr.state_checked], [-android.R.attr.state_checked]];
    var offThumb = this.C.dark ? parseColor('#B8BECC') : parseColor('#FFFFFF');
    var offTrack = this.C.dark ? parseColor('#3A405A') : parseColor('#D7DCE3');
    sw.setThumbTintList(new android.content.res.ColorStateList(states, [this.C.primary, offThumb]));
    sw.setTrackTintList(new android.content.res.ColorStateList(states, [withAlpha(this.C.primary, 0.45), offTrack]));
  } catch(e2) {}

  if (changeCb) {
    sw.setOnCheckedChangeListener(new JavaAdapter(android.widget.CompoundButton.OnCheckedChangeListener, {
      onCheckedChanged: function(buttonView, isChecked) { changeCb(!!isChecked); }
    }));
  }
  row.addView(sw);
  return row;
};

FloatUI.prototype.sliderRow = function(labelText, valueNow, minValue, maxValue, changeCb) {
  var row = this.cardBase(android.widget.LinearLayout.VERTICAL);
  row.setPadding(dp(16), dp(10), dp(16), dp(6));

  var top = new android.widget.LinearLayout(context);
  top.setOrientation(android.widget.LinearLayout.HORIZONTAL);
  top.setGravity(android.view.Gravity.CENTER_VERTICAL);

  var labelView = this.createText('  ' + labelText, 14, this.C.textMain, false);
  labelView.setLayoutParams(new android.widget.LinearLayout.LayoutParams(0, -2, 1.0));
  top.addView(labelView);

  var valueView = this.createText(valueNow, 13, this.C.primary, true);
  top.addView(valueView);
  row.addView(top);

  var seek = new android.widget.SeekBar(context);
  var minN = Number(minValue || 0);
  var maxN = Number(maxValue || 100);
  seek.setMax(Math.max(1, maxN - minN));
  seek.setProgress(Number(valueNow || 0) - minN);
  if (changeCb) {
    seek.setOnSeekBarChangeListener(new JavaAdapter(android.widget.SeekBar.OnSeekBarChangeListener, {
      onProgressChanged: function(seekBar, progress, fromUser) {
        var nextValue = minN + Number(progress || 0);
        valueView.setText(String(nextValue));
        if (fromUser) changeCb(nextValue);
      },
      onStartTrackingTouch: function(seekBar) {},
      onStopTrackingTouch: function(seekBar) {}
    }));
  }
  row.addView(seek);
  return row;
};

FloatUI.prototype.actionRow = function(labelText, descText, bgColor, clickCb) {
  var row = this.cardBase(android.widget.LinearLayout.VERTICAL);
  if (bgColor) row.setBackground(makeBg(bgColor, CORNER_R));

  var labelView = this.createText('  ' + labelText, 14, this.C.textMain, true);
  row.addView(labelView);
  if (descText) {
    var descView = this.createText('    ' + descText, 11, this.C.textHint, false);
    row.addView(descView);
  }
  if (clickCb) {
    row.setOnClickListener(new JavaAdapter(android.view.View.OnClickListener, {
      onClick: function(v) { clickCb(); }
    }));
  }
  return row;
};

// ===================== 9. 侧边栏与遮罩 =====================

FloatUI.prototype.showSidebar = function() {
  if (this.addedSidebar || !this.addedPanel || !this.panelLp) return;
  this.ensureMask();

  var self = this;
  var sideW = dp(SIDE_W);
  var sideH = android.view.WindowManager.LayoutParams.WRAP_CONTENT;
  try {
    var ph = this.panel.getHeight();
    if (ph > 0) sideH = ph;
  } catch(e) {}

  var sideRoot = new android.widget.LinearLayout(context);
  sideRoot.setOrientation(android.widget.LinearLayout.VERTICAL);
  sideRoot.setBackgroundDrawable(this.sidebarBg());
  this.renderSidebarContent(sideRoot);

  var lp = new android.view.WindowManager.LayoutParams(
    sideW, sideH,
    android.view.WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
    android.view.WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | android.view.WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
    android.graphics.PixelFormat.TRANSLUCENT
  );
  lp.gravity = android.view.Gravity.TOP | android.view.Gravity.START;
  lp.x = this.panelLp.x;
  lp.y = this.panelLp.y;

  try {
    sideRoot.setAlpha(0.0);
    this.wm.addView(sideRoot, lp);
    this.sidebar = sideRoot;
    this.sidebarLp = lp;
    this.addedSidebar = true;
    this.slideSidebar(sideRoot, lp, this.panelLp.x - sideW, this.panelLp.x, ANIM_SIDE_IN, null);
  } catch(e2) {
    showToast('侧边栏创建失败: ' + String(e2));
    this.sidebar = null;
    this.sidebarLp = null;
    this.addedSidebar = false;
    self.disableMaskTouch();
  }
};

FloatUI.prototype.renderSidebarContent = function(parent) {
  var self = this;
  var head = new android.widget.LinearLayout(context);
  head.setOrientation(android.widget.LinearLayout.HORIZONTAL);
  head.setGravity(android.view.Gravity.CENTER_VERTICAL);
  head.setPadding(dp(12), dp(10), dp(12), dp(8));
  head.addView(this.createText('📋  菜单', 16, this.C.textMain, true));
  parent.addView(head);

  var divider = new android.view.View(context);
  divider.setBackgroundColor(withAlpha(this.C.divider, 0.5));
  divider.setLayoutParams(new android.widget.LinearLayout.LayoutParams(-1, 1));
  parent.addView(divider);

  var items = [
    { key: PAGE_HOME, label: '🏠 首页', desc: '主页面扩展区' },
    { key: PAGE_SETTINGS, label: '⚙️ 设置', desc: '参数与偏好扩展区' },
    { key: PAGE_TOOLS, label: '🔧 工具', desc: '操作入口扩展区' }
  ];

  for (var i = 0; i < items.length; i++) {
    (function(item) {
      parent.addView(self.actionRow(item.label, item.desc, self.C.card, function() {
        self.switchPage(item.key);
        self.hideSidebar();
      }));
    })(items[i]);
  }

  parent.addView(this.actionRow('收起侧边栏', '隐藏菜单并保留主面板', withAlpha(this.C.primary, 0.08), function() {
    self.hideSidebar();
  }));
};

FloatUI.prototype.sidebarBg = function() {
  var bg = new android.graphics.drawable.GradientDrawable();
  bg.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
  bg.setColor(this.C.surface);
  try {
    var atEdge = this.panelLp && this.panelLp.x <= dp(2);
    var r = dp(CORNER_R);
    bg.setCornerRadii(atEdge ? [0,0,r,r,r,r,0,0] : [r,r,r,r,r,r,r,r]);
  } catch(e) {}
  return bg;
};

FloatUI.prototype.ensureMask = function() {
  if (!this.panelLp) return;
  if (this.addedMask && this.mask && this.maskLp) {
    this.maskLp.flags &= ~android.view.WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
    this.syncMaskLayout();
    this.safeUpdate(this.mask, this.maskLp);
    this.fadeView(this.mask, this.mask.getAlpha(), 1.0, ANIM_FADE, null);
    return;
  }

  var self = this;
  var mh = android.view.WindowManager.LayoutParams.WRAP_CONTENT;
  try {
    var ph = this.panel.getHeight();
    if (ph > 0) mh = ph;
  } catch(e) {}

  var maskView = new android.view.View(context);
  maskView.setBackgroundDrawable(makeBg(this.C.mask, CORNER_R));
  maskView.setAlpha(0.0);
  maskView.setOnClickListener(new JavaAdapter(android.view.View.OnClickListener, {
    onClick: function(v) { self.hideSidebar(); }
  }));

  var lp = new android.view.WindowManager.LayoutParams(
    this.panelLp.width, mh,
    android.view.WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
    android.view.WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | android.view.WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
    android.graphics.PixelFormat.TRANSLUCENT
  );
  lp.gravity = android.view.Gravity.TOP | android.view.Gravity.START;
  lp.x = this.panelLp.x;
  lp.y = this.panelLp.y;

  try {
    this.wm.addView(maskView, lp);
    this.mask = maskView;
    this.maskLp = lp;
    this.addedMask = true;
    this.fadeView(maskView, 0.0, 1.0, ANIM_FADE, null);
  } catch(e2) {}
};

FloatUI.prototype.hideSidebar = function() {
  var self = this;
  if (!this.addedSidebar || !this.sidebar || !this.sidebarLp || !this.panelLp) {
    this.disableMaskTouch();
    return;
  }
  this.disableMaskTouch();
  var startX = this.sidebarLp.x;
  var endX = this.panelLp.x - this.sidebarLp.width;
  this.slideSidebar(this.sidebar, this.sidebarLp, startX, endX, ANIM_SIDE_OUT, function() {
    try { if (self.sidebar) self.sidebar.setVisibility(android.view.View.INVISIBLE); } catch(e) {}
    try { if (self.sidebar) self.wm.removeView(self.sidebar); } catch(e2) {}
    self.sidebar = null;
    self.sidebarLp = null;
    self.addedSidebar = false;
  });
};

FloatUI.prototype.disableMaskTouch = function() {
  if (!this.addedMask || !this.mask || !this.maskLp) return;
  try {
    this.maskLp.flags |= android.view.WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
    this.wm.updateViewLayout(this.mask, this.maskLp);
    this.fadeView(this.mask, this.mask.getAlpha(), 0.0, ANIM_FADE, null);
  } catch(e) {}
};

FloatUI.prototype.syncFloatingLayers = function() {
  if (!this.panelLp) return;
  if (this.addedSidebar && this.sidebar && this.sidebarLp) {
    this.sidebarLp.x = this.panelLp.x;
    this.sidebarLp.y = this.panelLp.y;
    try { this.sidebar.setBackgroundDrawable(this.sidebarBg()); } catch(e) {}
    this.safeUpdate(this.sidebar, this.sidebarLp);
  }
  if (this.addedMask && this.mask && this.maskLp) {
    this.syncMaskLayout();
    this.safeUpdate(this.mask, this.maskLp);
  }
};

FloatUI.prototype.syncMaskLayout = function() {
  if (!this.maskLp || !this.panelLp) return;
  this.maskLp.x = this.panelLp.x;
  this.maskLp.y = this.panelLp.y;
  this.maskLp.width = this.panelLp.width;
  try {
    var ph = this.panel.getHeight();
    if (ph > 0) this.maskLp.height = ph;
  } catch(e) {}
};

// ===================== 10. 动画与安全操作 =====================

FloatUI.prototype.safeUpdate = function(view, lp) {
  try { if (this.wm && view && lp) this.wm.updateViewLayout(view, lp); } catch(e) {}
};

FloatUI.prototype.fadeView = function(view, fromAlpha, toAlpha, durationMs, endCb) {
  if (!view) { if (endCb) endCb(); return; }
  var anim = android.animation.ValueAnimator.ofFloat(Number(fromAlpha), Number(toAlpha));
  anim.setDuration(Number(durationMs || ANIM_FADE));
  var self = this;
  anim.addUpdateListener(new android.animation.ValueAnimator.AnimatorUpdateListener({
    onAnimationUpdate: function(a) {
      try { if (!self.closing) view.setAlpha(a.getAnimatedValue()); } catch(e) {}
    }
  }));
  anim.addListener(new android.animation.Animator.AnimatorListener({
    onAnimationStart: function() {},
    onAnimationRepeat: function() {},
    onAnimationCancel: function() {},
    onAnimationEnd: function() { try { view.setAlpha(Number(toAlpha)); } catch(e) {} if (endCb) endCb(); }
  }));
  addAnim(anim);
  runOnMain(function() { anim.start(); return true; }, RUN_TIMEOUT);
};

FloatUI.prototype.playPanelIn = function() {
  if (!this.panel) return;
  var view = this.panel;
  var self = this;
  var anim = android.animation.ValueAnimator.ofFloat(0.0, 1.0);
  anim.setDuration(ANIM_PANEL_IN);
  try { anim.setInterpolator(new android.view.animation.DecelerateInterpolator()); } catch(e) {}
  anim.addUpdateListener(new android.animation.ValueAnimator.AnimatorUpdateListener({
    onAnimationUpdate: function(a) {
      try {
        if (self.closing) return;
        var f = Number(a.getAnimatedValue());
        view.setAlpha(f);
        view.setScaleX(0.92 + 0.08 * f);
        view.setScaleY(0.92 + 0.08 * f);
        view.setTranslationY(dp(8) * (1.0 - f));
      } catch(e2) {}
    }
  }));
  this.panelAnim = anim;
  addAnim(anim);
  runOnMain(function() { anim.start(); return true; }, RUN_TIMEOUT);
};

FloatUI.prototype.slideSidebar = function(view, lp, fromX, toX, durationMs, endCb) {
  if (!view || !lp) { if (endCb) endCb(); return; }
  var self = this;
  try { if (this.sideAnim) this.sideAnim.cancel(); } catch(e) {}
  var opening = toX > fromX;
  var anim = android.animation.ValueAnimator.ofFloat(0.0, 1.0);
  anim.setDuration(Number(durationMs || ANIM_SIDE_IN));
  try { anim.setInterpolator(opening ? new android.view.animation.OvershootInterpolator(0.45) : new android.view.animation.DecelerateInterpolator()); } catch(e2) {}
  anim.addUpdateListener(new android.animation.ValueAnimator.AnimatorUpdateListener({
    onAnimationUpdate: function(a) {
      try {
        if (self.closing) return;
        var f = Number(a.getAnimatedValue());
        lp.x = Math.round(fromX + (toX - fromX) * f);
        self.wm.updateViewLayout(view, lp);
        view.setAlpha(opening ? f : 1.0 - f);
      } catch(e3) {}
    }
  }));
  anim.addListener(new android.animation.Animator.AnimatorListener({
    onAnimationStart: function() {},
    onAnimationRepeat: function() {},
    onAnimationCancel: function() { self.sideAnim = null; },
    onAnimationEnd: function() {
      self.sideAnim = null;
      try { lp.x = toX; view.setAlpha(opening ? 1.0 : 0.0); } catch(e4) {}
      if (endCb) endCb();
    }
  }));
  this.sideAnim = anim;
  addAnim(anim);
  runOnMain(function() { anim.start(); return true; }, RUN_TIMEOUT);
};

// ===================== 11. 关闭与清理 =====================

FloatUI.prototype.close = function() {
  if (this.closing) return;
  this.closing = true;
  this.stopAnims();

  var self = this;
  var wmRef = this.wm;
  var panelRef = this.panel;
  var sideRef = this.sidebar;
  var maskRef = this.mask;
  var views = [];
  if (panelRef) views.push(panelRef);
  if (sideRef) views.push(sideRef);
  if (maskRef) views.push(maskRef);

  if (views.length === 0 || !wmRef) {
    this.cleanRefs();
    return;
  }

  var anim = android.animation.ValueAnimator.ofFloat(1.0, 0.0);
  anim.setDuration(ANIM_CLOSE);
  try { anim.setInterpolator(new android.view.animation.AccelerateInterpolator()); } catch(e) {}
  anim.addUpdateListener(new android.animation.ValueAnimator.AnimatorUpdateListener({
    onAnimationUpdate: function(a) {
      var f = Number(a.getAnimatedValue());
      for (var i = 0; i < views.length; i++) {
        try { views[i].setAlpha(f); } catch(e2) {}
      }
    }
  }));
  anim.addListener(new android.animation.Animator.AnimatorListener({
    onAnimationStart: function() {},
    onAnimationRepeat: function() {},
    onAnimationCancel: function() {},
    onAnimationEnd: function() {
      try { if (maskRef) wmRef.removeView(maskRef); } catch(e3) {}
      try { if (sideRef) wmRef.removeView(sideRef); } catch(e4) {}
      try { if (panelRef) wmRef.removeView(panelRef); } catch(e5) {}
      self.cleanRefs();
    }
  }));
  addAnim(anim);
  runOnMain(function() { anim.start(); return true; }, RUN_TIMEOUT);
};

FloatUI.prototype.stopAnims = function() {
  try { if (this.panelAnim) this.panelAnim.cancel(); } catch(e) {}
  try { if (this.sideAnim) this.sideAnim.cancel(); } catch(e2) {}
  try { if (this.maskAnim) this.maskAnim.cancel(); } catch(e3) {}
  this.panelAnim = null;
  this.sideAnim = null;
  this.maskAnim = null;
  stopAllAnims();
};

FloatUI.prototype.cleanRefs = function() {
  this.panel = null;
  this.panelLp = null;
  this.addedPanel = false;
  this.contentHost = null;
  this.scrollView = null;
  this.headerText = null;
  this.tabViews = [];
  this.sidebar = null;
  this.sidebarLp = null;
  this.addedSidebar = false;
  this.mask = null;
  this.maskLp = null;
  this.addedMask = false;
  this.wm = null;
  this.closing = false;
};

// ===================== 12. 入口 =====================

var _box = getGlobalBox();
var _oldClosed = false;
var _ret = runOnMain(function() {
  try {
    if (_box && _box[SINGLETON_KEY] && _box[SINGLETON_KEY].close) {
      _box[SINGLETON_KEY].close();
      _oldClosed = true;
    }
  } catch(e) {}

  var app = new FloatUI();
  var ok = app.build();
  if (_box) _box[SINGLETON_KEY] = app;
  return ok ? 'OK' : 'FAIL';
}, 10000);

if (_ret && _ret.ok && _box && _box[SINGLETON_KEY] && _box[SINGLETON_KEY].addedPanel) {
  '✅ UI 骨架已显示' + (_oldClosed ? '\n♻️ 已关闭上一个实例' : '') + '\n☰ 打开侧边栏\n✖ 关闭\n长按标题栏拖动';
} else if (!_ret || !_ret.ok) {
  '❌ 执行异常: ' + (_ret && _ret.error ? String(_ret.error) : '超时');
} else {
  '⚠️ UI 骨架未显示，检查 ShortX 日志';
}

