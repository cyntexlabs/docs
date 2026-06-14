# cyntex-docs

Cyntex 文档站源码，托管于 [docs.cyntex.io](https://docs.cyntex.io)。

基于 [Starlight](https://starlight.astro.build/)（Astro）构建。

## 本地开发

```bash
npm install
npm run dev       # http://localhost:4321
```

## 构建

```bash
npm run build     # 产物在 dist/
npm run preview   # 预览构建产物
```

## 内容结构

```
src/content/docs/
├── overview/         # 产品概述、架构、路线图
├── concepts/         # 核心概念（DSL、连接器、AI 控制层、存储）
├── reference/        # DSL 完整语法参考 + ADR 索引
└── for-ai/           # LLM 接入指南（llms.txt、MCP、authoring）

public/
├── llms.txt          # LLM 精简上下文（llmstxt.org 标准）
└── llms-full.txt     # LLM 完整上下文
```

## 内容更新原则

- `reference/dsl-grammar.md` 跟随 [ADR-0016](https://github.com/cyntex/cyntex/blob/main/docs/adr/0016-dsl-grammar.md) 更新
- `overview/roadmap.md` 跟随 [ADR-0018](https://github.com/cyntex/cyntex/blob/main/docs/adr/0018-first-landing-scope-replan.md) 更新
- `public/llms.txt` 每个里程碑完成后更新一次
- **不手动维护**与 JSON Schema 重复的内容——schema 是唯一真值源

## 部署

推荐 Cloudflare Pages 或 Vercel，连接 GitHub 仓库自动部署：
- 构建命令：`npm run build`
- 输出目录：`dist`
