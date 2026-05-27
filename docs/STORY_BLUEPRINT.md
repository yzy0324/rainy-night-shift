
---
# 游戏名建议

## 《雨夜值班》

类型：文字选择 / 悬疑 / 多结局
主角：车站夜班值班员
核心玩法：接电话、判断信息、收集线索、做选择、决定是否报警/调查/相信他人。

---

# 一句话剧情

一个暴雨夜，车站值班员接到一通来自失踪女子“林夏”的电话。她说自己被困在车站附近，但她的说法、来电号码、背景噪音都不对劲。随后，出租车司机陈明打来第二通电话，声称见过林夏。玩家需要通过线索判断：这是一场普通误会，还是有人正在利用电话把值班员一步步引离岗位。

---

# 最终真相

这件事不是灵异事件，也不是单纯失踪案。

真正的情况是：

**林夏确实存在。她曾在车站附近发现有人利用旧维修通道进行非法转运，并拍下证据。暴雨夜，她准备把证据交给警方，却被人堵在旧站台附近。**

幕后的人为了拿回证据，安排了两件事：

1. **干扰信号**
   南门附近有一辆灰色面包车，车里放着简易信号干扰设备，所以电话里会有静电声、断续声。

2. **制造假信息**
   陈明并不只是普通出租车司机。他认识其中一名参与者，被迫帮忙打电话误导值班员。他要让玩家相信“林夏已经离开车站”，从而不要继续查旧站台。

但陈明不是纯坏人。他害怕，也想脱身，所以他说话里留下了很多破绽。

玩家最终能否救出林夏、保住证据、揭开真相，取决于之前有没有发现这些矛盾。

---

# 主要人物

## 1. 玩家

身份：北桥站夜班值班员。
特点：普通人，不是警察。
玩家的核心矛盾：

> 是按规定处理，还是冒险相信一通奇怪电话？

---

## 2. 林夏

身份：前车站外包清洁员 / 临时工作人员。
表面：慌张、说话断断续续、很多问题答不上来。
真实情况：她不是故意撒谎，而是不敢说太多，因为有人就在附近。
她掌握的证据：一张存储卡，里面有旧维修通道被非法使用的视频。

---

## 3. 陈明

身份：出租车司机。
表面：热心司机，声称看见林夏。
真实情况：他被人要求误导玩家，但他内心动摇。
关键破绽：他在玩家没有说出名字前，就知道“林夏”这个名字。

---

## 4. 南门灰色面包车里的人

身份：幕后团伙成员。
作用：干扰信号、监视旧站台出口、试图回收林夏手里的证据。
不需要一开始露面，后期通过声音、监控、车灯、脚步声体现。

---

# 核心线索设计

当前建议一共保留 3 个主线线索，和你现在 UI 的 `/ 3` 对齐。

## 线索 1：`clue_static_interference`

中文名：异常静电声
获得方式：第一通电话里，无论玩家怎么选，都会注意到电话背景有持续静电声。
剧情意义：说明这不是普通信号不好，而是附近有设备干扰。
后续用途：Chapter 2 可以询问陈明附近是否有灰色面包车 / 信号干扰。

---

## 线索 2：`clue_wrong_number_doubt`

中文名：错误号码疑点
获得方式：玩家选择检查来电号码，发现来电显示来自一个已经停用的旧站台内部号码。
剧情意义：说明林夏不是从普通手机打来的，而是通过车站内部线路或旧设备联系玩家。
后续用途：开启质疑陈明的关键选项，并且是进入真相结局的必要条件。

---

## 线索 3：`clue_lin_xia_hesitation`

中文名：林夏的迟疑
获得方式：玩家追问林夏具体位置、时间、为什么不报警，她会明显迟疑。
表面意义：她像是在撒谎。
真实意义：她不是在撒谎，而是旁边有人，她不敢直接说。
后续用途：如果玩家理解这个迟疑，后期可以选择更温和的方式引导她，而不是逼问她。

---

# 全剧情结构

整体分成 5 个章节：

```text
Chapter 0：雨夜开场
Chapter 1：第一通电话，林夏
Chapter 2：第二通电话，陈明
Chapter 3：旧站台调查
Chapter 4：最终选择
Endings：多结局
```

---

# Chapter 0：雨夜开场

## sceneId：`chapter0_arrival`

### 场景内容

晚上 11:47。北桥站已经停止运营。
雨很大，站厅灯光忽明忽暗。玩家坐在值班室里，桌上有：

* 值班电话
* 老式监控屏
* 交接记录本
* 南门钥匙
* 车站广播系统

系统提示：今晚只有你一个人在岗。上一班同事说南门附近信号一直不好，让你别管太多。

### 玩家选项

#### 选项 A：查看交接记录

效果：给玩家一点世界观信息。
跳转：`chapter0_logbook`

#### 选项 B：检查监控

效果：监控画面有雪花，南门画面偶尔黑屏。
跳转：`chapter0_monitor`

#### 选项 C：直接开始值班

效果：快速进入主线。
跳转：`chapter1_first_call`

---

## sceneId：`chapter0_logbook`

### 场景内容

记录本上写着：

> “22:15 南门附近有陌生车辆停留。”
> “22:40 旧站台方向有异常杂音。”
> “23:05 保安临时请假，夜班只留一人。”

这让玩家知道，今晚不是普通夜班。

### 玩家选项

