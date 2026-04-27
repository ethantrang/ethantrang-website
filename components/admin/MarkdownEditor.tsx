'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { Textarea } from '@/components/ui/textarea';

interface MarkdownEditorProps {
  body: string;
  onSave: (body: string) => void;
  onDirtyChange?: (dirty: boolean) => void;
}

export function MarkdownEditor({ body: initialBody, onSave, onDirtyChange }: MarkdownEditorProps) {
  const [body, setBody] = useState(initialBody);
  const [dirty, setDirty] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedBodyRef = useRef(initialBody);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (dirty) {
        e.preventDefault();
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  function handleChange(value: string) {
    setBody(value);
    const isDirty = value !== savedBodyRef.current;
    setDirty(isDirty);
    onDirtyChange?.(isDirty);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSave(value);
      savedBodyRef.current = value;
      setDirty(false);
      onDirtyChange?.(false);
    }, 500);
  }

  return (
    <div className="flex flex-1 min-h-0 divide-x divide-border">
      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border flex items-center justify-between">
          <span>Markdown</span>
          {dirty && <span className="text-yellow-600 text-[10px]">Unsaved</span>}
        </div>
        <Textarea
          value={body}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 resize-none border-0 focus-visible:ring-0 font-mono text-sm rounded-none min-h-0 h-full"
          placeholder="Write markdown here…"
        />
      </div>

      {/* Preview */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border">
          Preview
        </div>
        <div className="flex-1 overflow-y-auto p-4 prose prose-sm max-w-none dark:prose-invert">
          {body ? (
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>{body}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground text-sm">Nothing to preview</p>
          )}
        </div>
      </div>
    </div>
  );
}
