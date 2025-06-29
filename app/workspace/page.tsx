'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Code,
    FileText,
    GitBranch,
    Zap,
    Save,
    Share,
    Play,
    Download,
    Upload,
    Palette,
    Grid,
    Square,
    Circle,
    ArrowRight as Arrow,
    Type,
    Minus
} from 'lucide-react';
import Link from 'next/link';
import { CodeEditor } from '@/components/workspace/CodeEditor';
import { DiagramEditor } from '@/components/workspace/DiagramEditor';
import { TextEditor } from '@/components/workspace/TextEditor';
import { JsonEditor } from '@/components/workspace/JsonEditor';
import { encodeContent } from '@/lib/encoder';

type WorkspaceType = 'code' | 'diagram' | 'text' | 'json';

export default function WorkspacePage() {
    const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>('code');
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isSharing, setIsSharing] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    const handleShare = async () => {
        if (!content.trim()) return;

        setIsSharing(true);
        try {
            const metadata = {
                type: activeWorkspace,
                ...(activeWorkspace === 'code' && { language }),
                timestamp: Date.now(),
                version: 3
            };

            const url = await encodeContent(content, metadata);
            setShareUrl(url);

            // Copy to clipboard
            await navigator.clipboard.writeText(url);
        } catch (error) {
            console.error('Sharing failed:', error);
        } finally {
            setIsSharing(false);
        }
    };

    const workspaceTypes = [
        {
            id: 'code',
            label: 'Code Editor',
            icon: Code,
            color: 'from-green-500 to-emerald-600',
            description: 'Write and execute code with syntax highlighting'
        },
        {
            id: 'diagram',
            label: 'Diagram Studio',
            icon: GitBranch,
            color: 'from-purple-500 to-violet-600',
            description: 'Create flowcharts, wireframes, and technical diagrams'
        },
        {
            id: 'text',
            label: 'Rich Text',
            icon: FileText,
            color: 'from-blue-500 to-cyan-600',
            description: 'Write documents with formatting and collaboration'
        },
        {
            id: 'json',
            label: 'Data Editor',
            icon: GitBranch,
            color: 'from-orange-500 to-red-600',
            description: 'Structure and validate JSON data with schema support'
        }
    ];

    const activeType = workspaceTypes.find(type => type.id === activeWorkspace);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="container mx-auto px-4 py-4 border-b border-white/10">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">OneWorkLoc</span>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-3">
                        {activeType && (
                            <Badge className={`bg-gradient-to-r ${activeType.color} text-white border-none`}>
                                <activeType.icon className="w-3 h-3 mr-1" />
                                {activeType.label}
                            </Badge>
                        )}
                        <Button
                            onClick={handleShare}
                            disabled={!content.trim() || isSharing}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            <Share className="mr-2 w-4 h-4" />
                            {isSharing ? 'Sharing...' : 'Share Work'}
                        </Button>
                    </div>
                </nav>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    {/* Workspace Selector */}
                    <div className="mb-6">
                        <Tabs value={activeWorkspace} onValueChange={(value) => setActiveWorkspace(value as WorkspaceType)}>
                            <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-sm border-white/10">
                                {workspaceTypes.map((type) => (
                                    <TabsTrigger
                                        key={type.id}
                                        value={type.id}
                                        className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-300"
                                    >
                                        <type.icon className="w-4 h-4 mr-2" />
                                        {type.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* Code Editor */}
                            <TabsContent value="code" className="mt-6">
                                <CodeEditor
                                    content={content}
                                    onChange={setContent}
                                    language={language}
                                    onLanguageChange={setLanguage}
                                />
                            </TabsContent>

                            {/* Diagram Editor */}
                            <TabsContent value="diagram" className="mt-6">
                                <DiagramEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            </TabsContent>

                            {/* Text Editor */}
                            <TabsContent value="text" className="mt-6">
                                <TextEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            </TabsContent>

                            {/* JSON Editor */}
                            <TabsContent value="json" className="mt-6">
                                <JsonEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Share URL Display */}
                    {shareUrl && (
                        <Card className="bg-green-500/10 backdrop-blur-sm border-green-500/20">
                            <CardHeader>
                                <CardTitle className="text-green-300 flex items-center">
                                    <Share className="w-5 h-5 mr-2" />
                                    Work Shared Successfully!
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-black/30 backdrop-blur-sm border border-green-500/20 rounded-lg p-4">
                                    <code className="text-sm text-green-300 font-mono break-all">
                                        {shareUrl}
                                    </code>
                                </div>
                                <p className="text-green-200 text-sm mt-2">
                                    URL copied to clipboard! Anyone can access your work with this link.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}