#### 选项 A：继续检查监控

跳转：`chapter0_monitor`

#### 选项 B：回到值班台

跳转：`chapter1_first_call`

---

## sceneId：`chapter0_monitor`

### 场景内容

监控画面里，南门外有一道很模糊的车灯。
画面只闪了一秒就变成雪花。
系统没有报警，但玩家能感觉不对。

### 玩家选项

#### 选项 A：记录异常

效果：设置 flag：`noticedSouthGateCar = true`
跳转：`chapter1_first_call`

#### 选项 B：认为只是雨太大

效果：不设置 flag
跳转：`chapter1_first_call`

---

# Chapter 1：第一通电话，林夏

## sceneId：`chapter1_first_call`

### 场景内容

值班电话突然响了。
来电显示很奇怪，不是普通外线，而是：

> “平台 3 - 内线 旧号”

玩家接起电话，里面先是一阵静电声，然后是一个女生的声音。

林夏说：

> “你是……北桥站的值班员吗？
> 我叫林夏。
> 我现在在车站附近。
> 有人跟着我。
> 你能不能别挂电话？”

### 自动效果

玩家获得线索：

```text
clue_static_interference
```

因为静电声一定会出现。

### 玩家选项

#### 选项 A：安慰她，让她慢慢说

效果：玩家表现温和。
设置 flag：`comfortedLinXia = true`
跳转：`chapter1_comfort`

#### 选项 B：追问她的位置

效果：触发林夏迟疑。
获得线索：`clue_lin_xia_hesitation`
跳转：`chapter1_press_location`

#### 选项 C：先检查来电号码

效果：发现号码疑点。
获得线索：`clue_wrong_number_doubt`
跳转：`chapter1_check_number`

---

## sceneId：`chapter1_comfort`

### 场景内容

玩家说：

> “你先别急，我在听。你现在能看到什么？”

林夏沉默了几秒。

她说：

> “我看见旧站台的牌子……还有一扇铁门。
> 门上写着维修通道。
> 但是我不确定是不是北桥站。”

她的声音很抖。电话里仍然有静电声。

### 玩家选项

#### 选项 A：让她找安全地方躲起来

效果：设置 flag：`toldLinXiaToHide = true`
跳转：`chapter1_hide`

#### 选项 B：问她为什么不报警

效果：触发迟疑
获得线索：`clue_lin_xia_hesitation`
跳转：`chapter1_why_not_police`

#### 选项 C：检查来电号码

获得线索：`clue_wrong_number_doubt`
跳转：`chapter1_check_number`

---

## sceneId：`chapter1_press_location`

### 场景内容

玩家问：

> “你具体在哪？哪个出口？旁边有什么标志？”

林夏没有立刻回答。
玩家只能听见雨声、呼吸声和远处很轻的脚步声。

她说：

> “我……我不能说太清楚。
> 他可能听得到。”

这时玩家意识到，她不是不知道位置，而是不敢说。

### 获得线索

```text
clue_lin_xia_hesitation
```

### 玩家选项

#### 选项 A：放缓语气，换成 yes/no 问题

效果：设置 flag：`usedCarefulQuestions = true`
跳转：`chapter1_yes_no`

#### 选项 B：继续逼问

效果：林夏更紧张
设置 flag：`pressedTooHard = true`
跳转：`chapter1_panic`

#### 选项 C：检查来电号码

获得线索：`clue_wrong_number_doubt`
跳转：`chapter1_check_number`

---

## sceneId：`chapter1_check_number`

### 场景内容

玩家一边让林夏保持通话，一边看向来电显示。

号码不是普通手机，也不是外线。
系统显示：

> “03-旧站台维护电话”

但是这个维护电话三年前已经停用。
如果林夏真的在外面，她不应该能用这个号码打进来。

### 获得线索

```text
clue_wrong_number_doubt
```

### 玩家选项

#### 选项 A：问林夏是不是在车站里面

跳转：`chapter1_inside_station`

#### 选项 B：暂时不告诉她，继续听

设置 flag：`keptNumberDoubtQuiet = true`
跳转：`chapter1_listen_more`

#### 选项 C：立刻准备报警

设置 flag：`consideredPoliceEarly = true`
跳转：`chapter1_police_attempt`

---

## sceneId：`chapter1_inside_station`

### 场景内容

玩家问：

> “林夏，你是不是还在车站里面？”

电话那边突然安静。
静电声变得更重。

林夏低声说：

> “我不知道。
> 这里像车站，但不是现在的车站。
> 那些灯……太旧了。”

这句话让玩家意识到：她可能在旧站台区域。

### 玩家选项

#### 选项 A：告诉她往有灯的地方走

跳转：`chapter1_guide_light`

#### 选项 B：让她不要移动，保持安静

跳转：`chapter1_hide`

#### 选项 C：询问她旁边有没有铁门编号

跳转：`chapter1_gate_number`

---

## sceneId：`chapter1_yes_no`

### 场景内容

玩家说：

> “你不用说完整位置。我问，你只回答是或不是。”

玩家问：

> “你旁边有没有铁门？”

林夏：

> “有。”

玩家问：

> “铁门上有没有数字？”

林夏：

> “……3。”

玩家基本确认她在旧 3 号站台附近。

### 玩家选项

#### 选项 A：让她从铁门反方向离开

设置 flag：`guidedAwayFromGate3 = true`
跳转：`chapter1_signal_cut`

