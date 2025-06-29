'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, Save, Download, Upload } from 'lucide-react';

interface CodeEditorProps {
    content: string;
    onChange: (content: string) => void;
    language: string;
    onLanguageChange: (language: string) => void;
}

export function CodeEditor({ content, onChange, language, onLanguageChange }: CodeEditorProps) {
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'python', label: 'Python' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'json', label: 'JSON' },
        { value: 'sql', label: 'SQL' },
        { value: 'bash', label: 'Bash' }
    ];

    const runCode = async () => {
        setIsRunning(true);
        try {
            if (language === 'javascript') {
                // Capture console.log output
                const logs: string[] = [];
                const originalLog = console.log;
                console.log = (...args) => {
                    logs.push(args.map(arg => String(arg)).join(' '));
                };

                try {
                    // Execute the code
                    const func = new Function(content);
                    const result = func();
                    if (result !== undefined) {
                        logs.push(`Return value: ${result}`);
                    }
                } catch (error) {
                    logs.push(`Error: ${error}`);
                } finally {
                    console.log = originalLog;
                }

                setOutput(logs.join('\n') || 'Code executed successfully (no output)');
            } else {
                setOutput(`Code execution for ${language} is not supported in the browser environment.`);
            }
        } catch (error) {
            setOutput(`Execution error: ${error}`);
        } finally {
            setIsRunning(false);
        }
    };

    const getPlaceholder = () => {
        switch (language) {
            case 'javascript':
                return `// Welcome to the Code Editor
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to OneWorkLoc, \${name}!\`;
}

// Try running this code
greetUser("Developer");`;
            case 'python':
                return `# Welcome to the Code Editor
def greet_user(name):
    print(f"Hello, {name}!")
    return f"Welcome to OneWorkLoc, {name}!"

# Try this code
result = greet_user("Developer")
print(result)`;
            case 'html':
                return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OneWorkLoc Project</title>
</head>
<body>
    <h1>Welcome to OneWorkLoc</h1>
    <p>Start building your project here!</p>
</body>
</html>`;
            default:
                return `// Start coding in ${language}...`;
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center">
                            <Play className="w-5 h-5 mr-2" />
                            Code Editor
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                            <Select value={language} onValueChange={onLanguageChange}>
                                <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/20">
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-white/10">
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder={getPlaceholder()}
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        className="min-h-[400px] bg-black/30 border-white/20 text-white placeholder:text-gray-400 font-mono text-sm resize-none"
                    />

                    <div className="flex space-x-2">
                        <Button
                            onClick={runCode}
                            disabled={!content.trim() || isRunning}
                            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                        >
                            <Play className="mr-2 w-4 h-4" />
                            {isRunning ? 'Running...' : 'Run Code'}
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Save className="mr-2 w-4 h-4" />
                            Save
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Download className="mr-2 w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Output Console</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-4 min-h-[400px]">
                        {output ? (
                            <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">
                                {output}
                            </pre>
                        ) : (
                            <p className="text-gray-400 text-sm">
                                Click "Run Code" to see output here...
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}