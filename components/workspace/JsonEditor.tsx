'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Check,
    X,
    Download,
    Upload,
    Copy,
    RefreshCw,
    Braces,
    FileText
} from 'lucide-react';

interface JsonEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function JsonEditor({ content, onChange }: JsonEditorProps) {
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState('');
    const [formatted, setFormatted] = useState('');
    const [stats, setStats] = useState({ keys: 0, values: 0, depth: 0 });

    useEffect(() => {
        validateAndFormat(content);
    }, [content]);

    const validateAndFormat = (jsonString: string) => {
        if (!jsonString.trim()) {
            setIsValid(true);
            setError('');
            setFormatted('');
            setStats({ keys: 0, values: 0, depth: 0 });
            return;
        }

        try {
            const parsed = JSON.parse(jsonString);
            setIsValid(true);
            setError('');
            setFormatted(JSON.stringify(parsed, null, 2));

            // Calculate stats
            const statsResult = calculateStats(parsed);
            setStats(statsResult);
        } catch (err) {
            setIsValid(false);
            setError(err instanceof Error ? err.message : 'Invalid JSON');
            setFormatted('');
            setStats({ keys: 0, values: 0, depth: 0 });
        }
    };

    const calculateStats = (obj: any, depth = 0): { keys: number; values: number; depth: number } => {
        let keys = 0;
        let values = 0;
        let maxDepth = depth;

        if (Array.isArray(obj)) {
            values += obj.length;
            obj.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    const childStats = calculateStats(item, depth + 1);
                    keys += childStats.keys;
                    values += childStats.values;
                    maxDepth = Math.max(maxDepth, childStats.depth);
                }
            });
        } else if (typeof obj === 'object' && obj !== null) {
            const objKeys = Object.keys(obj);
            keys += objKeys.length;

            objKeys.forEach(key => {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    const childStats = calculateStats(value, depth + 1);
                    keys += childStats.keys;
                    values += childStats.values;
                    maxDepth = Math.max(maxDepth, childStats.depth);
                } else {
                    values++;
                }
            });
        }

        return { keys, values, depth: maxDepth };
    };

    const formatJson = () => {
        if (formatted) {
            onChange(formatted);
        }
    };

    const minifyJson = () => {
        try {
            const parsed = JSON.parse(content);
            onChange(JSON.stringify(parsed));
        } catch (err) {
            // Content is already invalid, do nothing
        }
    };

    const copyFormatted = async () => {
        if (formatted) {
            await navigator.clipboard.writeText(formatted);
        }
    };

    const loadSample = () => {
        const sample = {
            "name": "OneWorkLoc Project",
            "version": "1.0.0",
            "description": "A collaborative workspace for sharing digital work",
            "features": [
                "Code editing",
                "Diagram creation",
                "Text editing",
                "JSON validation"
            ],
            "config": {
                "theme": "dark",
                "autoSave": true,
                "collaboration": {
                    "enabled": true,
                    "maxUsers": 10
                }
            },
            "metadata": {
                "created": "2025-01-27",
                "lastModified": "2025-01-27",
                "author": "Developer"
            }
        };
        onChange(JSON.stringify(sample, null, 2));
    };

    const placeholder = `{
  "welcome": "JSON Data Editor",
  "features": [
    "Real-time validation",
    "Syntax highlighting",
    "Auto-formatting",
    "Statistics"
  ],
  "config": {
    "theme": "dark",
    "autoValidate": true
  }
}`;

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center">
                                <Braces className="w-5 h-5 mr-2" />
                                JSON Editor
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    className={`${isValid
                                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                                        }`}
                                >
                                    {isValid ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                    {isValid ? 'Valid' : 'Invalid'}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder={placeholder}
                            value={content}
                            onChange={(e) => onChange(e.target.value)}
                            className="min-h-[500px] bg-black/30 border-white/20 text-white placeholder:text-gray-400 font-mono text-sm resize-none"
                        />

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-300 text-sm font-mono">{error}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={formatJson}
                                disabled={!isValid}
                                variant="outline"
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                <RefreshCw className="mr-2 w-4 h-4" />
                                Format
                            </Button>
                            <Button
                                onClick={minifyJson}
                                disabled={!isValid}
                                variant="outline"
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                <Braces className="mr-2 w-4 h-4" />
                                Minify
                            </Button>
                            <Button
                                onClick={copyFormatted}
                                disabled={!formatted}
                                variant="outline"
                                size="sm"
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                <Copy className="mr-2 w-4 h-4" />
                                Copy
                            </Button>
                            <Button
                                onClick={loadSample}
                                variant="outline"
                                size="sm"
                                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                            >
                                <FileText className="mr-2 w-4 h-4" />
                                Load Sample
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stats & Preview */}
            <div className="space-y-6">
                {/* Statistics */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{stats.keys}</p>
                                <p className="text-gray-400 text-xs">Keys</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{stats.values}</p>
                                <p className="text-gray-400 text-xs">Values</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{stats.depth}</p>
                                <p className="text-gray-400 text-xs">Max Depth</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{content.length}</p>
                                <p className="text-gray-400 text-xs">Characters</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Formatted Preview */}
                {formatted && (
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white text-sm">Formatted Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-black/30 border border-white/20 rounded-lg p-3 max-h-[300px] overflow-auto">
                                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                                    {formatted}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                            <Download className="mr-2 w-4 h-4" />
                            Export JSON
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                            <Upload className="mr-2 w-4 h-4" />
                            Import File
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}