#### 选项 B：让她躲在原地

设置 flag：`toldLinXiaToHide = true`
跳转：`chapter1_signal_cut`

---

## sceneId：`chapter1_panic`

### 场景内容

玩家连续追问：

> “你到底在哪？你不说清楚我没法帮你。”

林夏开始慌了。

她说：

> “算了。你别找我。不要过来。”

电话里传来一声金属撞击声。
随后通话短暂中断。

### 效果

设置 flag：`linXiaTrustLow = true`

### 玩家选项

#### 选项 A：继续回拨

跳转：`chapter1_callback_failed`

#### 选项 B：检查监控

跳转：`chapter1_monitor_after_panic`

---

## sceneId：`chapter1_why_not_police`

### 场景内容

玩家问：

> “你为什么不报警？”

林夏停顿很久。

她说：

> “我试过。
> 电话打不出去。
> 他们知道我有东西。”

玩家问：

> “什么东西？”

林夏没有回答，只说：

> “如果我把它交出去，他们就完了。”

### 获得线索

```text
clue_lin_xia_hesitation
```

### 玩家选项

#### 选项 A：问“他们”是谁

跳转：`chapter1_ask_them`

#### 选项 B：让她先保证安全

跳转：`chapter1_hide`

---

## sceneId：`chapter1_ask_them`

### 场景内容

玩家问：

> “他们是谁？”

林夏说：

> “我只知道其中一个人开车。灰色面包车。
> 他们一直停在南门。”

如果玩家之前在 Chapter 0 记录过南门车辆，这里会形成呼应。

### 玩家选项

#### 选项 A：检查南门监控

跳转：`chapter1_south_gate_monitor`

#### 选项 B：让她离南门远一点

跳转：`chapter1_signal_cut`

---

## sceneId：`chapter1_south_gate_monitor`

### 场景内容

南门监控画面重新亮了一下。
玩家看到灰色面包车停在雨里。
车窗里有一点蓝光，像设备指示灯。

画面马上又变成雪花。

### 玩家选项

#### 选项 A：记录车牌，但只看清后两位

设置 flag：`partialPlateSeen = true`
跳转：`chapter1_signal_cut`

#### 选项 B：尝试放大画面

设置 flag：`cameraFreeze = true`
跳转：`chapter1_signal_cut`

---

## sceneId：`chapter1_police_attempt`

### 场景内容

玩家尝试拨打报警电话。
电话拨出后只响了一声，就被强烈静电盖住。
值班室灯闪了一下。

林夏在电话里说：

> “你也打不出去，对吗？”

这说明干扰范围已经影响到值班室。

### 玩家选项

#### 选项 A：改用车站内部广播

跳转：`chapter1_broadcast_option`

#### 选项 B：继续保持电话，不冒险

跳转：`chapter1_listen_more`

---

## sceneId：`chapter1_broadcast_option`

### 场景内容

玩家看向广播按钮。
如果现在广播，可能吓走跟踪林夏的人，也可能暴露她的位置。

### 玩家选项

#### 选项 A：广播“车站即将巡查”

效果：设置 flag：`usedBroadcast = true`
跳转：`chapter1_signal_cut`

#### 选项 B：不广播，避免暴露林夏

效果：设置 flag：`avoidedBroadcast = true`
跳转：`chapter1_signal_cut`

---

## sceneId：`chapter1_signal_cut`

### 场景内容

林夏的声音越来越小。

她最后说：

> “如果有人打电话说见过我……不要马上信。”

然后电话断了。

值班室里只剩下雨声。

### 玩家选项

#### 选项 A：继续查监控

跳转：`ending_clue_bonus`

#### 选项 B：记录所有异常，等待下一步

跳转：`ending_shift_over`

---

# Chapter 2：第二通电话，陈明

你现在 Phase 5 已经大概做到了这里。下面是完整写法。

---

## sceneId：`ending_shift_over`

### 注意

这个节点不再是真正结局，而是 Chapter 1 到 Chapter 2 的桥。

### 场景内容

玩家看着记录本上的几行字：

> 异常静电。
> 旧站台号码。
> 林夏。
> 南门。

雨声变小了。
就在玩家以为这一晚快结束时，值班电话再次响起。

### 玩家选项

#### 选项 A：接起电话

跳转：`chapter2_intro`

---

## sceneId：`ending_clue_bonus`

### 注意

这个节点也是桥。

### 场景内容

玩家把刚才的线索写在纸上。
越写越觉得不对。

林夏的迟疑不是普通恐惧。
她像是在避开某个正在听的人。

这时，第二通电话响起。

### 玩家选项

#### 选项 A：接起电话

跳转：`chapter2_intro`

---

## sceneId：`chapter2_intro`

### 场景内容

电话里是一个男人的声音。
他先确认：

> “是北桥站值班室吗？”

玩家问他是谁。

他说：

> “我叫陈明。开出租的。
> 我刚才好像拉过一个叫林夏的女孩。”

重点：他主动说出了林夏的名字。

### 玩家选项

#### 选项 A：让他说下去

跳转：`chapter2_second_call`

#### 选项 B：问他怎么知道林夏的名字

条件：如果有 `clue_wrong_number_doubt` 或 `clue_lin_xia_hesitation`，这个选项更合理。
跳转：`chapter2_chen_cornered`

---

