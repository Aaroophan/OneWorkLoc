'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, Share, Code, FileText, GitBranch, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { encodeContent, createDemoUrl } from '@/lib/encoder';

type ContentType = 'text' | 'code' | 'json' | 'diagram';

export default function CreatePage() {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<ContentType>('text');
  const [language, setLanguage] = useState('javascript');
  const [isEncoding, setIsEncoding] = useState(false);
  const [encodedUrl, setEncodedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('');
  const [demoUrls, setDemoUrls] = useState({
    javascript: '',
    json: ''
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      setCurrentDomain(window.location.host);

      // Generate demo URLs
      try {
        const jsDemo = createDemoUrl();
        setDemoUrls(prev => ({
          ...prev,
          javascript: jsDemo
        }));
      } catch (error) {
        console.error('Failed to create demo URLs:', error);
      }
    }
  }, []);

  const contentTypeOptions = [
    { value: 'text', label: 'Plain Text', icon: FileText, color: 'from-gray-500 to-slate-600' },
    { value: 'code', label: 'Source Code', icon: Code, color: 'from-green-500 to-emerald-600' },
    { value: 'json', label: 'JSON Data', icon: GitBranch, color: 'from-blue-500 to-cyan-600' },
    { value: 'diagram', label: 'Diagram/Config', icon: GitBranch, color: 'from-purple-500 to-violet-600' }
  ];

  const languageOptions = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css'
  ];

  const handleEncode = async () => {
    if (!content.trim()) return;

    setIsEncoding(true);
    try {
      const metadata = {
        type: contentType,
        ...(contentType === 'code' && { language }),
        timestamp: Date.now(),
        version: 3
      };

      const url = await encodeContent(content, metadata);
      setEncodedUrl(url);
    } catch (error) {
      console.error('Encoding failed:', error);
    } finally {
      setIsEncoding(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(encodedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL');
    }
  };

  const selectedType = contentTypeOptions.find(option => option.value === contentType);

  // Helper function to get current origin safely
  const getCurrentOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
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
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            Encoder v3.0
          </Badge>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Create Shareable URL
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Paste your content below and we'll generate a compact, shareable URL that anyone can access instantly
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {selectedType && <selectedType.icon className="w-5 h-5 mr-2" />}
                  Input Content
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Enter your content and select the appropriate type for optimal encoding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Content Type</label>
                  <Select value={contentType} onValueChange={(value: ContentType) => setContentType(value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {contentTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                          <div className="flex items-center">
                            <option.icon className="w-4 h-4 mr-2" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Selection for Code */}
                {contentType === 'code' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Programming Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20 max-h-48 overflow-y-auto">
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang} value={lang} className="text-white hover:bg-white/10">
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Content Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Content</label>
                  <Textarea
                    placeholder={
                      contentType === 'code'
                        ? `// Enter your ${language} code here...\nfunction hello() {\n  console.log("Hello, World!");\n}`
                        : contentType === 'json'
                          ? '{\n  "message": "Hello, World!",\n  "timestamp": "2025-01-27"\n}'
                          : "Enter your content here..."
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 font-mono text-sm resize-none"
                  />
                </div>

                <Button
                  onClick={handleEncode}
                  disabled={!content.trim() || isEncoding}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isEncoding ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Encoding...
                    </>
                  ) : (
                    <>
                      <Share className="mr-2 w-4 h-4" />
                      Generate Shareable URL
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Generated URL</CardTitle>
                <CardDescription className="text-gray-300">
                  Your encoded URL is ready to share
                </CardDescription>
              </CardHeader>
              <CardContent>
                {encodedUrl ? (
                  <div className="space-y-4">
                    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-2">Shareable URL:</p>
                      <code className="text-sm text-blue-300 font-mono break-all">
                        {encodedUrl}
                      </code>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                      >
                        {copied ? <Check className="mr-2 w-4 h-4" /> : <Copy className="mr-2 w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy URL'}
                      </Button>
                      <Link href={encodedUrl.replace(getCurrentOrigin(), '')} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
                          Preview
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">Original Size</p>
                        <p className="text-white font-mono">{new Blob([content]).size} bytes</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">Compressed</p>
                        <p className="text-white font-mono">
                          {Math.round((1 - (encodedUrl.length / (content.length * 4))) * 100)}% smaller
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                      <Share className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-400">
                      Enter content and click "Generate Shareable URL" to create your encoded link
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Example URLs */}
          <Card className="mt-8 bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Example URLs</CardTitle>
              <CardDescription className="text-gray-300">
                See how different content types are encoded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    type: 'JavaScript Code',
                    url: demoUrls.javascript || `${currentDomain || 'loading...'}/v3/code/ABC12/demo-loading`,
                    color: 'border-green-500/30 bg-green-500/10'
                  },
                  {
                    type: 'JSON Configuration',
                    url: `${currentDomain || 'loading...'}/v3/json/DEF34/sample-json-data`,
                    color: 'border-blue-500/30 bg-blue-500/10'
                  }
                ].map((example, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${example.color}`}>
                    <p className="text-white font-medium mb-2">{example.type}</p>
                    <code className="text-xs text-gray-300 font-mono break-all">
                      {example.url}
                    </code>
                    {example.url.includes('demo-loading') === false && (
                      <div className="mt-2">
                        <Link href={example.url.replace(getCurrentOrigin(), '')}>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Try Example
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}