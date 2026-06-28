# Graph Report - d:\Playground\shopping-cart-backend  (2026-06-28)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 17 nodes · 15 edges · 4 communities (3 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `scripts` - 2 edges
2. `main` - 1 edges
3. `cors` - 1 edges
4. `express` - 1 edges
5. `sqlite3` - 1 edges
6. `__dirname` - 1 edges
7. `dbPath` - 1 edges
8. `db` - 1 edges
9. `app` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (4 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.33
Nodes (5): description, main, name, type, version

### Community 1 - "Community 1"
Cohesion: 0.40
Nodes (4): app, db, dbPath, __dirname

### Community 2 - "Community 2"
Cohesion: 0.50
Nodes (4): dependencies, cors, express, sqlite3

## Knowledge Gaps
- **13 isolated node(s):** `name`, `version`, `description`, `main`, `type` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Why does `scripts` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._