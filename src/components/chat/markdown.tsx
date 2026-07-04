"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Full markdown for assistant content: headings, lists, tables, code, inline
// styles. Styled with Tailwind class overrides (no external prose plugin).
export function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-3 text-[14px] leading-relaxed text-[var(--text-primary)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
          h1: ({ children }) => <h1 className="text-lg font-semibold">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
          a: ({ children, href }) => (
            <a href={href} className="text-[var(--accent)] underline underline-offset-2">
              {children}
            </a>
          ),
          code: ({ className, children }) =>
            className ? (
              <code className={`${className} block overflow-x-auto rounded-lg bg-black/40 p-3 text-[13px]`}>
                {children}
              </code>
            ) : (
              <code className="rounded bg-[var(--bg-hover)] px-1 py-0.5 text-[13px]">{children}</code>
            ),
          pre: ({ children }) => <pre className="overflow-x-auto">{children}</pre>,
          table: ({ children }) => (
            <table className="w-full border-collapse text-[13px]">{children}</table>
          ),
          th: ({ children }) => (
            <th className="border border-[var(--border)] px-2 py-1 text-left font-medium">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-[var(--border)] px-2 py-1">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