## sceneId：`chapter2_second_call`

### 场景内容

陈明说：

> “她在南门附近拦的车，浑身都湿了。
> 她说有人追她，让我送她去城西。
> 但开出去没多久，她又突然下车了。”

玩家问：

> “她现在在哪？”

陈明回答：

> “我不知道。她下车后往桥洞那边走了。”

这里的矛盾是：
如果林夏刚才还在旧站台附近打电话，她不可能已经坐车离开又下车。

### 玩家选项

#### 选项 A：相信陈明，问更多细节

跳转：`chapter2_chen_details`

#### 选项 B：质疑时间线

条件：需要 `clue_wrong_number_doubt`
跳转：`chapter2_chen_cornered`

#### 选项 C：问车上有没有异常静电声

条件：需要 `clue_static_interference`
跳转：`chapter2_static_lead`

---

## sceneId：`chapter2_chen_cornered`

### 场景内容

玩家问：

> “我没有告诉你她叫林夏。你怎么知道这个名字？”

陈明沉默。
电话里传来打火机的声音。

他说：

> “她自己说的。上车的时候说的。”

玩家继续问：

> “那你为什么知道要打到北桥站值班室？”

陈明的呼吸变重了。

他说：

> “她让我打的。”

这又是矛盾：林夏刚才明明让玩家不要轻信“见过她的人”。

### 效果

设置 flag：`chenSuspicious = true`

### 玩家选项

#### 选项 A：继续逼问陈明

跳转：`chapter2_chen_pressure`

#### 选项 B：假装相信，套出更多信息

设置 flag：`playedAlongWithChen = true`
跳转：`chapter2_chen_details`

---

## sceneId：`chapter2_chen_pressure`

### 场景内容

玩家说：

> “你不是在帮她。你是在确认我知道多少。”

陈明压低声音：

> “听我一句，别查南门。
> 你只是值班员，不值得。”

这句话等于暴露了他知道南门有问题。

### 玩家选项

#### 选项 A：问南门有什么

跳转：`chapter2_static_lead`

#### 选项 B：说已经报警了

设置 flag：`bluffedPolice = true`
跳转：`chapter2_chen_reacts`

---

## sceneId：`chapter2_chen_reacts`

### 场景内容

如果玩家说已经报警，陈明明显慌了。

他说：

> “你报警了？
> 那你现在别出值班室。
> 也别开南门。”

他的语气不像威胁，更像提醒。

这说明陈明可能不是完全站在坏人一边。

### 玩家选项

#### 选项 A：问他是不是被迫的

跳转：`chapter2_chen_confession_hint`

#### 选项 B：要求他直接说林夏在哪

跳转：`chapter2_chen_details`

---

## sceneId：`chapter2_chen_confession_hint`

### 场景内容

陈明沉默很久。

他说：

> “我只负责打这个电话。
> 别的我不能说。
> 但如果你真想救她，看旧站台，不要看南门。”

这是一个半真半假的提示。
南门有车，但林夏本人可能在旧站台。

### 效果

设置 flag：`chenHintedOldPlatform = true`

### 玩家选项

#### 选项 A：去查旧站台监控

跳转：`chapter3_monitor_room`

#### 选项 B：继续问南门车辆

跳转：`chapter2_static_lead`

---

## sceneId：`chapter2_chen_details`

### 场景内容

陈明描述林夏：

> “黑色外套，白色鞋，手里拿着一个透明袋子。”

这个描述和林夏电话里的信息能对上。
但他说她上车时“很冷静”，这和电话里的恐惧不一致。

### 玩家选项

#### 选项 A：问透明袋子里是什么

跳转：`chapter2_memory_card_hint`

#### 选项 B：问她有没有提到旧站台

跳转：`chapter2_old_platform_hint`

#### 选项 C：问附近有没有信号干扰

条件：需要 `clue_static_interference`
跳转：`chapter2_static_lead`

---

## sceneId：`chapter2_memory_card_hint`

### 场景内容

陈明说：

> “像是一个小盒子，或者存储卡。
> 她一直攥着，不让我看。”

玩家意识到：林夏手里的东西可能就是她说的“证据”。

### 效果

设置 flag：`memoryCardKnown = true`

### 玩家选项

#### 选项 A：继续问旧站台

跳转：`chapter2_old_platform_hint`

#### 选项 B：结束通话，开始查监控

跳转：`chapter3_monitor_room`

---

## sceneId：`chapter2_old_platform_hint`

### 场景内容

玩家问：

> “她有没有提到旧站台？”

陈明马上否认：

> “没有。她没说。”

但他否认得太快了。
像是早就准备好这个答案。

### 效果

设置 flag：`chenDeniedTooFast = true`

### 玩家选项

#### 选项 A：假装接受他的说法

跳转：`chapter2_final_choice`

#### 选项 B：指出他的反应太快

跳转：`chapter2_chen_cornered`

---

## sceneId：`chapter2_static_lead`

### 场景内容

玩家问：

> “你车附近有没有信号干扰？比如收音机杂音，手机没信号？”

陈明明显停顿。

他说：

> “南门那边有辆灰色面包车。
> 我经过的时候，计价器都跳了一下。”

这印证了静电线索。

### 效果

设置 flag：`confirmedInterferenceVan = true`

### 玩家选项

#### 选项 A：问车牌

跳转：`chapter2_plate_hint`

