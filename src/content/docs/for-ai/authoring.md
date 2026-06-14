---
title: Authoring with AI
description: Writing Cyntex DSL with an AI agent — skill + MCP combined workflow
sidebar:
  order: 3
---

## Recommended Workflow

```
1. Import the Cyntex skill → AI learns DSL syntax
2. Describe your need in conversation → AI outputs YAML
3. cyntex validate → local three-layer validation
4. cyntex apply → deploy to running Cyntex
5. (optional) MCP real-time monitoring of runtime status
```

## Step 1: Help the AI Understand Cyntex

Provide the following URL to your AI:

```
https://docs.cyntex.io/llms.txt
```

Or paste the contents of `llms.txt` directly into the conversation. The AI will then understand Cyntex's core concepts and DSL syntax.

## Step 2: Describe Your Requirements

```
I have a MySQL database and I need to:
- Sync the users table to MongoDB in real time (CDC mode)
- Filter out records where deleted_at is not null
- Rename the user_id field to id

Please generate the corresponding .cyn.yml files
```

## Step 3: Validate the Generated YAML

```bash
cyntex validate user-sync.cyn.yml
```

AI-generated YAML may have minor errors. `validate` gives precise error locations and explanations. Feed the errors back to the AI for correction:

```
validate error:
  Error: Unknown field 'write_strategy' at sync[0].options
  Did you mean 'write_mode'?

Please fix this field name
```

## Best Practices

**Tips for prompting AI:**

- Clearly state the type of source and target (MySQL CDC → MongoDB)
- Specify which transforms are needed (filter, rename, enrichment)
- Mention whether DDL changes need to be handled (`ddl: apply`)
- Describe one pipeline at a time; split complex scenarios across multiple conversations

**Validate before deploying:**

`cyntex validate` is free — always run it before `apply`, especially for AI-generated content.

**Use explain to understand fields:**

```bash
cyntex explain pipeline.sync.options.write_mode
# Outputs field documentation, valid values, and defaults
```

## Combining with MCP

After the Alpha phase, AI can not only generate YAML but also deploy and monitor directly via MCP:

```
User: Check the lag on the user-sync task
AI: [calls get_pipeline_status("user-sync")]
    Current lag: 1.2s, past 1-hour average: 0.8s — status normal
```
