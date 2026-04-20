import React, { useEffect, useRef, useState } from 'react';

/**
 * MermaidChart — Mermaid dynamically imported to split out of main bundle.
 * 主 bundle 不再包含 mermaid 核心（~584KB），只在實際 render 到 chart 時
 * lazy load（flowchart-elk / mindmap / sequenceDiagram 等 sub-chunks
 * Vite 已自動 code-split）。
 */

let mermaidIdCounter = 0;

// Cached mermaid module after first dynamic import
type MermaidModule = typeof import('mermaid').default;
let mermaidModulePromise: Promise<MermaidModule> | null = null;
let mermaidInitialized = false;

const INIT_CONFIG = {
  startOnLoad: false,
  theme: 'base' as const,
  themeVariables: {
    primaryColor: '#141b28',
    primaryTextColor: '#e8e4d8',
    primaryBorderColor: '#c9a84c',
    lineColor: '#a68a3f',
    background: '#0a0d14',
    mainBkg: '#141b28',
    nodeBorder: '#c9a84c',
    clusterBkg: '#0f1520',
    titleColor: '#c9a84c',
    edgeLabelBackground: '#0f1520',
    fontFamily: 'Noto Sans TC, Inter, sans-serif',
  },
  flowchart: { curve: 'basis' as const },
  securityLevel: 'loose' as const,
};

function loadMermaid(): Promise<MermaidModule> {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid').then((mod) => {
      const m = mod.default;
      if (!mermaidInitialized) {
        m.initialize(INIT_CONFIG);
        mermaidInitialized = true;
      }
      return m;
    });
  }
  return mermaidModulePromise;
}

interface MermaidChartProps {
  diagram: string;
  fallbackText?: string;
}

export default function MermaidChart({ diagram, fallbackText }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<string>('');
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!diagram || !diagram.trim()) {
      setIsLoading(false);
      return;
    }

    mermaidIdCounter += 1;
    idRef.current = `mermaid-chart-${mermaidIdCounter}`;

    let cancelled = false;

    const render = async () => {
      setIsLoading(true);
      setError('');
      setSvgContent('');

      try {
        const mermaid = await loadMermaid();
        if (cancelled) return;

        // Clean accidental code-fence backticks
        let cleanDiagram = diagram.trim();
        if (cleanDiagram.startsWith('```mermaid')) {
          cleanDiagram = cleanDiagram
            .replace(/^```mermaid\s*/, '')
            .replace(/```\s*$/, '');
        } else if (cleanDiagram.startsWith('```')) {
          cleanDiagram = cleanDiagram
            .replace(/^```\s*/, '')
            .replace(/```\s*$/, '');
        }

        const { svg } = await mermaid.render(idRef.current, cleanDiagram);

        if (!cancelled) {
          setSvgContent(svg);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[MermaidChart] Render failed, showing fallback:', err);
          setError(err instanceof Error ? err.message : String(err));
          setIsLoading(false);
        }
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [diagram]);

  if (isLoading) {
    return (
      <div style={{
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 6,
        padding: '12px 16px',
        color: 'rgba(201,168,76,0.5)',
        fontSize: '0.78rem',
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>◈</span>
        渲染架構圖中...
      </div>
    );
  }

  if (error || !svgContent) {
    return (
      <div style={{
        border: '1px solid rgba(201,168,76,0.15)',
        borderRadius: 6,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: '0.72rem', color: 'rgba(201,168,76,0.5)', marginBottom: 6, fontFamily: 'monospace' }}>
          ◈ 架構圖（純文字模式）
        </div>
        <pre style={{
          fontSize: '0.78rem',
          color: '#8a8a9a',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
          fontFamily: 'monospace',
          lineHeight: 1.6,
        }}>
          {fallbackText || diagram}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        overflowX: 'auto',
        background: 'transparent',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: 6,
        padding: 12,
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
