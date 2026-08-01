"use client";

import { Bold, Italic, Quote, Languages, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MarkdownEditor({ name, value, onChange, placeholder }: { name: string, value: string, onChange: (val: string) => void, placeholder?: string }) {
  const insertText = (before: string, after = "") => {
    const textarea = document.querySelector(`textarea[name="${name}"]`) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertList = (type: "bullet" | "number") => {
    const textarea = document.querySelector(`textarea[name="${name}"]`) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    
    if (!selected) {
      const prefix = type === "bullet" ? "- " : "1. ";
      const newValue = value.substring(0, start) + "\n" + prefix + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1 + prefix.length, start + 1 + prefix.length);
      }, 0);
      return;
    }

    const lines = selected.split('\n');
    const newLines = lines.map((line, i) => {
      if (!line.trim()) return line;
      return type === "bullet" ? `- ${line}` : `${i + 1}. ${line}`;
    });
    
    const replacement = newLines.join('\n');
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  return (
    <div className="rounded-md border bg-background focus-within:ring-1 focus-within:ring-ring">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/50 p-1">
        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => insertText("**", "**")} title="Bold">
          <Bold className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => insertText("*", "*")} title="Italic">
          <Italic className="size-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => insertList("bullet")} title="Bullet List">
          <List className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => insertList("number")} title="Numbered List">
          <ListOrdered className="size-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => insertText("\n> ", "")} title="Quote">
          <Quote className="size-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button type="button" variant="outline" size="sm" className="h-8 gap-2 px-3 text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" onClick={() => insertText('\n<div dir="rtl" className="font-arabic text-xl leading-loose text-right my-5">\n', '\n</div>\n')} title="Insert Arabic text block (Right to Left)">
          <Languages className="size-4" /> Arabic Block (RTL)
        </Button>
      </div>
      <Textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-96 rounded-none border-0 focus-visible:ring-0 resize-y p-4 text-base leading-loose"
        required
      />
    </div>
  );
}
