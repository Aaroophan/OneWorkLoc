'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Quote,
    Link,
    Image,
    Save,
    Download,
    Eye
} from 'lucide-react';

interface TextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function TextEditor({ content, onChange }: TextEditorProps) {
    const [isPreview, setIsPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
        onChange(newText);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const formatButtons = [
        { icon: Bold, label: 'Bold', action: () => insertText('**', '**') },
        { icon: Italic, label: 'Italic', action: () => insertText('*', '*') },
        { icon: Underline, label: 'Underline', action: () => insertText('<u>', '</u>') },
        { icon: Quote, label: 'Quote', action: () => insertText('> ') },
        { icon: List, label: 'Bullet List', action: () => insertText('- ') },
        { icon: ListOrdered, label: 'Numbered List', action: () => insertText('1. ') },
        { icon: Link, label: 'Link', action: () => insertText('[', '](url)') },
        { icon: Image, label: 'Image', action: () => insertText('![alt](', ')') }
    ];

    const renderPreview = (text: string) => {
        // Simple markdown-like rendering
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 underline">$1</a>')
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />')
            .replace(/\n/g, '<br>');
    };

    const placeholder = `# Welcome to the Rich Text Editor

Start writing your document here. You can use markdown-like formatting:

**Bold text** and *italic text*
> Blockquotes for important notes
- Bullet points
1. Numbered lists
[Links](https://example.com)
![Images](image-url)

Use the toolbar buttons above for quick formatting, or type markdown directly.`;

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {formatButtons.map((button, index) => (
                            <Button
                                key={index}
                                onClick={button.action}
                                variant="outline"
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10"
                                title={button.label}
                            >
                                <button.icon className="w-4 h-4" />
                            </Button>
                        ))}

                        <div className="ml-auto flex items-center space-x-2">
                            <Button
                                onClick={() => setIsPreview(!isPreview)}
                                variant={isPreview ? "default" : "outline"}
                                size="sm"
                                className={isPreview ? "bg-blue-600" : "border-white/20 text-white hover:bg-white/10"}
                            >
                                <Eye className="mr-2 w-4 h-4" />
                                {isPreview ? 'Edit' : 'Preview'}
                            </Button>
                            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                                <Save className="mr-2 w-4 h-4" />
                                Save
                            </Button>
                            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                                <Download className="mr-2 w-4 h-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Editor/Preview */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">
                        {isPreview ? 'Preview' : 'Editor'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isPreview ? (
                        <div
                            className="min-h-[500px] bg-white/5 border border-white/20 rounded-lg p-4 text-white prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: renderPreview(content || placeholder) }}
                        />
                    ) : (
                        <Textarea
                            ref={textareaRef}
                            placeholder={placeholder}
                            value={content}
                            onChange={(e) => onChange(e.target.value)}
                            className="min-h-[500px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 resize-none"
                        />
                    )}
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">{content.length}</p>
                        <p className="text-gray-400 text-sm">Characters</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">{content.split(/\s+/).filter(word => word.length > 0).length}</p>
                        <p className="text-gray-400 text-sm">Words</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">{content.split('\n').length}</p>
                        <p className="text-gray-400 text-sm">Lines</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}