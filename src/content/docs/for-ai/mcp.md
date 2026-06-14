---
title: MCP Integration
description: Let AI agents operate Cyntex in real time via the MCP protocol
sidebar:
  order: 2
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="note" title="Available in Alpha Phase">
  The MCP server is enabled in the **Alpha phase**. The current POC phase has only the offline CLI.
</Aside>

## Overview

Cyntex embeds an MCP server in-process (HTTP transport). An AI agent connects via the standard MCP protocol and gains real-time operational access to the running Cyntex instance.

```
AI Agent (Claude / GPT-4o …)
    │  MCP protocol (HTTP)
    ▼
Cyntex MCP server (in-process)
    │  direct call
    ▼
Control Core (CRUD + lifecycle + read-only runtime)
```

**Key design: the MCP server contains no LLM** — the model is on the user's agent side; Cyntex only provides the operational interface.

## Connecting

```
Server URL: http://localhost:7778/mcp
Auth: Bearer <token>
```

A localhost bootstrap token is automatically generated at startup (valid only on the local machine):

```bash
cyntex server --role=all
# Output: MCP server ready at http://localhost:7778/mcp
#         Bootstrap token: cyxt_xxxxxxxxxxxx
```

## Alpha Toolset (Read-Only + Scaffold)

| Tool | Description |
|---|---|
| `list_sources` | List all registered sources |
| `list_pipelines` | List all pipelines and their runtime status |
| `get_pipeline_status` | Query the status, lag, and error rate of a specific pipeline |
| `get_source_schema` | Get the table schema of a source (DiscoverSchema) |
| `scaffold_pipeline` | Generate a pipeline YAML draft from a source id and table name |
| `explain_field` | Look up documentation for any DSL field |
| `validate_yaml` | Validate a YAML content snippet (three-layer validation) |

## Beta Toolset (Full CRUD + Lifecycle)

In the Beta phase, all control core operations will be exposed as MCP tools:

- `create_source` / `update_source` / `delete_source`
- `apply_pipeline` / `delete_pipeline`
- `start_pipeline` / `stop_pipeline` / `restart_pipeline`
- `export_pipeline` (canonical YAML round-trip)

## Using with Claude

Add Cyntex MCP to Claude's MCP configuration:

```json
{
  "mcpServers": {
    "cyntex": {
      "url": "http://localhost:7778/mcp",
      "headers": {
        "Authorization": "Bearer cyxt_xxxxxxxxxxxx"
      }
    }
  }
}
```

Once configured, Claude can directly operate your Cyntex instance — create sources, deploy pipelines, and check runtime status.