#### 选项 B：问车里有几个人

跳转：`chapter2_people_hint`

---

## sceneId：`chapter2_plate_hint`

### 场景内容

陈明说：

> “雨太大，我只看到最后两位，好像是 47。”

如果玩家 Chapter 0 或 Chapter 1 看过南门监控，也会发现后两位一致。

### 效果

设置 flag：`plate47Known = true`

### 玩家选项

#### 选项 A：进入最终判断

跳转：`chapter2_final_choice`

---

## sceneId：`chapter2_people_hint`

### 场景内容

陈明说：

> “至少两个人。
> 一个在车里，一个去了旧站台方向。”

这说明危险人物可能已经进入车站内部区域。

### 效果

设置 flag：`twoSuspectsKnown = true`

### 玩家选项

#### 选项 A：进入最终判断

跳转：`chapter2_final_choice`

---

## sceneId：`chapter2_final_choice`

### 场景内容

电话还没挂。
玩家面前有三个方向：

1. 相信陈明，说林夏已经离开。
2. 继续调查旧站台。
3. 尝试报警或通知调度。

屏幕上显示玩家目前的线索数量。

### 玩家选项

#### 选项 A：相信陈明，到此为止

跳转：`ending_loose_ends`

#### 选项 B：整理线索，继续查旧站台

条件：需要 `clue_wrong_number_doubt`
跳转：`ending_truth_uncovered`

#### 选项 C：立刻通知调度中心

条件：如果有 `confirmedInterferenceVan` 或 `plate47Known`
跳转：`chapter3_dispatch_call`

---

# Chapter 3：旧站台调查

这一章是我建议你后续新增的部分。
如果你想让游戏更完整，不要让 `ending_truth_uncovered` 直接结束，而是让它成为 Chapter 3 的入口。

---

## sceneId：`ending_truth_uncovered`

### 建议修改

不要作为最终结局。
改成“真相初步揭开”的桥接场景。

### 场景内容

玩家把线索连起来：

* 林夏来电来自旧站台内部号码。
* 陈明知道林夏名字，却说不清来源。
* 南门灰色面包车造成信号干扰。
* 林夏提醒过：不要相信说见过她的人。

玩家终于明白：

> 陈明的电话不是为了帮林夏。
> 是为了让值班室停止调查。

值班室里的旧站台监控突然亮了一秒。
画面中，一个女人从维修门后面跑过。
她手里攥着一个透明袋子。

### 玩家选项

#### 选项 A：打开旧站台监控

跳转：`chapter3_monitor_room`

#### 选项 B：先通知调度中心

跳转：`chapter3_dispatch_call`

---

## sceneId：`chapter3_dispatch_call`

### 场景内容

玩家尝试联系调度中心。
普通电话仍然受干扰，但内部调度线还能勉强接通。

调度员说：

> “北桥站旧站台区域理论上已经封闭。
> 你不要独自进入。
> 我们会通知附近巡逻人员。”

但是调度员也提醒：

> “最近十分钟内，没有任何正式维修人员进入北桥站。”

说明旧站台里的人不是官方人员。

### 效果

设置 flag：`dispatchWarned = true`

### 玩家选项

#### 选项 A：留在值班室，通过监控引导林夏

跳转：`chapter3_monitor_room`

#### 选项 B：拿钥匙去旧站台

跳转：`chapter3_go_alone_warning`

---

## sceneId：`chapter3_monitor_room`

### 场景内容

玩家切换旧站台监控。
画面很差，但能看到三个区域：

1. 旧 3 号站台
2. 南门维修通道
3. 配电间走廊

林夏可能在其中一个区域。
玩家必须判断先看哪里。

### 玩家选项

#### 选项 A：查看旧 3 号站台

跳转：`chapter3_platform3`

#### 选项 B：查看南门维修通道

跳转：`chapter3_south_tunnel`

#### 选项 C：查看配电间走廊

跳转：`chapter3_power_corridor`

---

## sceneId：`chapter3_platform3`

### 场景内容

画面里有一排旧座椅。
其中一张座椅下面，有一只白色鞋子。
这和陈明描述的“白色鞋”一致。

但画面角落里还有一个黑影。
那个人正在找什么。

### 效果

设置 flag：`foundLinXiaTrace = true`

### 玩家选项

#### 选项 A：用广播提醒林夏不要出声

跳转：`chapter3_broadcast_coded`

#### 选项 B：打开旧站台灯光

跳转：`chapter3_turn_on_lights`

#### 选项 C：切到其他监控

跳转：`chapter3_monitor_room`

---

## sceneId：`chapter3_south_tunnel`

### 场景内容

南门维修通道画面里有雨水流进来。
一辆灰色面包车停在门外。
车后门半开着。

如果玩家有 `plate47Known`，这里会确认车牌后两位就是 47。

### 效果

设置 flag：`vanConfirmedOnCamera = true`

### 玩家选项

#### 选项 A：锁死南门电子门

跳转：`chapter3_lock_south_gate`

#### 选项 B：继续观察车内动静

跳转：`chapter3_van_observe`

---

## sceneId：`chapter3_power_corridor`

### 场景内容

配电间走廊空无一人。
但地上有一条湿脚印，从南门方向通向旧站台。

这说明有人刚进入过。

### 效果

设置 flag：`wetFootprintsFound = true`

### 玩家选项

#### 选项 A：锁住通往值班区的门

