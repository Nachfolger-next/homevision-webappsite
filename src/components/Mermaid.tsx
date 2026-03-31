'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svgStr, setSvgStr] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });

    const renderMermaid = async () => {
      try {
        if (ref.current) {
          const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvgStr(svg);
          setError(false);
        }
      } catch (e) {
        console.error('Failed to render Mermaid chart', e);
        setError(true);
      }
    };

    renderMermaid();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-mono overflow-auto">
        Failed to render diagram. Check Mermaid syntax.
        <pre className="mt-2 text-xs">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid-wrapper flex justify-center my-8 overflow-x-auto bg-white p-4 rounded-xl shadow-sm border border-neutral-100"
      dangerouslySetInnerHTML={{ __html: svgStr }}
    />
  );
}
