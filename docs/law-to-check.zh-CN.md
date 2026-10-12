[English](law-to-check.md) · 简体中文 · [ไทย](law-to-check.th.md)

# 法，对着检查，对着研究

**审计日：** 2026-09-10。可复现：`node lint/laws-check.mjs`。
**再读一次：** 2026-10-12。对着当前源码和一次渲染。英文原文在 [law-to-check.md](law-to-check.md)。数字若有出入，以代码和那份英文为准。

> 「下面每一条法都有一个检查——执行它的规则编号。没有检查的法是愿望。前三次 MoMA 清扫没能留下来，就是因为它们只是愿望。」
> —— [LAWS.md](../LAWS.md)

这句话是仓库的中心承诺。这一页检验它，因为一条关于「有没有执行」的承诺，本身就是可以量的。三件事情是真的，而且不好听：

1. **第一条法的静态检查不存在。** `origin-mechanism` 写在 `LAWS.md` 里，仓库里没有任何实现。这条立库的法——仓库就是为它命名的——靠一个愿望在执行。
2. **四条法只靠把一段脚本贴进控制台。** CI 对 `examples/` 跑静态检查，再跑 `lint/self-check.mjs` 和 `lint/laws-check.mjs`。它从不跑运行时审计，所以第一、四、六、七条完全没有自动化的执行。
3. **还有一条检查跟它要执行的法矛盾。** 用第八条法自己引用的强调线粗，会得到 `hairline` 违规。另一处矛盾——第五条法要求 160 / 220 / 280——在这次审计的当天早上是真的，同一天合上了。失败的记录留在下面。那不是 `LAWS.md` 现在的文本。

---

## 表

| 法 | `LAWS.md` 里的检查 | 实现了 | 在 CI | 跟法一致 |
|---|---|---|---|---|
| **一** 一个原点 | `origin-mechanism`（静态） | **没有——仓库里哪里都没有** | 否 | — |
| **一** 一个原点 | `near-miss`（运行时） | 是 | **否** | 是 |
| **二** 一套间距 | `spacing-scale` | 是 | 是 | 是 |
| **三** 字号与行距是一个记号 | `type-scale` | 部分 | 是 | **只查字号** |
| **四** 格子必须填满 | `orphan-grid`（运行时） | 是 | **否** | 是 |
| **五** 一页一个节奏 | `grid-density` | 是 | 是 | **是——2026-09-10 已改** |
| **六** 同一副骨架 | `ragged-row`（运行时） | 是 | **否** | 是 |
| **七** 不许差一点 | `near-miss`（运行时） | 是 | **否** | 是 |
| **八** 一根发丝线 | `hairline` | 是 | 是 | **否——见下** |
| **九** 直角 | `radius-zero` | 是 | 是 | 是 |
| **十** 一个数只说一次 | 人来审 | 不适用 | 不适用 | 有意如此 |

八个检查编号有实现。`type-scale` 是其中之一，而且只读字号。`origin-mechanism` 被命名，没有被写出来。第一、四、六、七条不在 CI 里跑。第八条仍跟它引用的强调线粗矛盾。第五条从 2026-09-10 起与 `lint/scale.mjs` 一致。

---

## 两处矛盾，其中一处已是历史

### 第五条曾经要求 `scale.mjs` 当作反例的那些数

审计当天早上，`LAWS.md` 的第五条写着：*「一页可以用三个：160、220、280。」*

`lint/scale.mjs` 在 `DENSITY` 自己的注释里写着：不是跨栏宽度的下限（160、220、240……）会落到 5、7、9、11 列，12 栏的页面无法与之对齐。

法要求的，正好是源头列为坏掉的那三个值。一份严格守法的样式表：

```css
.tight  { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
.normal { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.wide   { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
```

```
$ node lint/moma-lint.mjs that-file --strict
  MoMA LINT — 3 violations
        3  grid-density
      only 608/400/296/192px are permitted column minimums
```

**守法，构建失败。** `self-check.mjs` 全程报告「推导都成立」，因为它拿 `scale.mjs` 对自己，从不读 `LAWS.md`。检查器看不见它要保护的那份文件。

2026-09-10 改过：第五条现在写的是从跨栏推出来的密度。错的是散文。`scale.mjs`、`docs/grid.md` 和检查器彼此已经一致。`lint/laws-check.mjs` 现在读散文，这一类不能再悄悄回来。

### 第八条禁止它自己当作先例引用的强调线粗

第八条：*「一种线粗（1px），一种线色。2px 的边框是第二种设计语言，在跟第一种吵架。」* 两行之后，作为它自己的证据：*「线是 `.1rem`（1px）实线；`.2rem` 和 `.3rem` 只作为有意的强调，从不当成默认边框。」*

```
$ node lint/moma-lint.mjs a-file-using-2px-and-3px-emphasis --strict
  MoMA LINT — 2 violations
        2  hairline
      one border weight only (1px) — 2px is a second language
```