跳转：`chapter3_lock_staff_door`

#### 选项 B：继续查看旧站台

跳转：`chapter3_platform3`

---

## sceneId：`chapter3_go_alone_warning`

### 场景内容

玩家拿起南门钥匙。
值班室门口的灯闪了一下。

系统提示：

> “你不是警察。
> 如果现在离开值班室，你会失去监控、广播和调度线。”

### 玩家选项

#### 选项 A：仍然独自前往旧站台

跳转：`ending_bad_alone`

#### 选项 B：回到监控台

跳转：`chapter3_monitor_room`

---

## sceneId：`chapter3_broadcast_coded`

### 场景内容

玩家不能直接喊“林夏快跑”，因为坏人也可能听见。
于是玩家用车站广播说：

> “旧 3 号站台设备巡检即将开始。
> 请无关人员离开黄色警戒线。”

这句话表面像普通广播，但林夏能理解：
有人在帮她，并且提醒她离开站台边缘。

### 效果

设置 flag：`codedBroadcastUsed = true`

### 玩家选项

#### 选项 A：打开站台灯

跳转：`chapter3_turn_on_lights`

#### 选项 B：继续观察

跳转：`chapter3_platform_wait`

---

## sceneId：`chapter3_turn_on_lights`

### 场景内容

旧站台灯光一排排亮起。
黑影被迫躲进柱子后面。

林夏从座椅后面抬头。
她看向监控摄像头，举起手里的透明袋子。

袋子里是一个小存储卡。

### 效果

设置 flag：`linXiaSeenAlive = true`

### 玩家选项

#### 选项 A：通过广播引导她去值班区侧门

跳转：`chapter4_guide_lin_xia`

#### 选项 B：先锁南门，防止坏人逃走

跳转：`chapter3_lock_south_gate`

---

## sceneId：`chapter3_platform_wait`

### 场景内容

玩家选择继续观察。
黑影慢慢接近座椅。

林夏没有动。
她可能不敢确认广播是不是给她的。

### 玩家选项

#### 选项 A：再次广播，但说得更明确

跳转：`chapter3_broadcast_coded`

#### 选项 B：打开灯

跳转：`chapter3_turn_on_lights`

---

## sceneId：`chapter3_lock_south_gate`

### 场景内容

玩家从值班系统里锁死南门电子门。
屏幕显示：

> “南门：已锁定。”

几秒后，南门监控里有人猛地拉门。
他发现门打不开，开始用手机联系别人。

### 效果

设置 flag：`southGateLocked = true`

### 玩家选项

#### 选项 A：通知调度中心南门有人

跳转：`chapter3_dispatch_update`

#### 选项 B：回到旧站台画面

跳转：`chapter3_turn_on_lights`

---

## sceneId：`chapter3_van_observe`

### 场景内容

玩家盯着灰色面包车。
车里有人正在拆一台小设备。
设备指示灯一闪一闪，和电话里的静电声节奏很像。

### 效果

设置 flag：`jammerSeen = true`

### 玩家选项

#### 选项 A：锁南门

跳转：`chapter3_lock_south_gate`

#### 选项 B：记录设备画面

设置 flag：`jammerEvidenceSaved = true`
跳转：`chapter3_lock_south_gate`

---

## sceneId：`chapter3_lock_staff_door`

### 场景内容

玩家锁住通往值班区的内部门。
这保护了自己，也切断了对方进入值班室的路线。

### 效果

设置 flag：`staffDoorLocked = true`

### 玩家选项

#### 选项 A：回到监控台

跳转：`chapter3_monitor_room`

---

## sceneId：`chapter3_dispatch_update`

### 场景内容

玩家把南门情况告诉调度中心。
调度员说：

> “巡逻车还有五分钟到。
> 你现在最重要的是不要让林夏落到他们手里。”

### 效果

设置 flag：`patrolOnWay = true`

### 玩家选项

#### 选项 A：引导林夏撤离

跳转：`chapter4_guide_lin_xia`

---

# Chapter 4：最终选择

---

## sceneId：`chapter4_guide_lin_xia`

### 场景内容

林夏还在旧站台。
玩家可以通过广播、灯光和门禁系统引导她。

屏幕上有三条路：

1. 去南门：最近，但有灰色面包车。
2. 去值班区侧门：较安全，但需要穿过配电走廊。
3. 留在旧站台：等巡逻人员到，但黑影也在附近。

### 玩家选项

#### 选项 A：引导她去南门

如果 `southGateLocked = false`，风险高。
跳转：`chapter4_south_gate_route`

#### 选项 B：引导她去值班区侧门

如果 `staffDoorLocked = true`，需要远程解锁。
跳转：`chapter4_staff_route`

#### 选项 C：让她留在原地等巡逻

如果 `patrolOnWay = true`，可行。
跳转：`chapter4_wait_for_patrol`

---

## sceneId：`chapter4_south_gate_route`

### 场景内容

林夏往南门方向跑。
但灰色面包车还在门外。
如果南门没有锁，车里的人会提前下车堵她。

### 条件分支

#### 如果 `southGateLocked = true`

她无法从南门出去，但坏人也进不来。
跳转：`chapter4_redirect_from_south`

#### 如果 `southGateLocked = false`

坏人从南门进入。
跳转：`ending_failed_interception`

---

## sceneId：`chapter4_redirect_from_south`

