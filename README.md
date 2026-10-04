# Nooc site

`nooc.top` 的全部内容：介绍页、支持页、隐私政策和 404 页。纯 HTML/CSS/JS，无构建步骤，无外部字体和 CDN（中文用系统字体，国内访问不受影响）。

源文件在 `noocmob/landing/`，发布仓库是 [Charlo-O/nooc-pages](https://github.com/Charlo-O/nooc-pages)（GitHub Pages，`main` 分支根目录，自定义域名见 `CNAME`）。

```
index.html          介绍页
support/index.html  支持与联系（App Store Connect 登记的支持网址）
privacy/index.html  隐私政策（App Store Connect 登记的隐私政策网址）
404.html            找不到页面时显示，资源路径均为根路径
styles.css          样式，设计变量取自 apps/mobile/src/theme.ts
main.js             分析步骤切换、宣传片播放、关系图高亮
assets/             图标、宣传片、分享图、App Store 二维码
CNAME / .nojekyll   GitHub Pages 配置
```

本地预览：

```bash
python3 -m http.server 4318 --directory landing
```

## 发布

把 `landing/` 的内容整体同步到 `nooc-pages` 仓库根目录，推送到 `main` 即可。`support/` 和 `privacy/` 两个地址已登记在 App Store Connect，不要删除或改路径。

## 素材来源

- 图标：`apps/mobile/assets/images/icon.png` 缩放。
- `nooc-promo.mp4`：由 `promo/nooc-promo-30s.mp4` 转码为 720p，片尾“开源 MIT / GitHub 地址”一行已遮掉。
- `og.jpg`：宣传片片尾帧（同样去掉了那一行）；`promo-poster.jpg`：宣传片 17.6 秒的图谱画面。
- `qr-app-store.svg`：指向 `https://apps.apple.com/app/id6761608226`。
- 介绍页中的示例数据来自 App 内置案例《林晚照 × 江砚》的真实分析输出。
- 隐私政策正文与 `src/app/privacy/page.tsx` 一致；支持页“常见说明”已按 2.0 的端侧默认模式更新。