测到的 MoMA 行为（研究编号 R7）是 **一个默认，加上两种强调**。法把它收成一个允许值。故意不解决：这是收紧的决定，不是算错。见 [v2 提案](proposals/v2-architecture.md)（英文）。

---

## 更大的缺口：研究没有变成法

[docs/moma-study.md](moma-study.md) 第 0 节的标题是 **「硬的、可以检查的规则」**，列了二十五条，每条都测过、都有出处。对着可执行的那一层：

| 研究发现 | 状态 |
|---|---|
| R6 4px 间距 | **法 + 检查**（第二条） |
| R7 发丝线 1px，2–3px 作强调 | 法 + 检查（第八条），**检查不同意** |
| R3a 字号和行距来自一个记号 | 法（第三条），**检查不测这一对** |
| R5 列公式 n ∈ 1–6 | **有意分叉**，写在 `moma-vs-us.md` |
| R1 机构声音里没有 `text-transform` | 研究过 · **无法 · 无检查** |
| R3b 只用两种字重，900 和 400 | 研究过 · **无法 · 无检查** |
| R4 一个家族，系统里没有衬线 | 研究过 · **无法 · 无检查** |
| R8 无彩色的铬框——876KB 里 3 个有彩色的值 | 研究过 · **无法 · 无检查** |
| R9 一套关闭的宽高比 | 研究过 · **无法 · 无检查** |
| R9a 外页边 80px，1440 时内网格原点 128px | 研究过 · **无法 · 无检查** |
| R17 两层治理——28 个锁死，12 个自由 | 研究过 · **无法 · 无机制** |
| R24 展览和目录按写明的政策豁免 | 研究过 · **无法 · 无机制** |
| R25 作品完整，编辑性裁切从 2009 开始 | 研究过 · **无法 · 无检查** |
| R10–R16、R19–R23 | 目录和标签的惯例——正确地活在 `styles/` 里，不是法 |

研究不薄。它搁浅了。二十五条可以检查的发现里，大约四条到了自动化检查。最能搬走的两条治理发现（R17、R24）完全没有机制。

**这才是 [v2 提案](proposals/v2-architecture.md) 真正该做的事**——而且它把提案自己的顺序倒过来。v2 要在地板上加三层（`LAWS` / `MOVES` / `REGISTERS`）。地板上有一条第一条法里的幻影检查，四条法在 CI 之外，还有一条检查跟它的法矛盾。**先把地板合上，再加层。** 一套构图词汇堆在没有执行的地基上，是第四次散文清扫，换了一顶帽子。

---

## 审计当天还找到的

这一页早先有一句，说 `lint/moma-lint.mjs` 和 `audit/near-miss.browser.js` 都指向 `audit/near-miss.mjs`。它们不指向。检查器指向 `audit/near-miss.browser.js`。那个文件说没有程序化的运行器，所以运行时的那一半不在 CI 里。`lint/` 和 `audit/` 里没有任何东西提到 `audit/near-miss.mjs`。

## 2026-10-12 再读

`examples/index.html` 在无头 Chrome 里渲染，视口 1280×900，`data-theme="dark"`，IBM Plex 已加载。同一天 `node lint/moma-lint.mjs examples --strict` 报告 0 条违规。

| 什么 | 测到 |
|---|---|
| `h1` | 64px / 65.28px，字重 700。声明是 `clamp(32px, 7vw, 64px)` 和 `line-height: 1.02`。 |
| 两个框 | 有边框的子元素 `+1px`；内阴影的子元素 `0px` |
| `.page` | 边框盒 1232px，左右各垫 24px，内宽 1184px |
| `.quote` | `border-left-width: 1px`，`padding-left: 16px` |

标题是第四档字号，`type-scale` 看不见，因为检查只匹配光秃秃的 `font-size: Npx`，而这个声明是 `clamp()`。引语的线是第一条法禁止的那种推移，粗细却是 `hairline` 允许的。该注意到这件事的检查是 `origin-mechanism`，它没有被写出来。

`lint/laws-check.mjs` 捕获 `micro 11/16` 里的行距那一半，不去比 `LEADING`。`type-scale` 从不读 `line-height`。

`lint/moma-lint.mjs` 走 `.tsx`、`.ts`、`.jsx`、`.js`、`.css`、`.scss`、`.html`。它不读 `.mjs`，所以检查器不检查自己。

第十条法让类别标签做「9px 的眉题」。9 不在 `TYPE`（11 / 14 / 32）里。`font-size: 9px` 会失败 `type-scale`。这句话规定了一个系统其余部分禁止的字号。照实留在这里。

`package.json` 有两个脚本。`lint` 跑 `node lint/moma-lint.mjs .`。`check` 只跑 `node lint/self-check.mjs`。没有 `audit` 脚本。CI 在 `.github/workflows/moma.yml` 里跑对 `examples/` 的严格检查、`self-check` 和 `laws-check`。它不把浏览器脚本贴进去。