### 场景内容

林夏到达南门，发现门打不开。
她慌了。

玩家广播：

> “南门封闭，请从左侧维修走廊撤离。”

她转身跑向配电走廊。

### 玩家选项

#### 选项 A：切换配电走廊监控

跳转：`chapter4_staff_route`

---

## sceneId：`chapter4_staff_route`

### 场景内容

林夏跑进配电走廊。
她身后的黑影也追了过来。

玩家可以操作两道门：

* A 门：挡住追她的人
* B 门：让林夏进入值班区

### 玩家选项

#### 选项 A：先关 A 门

效果：挡住追踪者
设置 flag：`chaserBlocked = true`
跳转：`chapter4_open_b_door`

#### 选项 B：先开 B 门

效果：林夏能进来，但追踪者可能也跟上
跳转：`chapter4_risky_entry`

---

## sceneId：`chapter4_open_b_door`

### 场景内容

A 门关上，黑影被挡在另一边。
他用力撞门。

林夏跑到 B 门前。
玩家打开 B 门。

林夏冲进值班区，手里还拿着存储卡。

### 效果

设置 flag：`linXiaRescued = true`

### 玩家选项

#### 选项 A：让她把证据交给你

跳转：`chapter4_evidence_choice`

---

## sceneId：`chapter4_risky_entry`

### 场景内容

玩家先打开 B 门。
林夏冲进来，但黑影也快到门口。

如果之前锁过员工区门或通知过调度，这里可以补救。
否则进入危险结局。

### 条件分支

#### 如果 `staffDoorLocked = true` 或 `dispatchWarned = true`

跳转：`chapter4_close_after_entry`

#### 否则

跳转：`ending_bad_alone`

---

## sceneId：`chapter4_close_after_entry`

### 场景内容

玩家在最后一秒关上门。
黑影撞在门外。
林夏靠着墙滑坐下来，手一直发抖。

她把透明袋子递给玩家。

### 效果

设置 flag：`linXiaRescued = true`

### 玩家选项

#### 选项 A：接过证据

跳转：`chapter4_evidence_choice`

---

## sceneId：`chapter4_wait_for_patrol`

### 场景内容

玩家让林夏留在旧站台等巡逻人员。
这是最守规矩的做法，但风险是坏人也在附近。

### 条件分支

#### 如果 `patrolOnWay = true` 且 `codedBroadcastUsed = true`

林夏理解玩家的意思，躲到了安全角落。
跳转：`ending_rescue_but_partial_truth`

#### 如果没有通知调度

等待太久，黑影找到她。
跳转：`ending_loose_ends`

---

## sceneId：`chapter4_evidence_choice`

### 场景内容

林夏说：

> “这里面是他们进出旧通道的视频。
> 还有车牌。
> 但如果你现在交出去，他们会知道是我拍的。”

玩家必须做最终选择。

### 玩家选项

#### 选项 A：立刻把证据发给调度和警方

条件：如果 `dispatchWarned = true` 或 `patrolOnWay = true`，最好。
跳转：`ending_full_truth`

#### 选项 B：先保护林夏，只保存本地副本

跳转：`ending_rescue_but_partial_truth`

#### 选项 C：害怕惹麻烦，把证据还给林夏

跳转：`ending_silence`

---

# Endings：结局设计

---

## Ending A：`ending_full_truth`

中文名：真相公开

### 达成条件

建议要求：

* 有 `clue_wrong_number_doubt`
* 有 `clue_static_interference`
* 有 `clue_lin_xia_hesitation`
* `linXiaRescued = true`
* `dispatchWarned = true` 或 `patrolOnWay = true`
* 最后选择提交证据

### 结局内容

调度中心收到视频。
巡逻人员赶到南门，控制住灰色面包车里的两个人。
陈明也被找到，但他没有逃。他主动交代自己被威胁参与误导电话。

天快亮时，林夏坐在值班室里，手里捧着热水。

她说：

> “我以为今晚没人会信我。”

玩家看向窗外。
雨停了。
北桥站的广播第一次恢复清晰。

### 结局评价

最佳结局。
玩家救下林夏，也保住证据。

---

## Ending B：`ending_rescue_but_partial_truth`

中文名：人救下了，但真相未全

### 达成条件

* `linXiaRescued = true`
* 但没有完整提交证据，或没有锁住南门，或没有确认干扰车

### 结局内容

林夏活了下来。
但灰色面包车在巡逻车到来前离开。
陈明也消失了。

存储卡里的视频不完整，只能证明有人进入旧站台，却不能证明是谁组织的。

几天后，林夏离开了这座城市。
玩家收到一条陌生短信：

> “谢谢你。
> 但他们还没结束。”

### 结局评价

中等偏好结局。
救人成功，但主谋未抓。

---

## Ending C：`ending_loose_ends`

中文名：线索未合拢

### 达成条件

* 玩家没有拿到关键线索
* 或相信陈明
* 或选择不继续查

### 结局内容

夜班结束。
雨停了。
接班同事问：

> “昨晚没出什么事吧？”

玩家看着记录本。
上面只有几个模糊词：

> 林夏。
> 静电。
> 南门。
> 陈明。

新闻没有报道失踪案。
系统记录里也没有那通旧站台电话。

只有玩家知道，那一晚一定发生过什么。

### 结局评价

普通结局。
没有失败，但真相被错过。

