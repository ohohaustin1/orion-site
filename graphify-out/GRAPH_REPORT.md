# Graph Report - .  (2026-04-10)

## Corpus Check
- Corpus is ~24,883 words - fits in a single context window. You may not need a graph.

## Summary
- 98 nodes · 147 edges · 11 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `app` - 17 edges
2. `languagecontext` - 15 edges
3. `dashboardlayout` - 13 edges
4. `warroom` - 13 edges
5. `button` - 11 edges
6. `newanalysis` - 10 edges
7. `sonner` - 9 edges
8. `engineerhandoff` - 8 edges
9. `utils` - 7 edges
10. `analysisresult` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "analysisresult"
Cohesion: 0.16
Nodes (2): generateMockAnalysis(), handleSubmit()

### Community 1 - "const"
Cohesion: 0.14
Nodes (0): 

### Community 2 - "exportpdf"
Cohesion: 0.12
Nodes (0): 

### Community 3 - "app"
Cohesion: 0.15
Nodes (0): 

### Community 4 - "button"
Cohesion: 0.21
Nodes (0): 

### Community 5 - "contactformmodal"
Cohesion: 0.22
Nodes (2): handleSubmit(), validate()

### Community 6 - "report"
Cohesion: 0.5
Nodes (0): 

### Community 7 - "postcss_config"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "enums"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "tailwind_config"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "vite_config"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `postcss_config`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `enums`** (1 nodes): `enums.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `tailwind_config`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `vite_config`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.