---

## Ending D：`ending_failed_interception`

中文名：错误路线

### 达成条件

* 玩家引导林夏去南门
* 但没有锁南门
* 或没有确认灰色面包车危险

### 结局内容

林夏跑向南门。
监控里，灰色面包车的车门打开。

下一秒，画面变成雪花。

几分钟后，电话再次响起。
陈明的声音从听筒里传来：

> “我说过，别查南门。”

然后电话挂断。

### 结局评价

坏结局。
玩家做了行动，但判断错了。

---

## Ending E：`ending_bad_alone`

中文名：独自下去

### 达成条件

* 玩家离开值班室，独自前往旧站台
* 或没有利用监控/广播/门禁系统

### 结局内容

玩家拿着钥匙走进旧站台。
灯光一闪一闪。
远处有人喊了一声：

> “值班员？”

玩家回头，身后的门已经关上。
电话没有信号。
监控也看不见这里。

最后画面停在值班室空着的椅子上。
电话铃声一直响，但没人接。

### 结局评价

最坏结局。
强调主角不是警察，不应该脱离岗位单独行动。

---

## Ending F：`ending_silence`

中文名：沉默

### 达成条件

* 玩家救下林夏
* 但最后选择不提交证据

### 结局内容

林夏拿回存储卡。
她没有怪玩家。

她只是说：

> “我明白。你也只是想活得安稳。”

几天后，北桥站旧站台被彻底封闭。
南门监控被更换。
所有记录都显示那晚“无异常”。

玩家继续值夜班。
但每到下雨天，电话偶尔会响一声。
接起来，却只有静电声。

### 结局评价

道德灰色结局。
人活了，但真相被埋掉。

---

# 推荐主线最佳路线

如果你之后想设计一个“官方真结局路线”，可以这样安排：

```text
chapter0_arrival
→ 查看交接记录
→ 检查监控，注意南门车辆
→ 接林夏电话
→ 检查来电号码，获得错误号码疑点
→ 追问但改用 yes/no 问题，获得林夏迟疑
→ 注意静电声，获得异常静电
→ 第二通电话，陈明出现
→ 质疑陈明为什么知道林夏名字
→ 问南门灰色面包车
→ 确认信号干扰
→ 查旧站台监控
→ 用广播暗示林夏
→ 打开旧站台灯
→ 锁南门
→ 通知调度
→ 引导林夏走值班区侧门
→ 先关 A 门挡住追踪者
→ 再开 B 门救林夏
→ 提交证据
→ ending_full_truth
```

---

# 玩家体验节奏

你写游戏时要控制节奏：

## 前 30%

重点是“不确定”。

玩家不知道：

* 林夏是不是真的
* 电话是不是恶作剧
* 车站是不是有问题

## 中间 40%

重点是“矛盾越来越多”。

玩家发现：

* 来电号码不对
* 陈明知道不该知道的信息
* 南门真的有车
* 静电不是巧合

## 最后 30%

重点是“行动选择”。

玩家不再只是接电话，而是使用：

* 监控
* 广播
* 门禁
* 调度线

这会让游戏从“文字推理”变成“远程救援”。

---

# 最重要的设计原则

## 1. 玩家不能靠运气赢

每个正确选择都要有前面的线索支撑。

例如：

玩家为什么不该相信陈明？

因为：

* 林夏提醒过“不要马上信说见过我的人”
* 陈明主动知道林夏名字
* 时间线对不上
* 来电号码显示林夏仍在旧站台附近

---

## 2. 坏结局不能显得无理

如果玩家失败，原因要清楚。

例如：

* 没锁南门，所以坏人能进来
* 独自下去，所以失去监控优势
* 没有确认面包车危险，所以引导林夏走错路

---

## 3. 陈明不能写成纯坏人

他最好是“灰色人物”。

这样剧情更有层次：

* 他参与了误导
* 但他也害怕
* 他会暗示玩家别去南门
* 真结局里他可以作证

---

## 4. 林夏的迟疑要反转

前期玩家以为她可疑。
后期才明白：

> 她不是在编故事，她是在避免让旁边的人听懂。

这个反转很关键。

---

# 你后续写代码时的阶段建议

不要一次性把全部 Chapter 3 和 Chapter 4 都写进去。建议分三次做。

## Phase 6：把 `ending_truth_uncovered` 改成 Chapter 3 入口

新增：

```text
chapter3_dispatch_call
chapter3_monitor_room
chapter3_platform3
chapter3_south_tunnel
chapter3_power_corridor
```

先让玩家能调查旧站台。

---

## Phase 7：加入远程救援玩法

新增：

```text
chapter3_broadcast_coded
chapter3_turn_on_lights
chapter3_lock_south_gate
chapter4_guide_lin_xia
chapter4_staff_route
```

让监控、广播、门禁形成玩法。

---

## Phase 8：加入最终结局

新增：

```text
ending_full_truth
ending_rescue_but_partial_truth
ending_failed_interception
ending_bad_alone
ending_silence
```

并保留：

```text
ending_loose_ends
```

作为普通结局。

---

# 最终一句话总结

这个游戏的核心不是“找鬼”或者“抓坏人”，而是：

> 玩家作为一个普通夜班值班员，只能通过电话、监控、广播和门禁，在信息不完整的情况下判断谁可信，并决定是否救一个被困在雨夜旧站台里的女孩。


