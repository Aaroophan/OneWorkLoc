'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Code, FileText, GitBranch, Copy, Check, Share, Download, Zap } from 'lucide-react';
import Link from 'next/link';
import { decodeContent, ContentMetadata } from '@/lib/encoder';

export default function WorkstatePage() {
  const params = useParams();
  const [content, setContent] = useState<string>('');
  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const decodeFromUrl = async () => {
      try {
        const pathParts = Array.isArray(params.workstate) ? params.workstate : [params.workstate];
        
        if (pathParts.length < 4) {
          throw new Error('Invalid URL format');
        }

        const [version, type, checksum, encodedData] = pathParts;
        
        if (!version.startsWith('v') || !encodedData) {
          throw new Error('Invalid URL structure');
        }

        const { content: decodedContent, metadata: decodedMetadata } = await decodeContent(encodedData, checksum);
        setContent(decodedContent);
        setMetadata(decodedMetadata);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to decode content');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.workstate) {
      decodeFromUrl();
    }
  }, [params.workstate]);

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workstate.${metadata?.language || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'code': return Code;
      case 'json': return GitBranch;
      case 'diagram': return GitBranch;
      default: return FileText;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'code': return 'from-green-500 to-emerald-600';
      case 'json': return 'from-blue-500 to-cyan-600';
      case 'diagram': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const formatContent = (content: string, type: string, language?: string) => {
    // Basic syntax highlighting for demo (in production, use Prism.js or similar)
    if (type === 'code' || type === 'json') {
      return (
        <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap break-all">
          <code>{content}</code>
        </pre>
      );
    }
    
    return (
      <pre className="text-sm text-gray-200 whitespace-pre-wrap break-words">
        {content}
      </pre>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-lg">Decoding workstate...</p>
          <p className="text-gray-400 text-sm mt-2">Reconstructing original content</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
          </nav>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Share className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Unable to Decode</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <Link href="/e/create">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Create New URL
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ContentIcon = getContentTypeIcon(metadata?.type || 'text');
  const contentColor = getContentTypeColor(metadata?.type || 'text');

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
          <div className="flex items-center space-x-3">
            <Badge className={`bg-gradient-to-r ${contentColor} text-white border-none`}>
              <ContentIcon className="w-3 h-3 mr-1" />
              {metadata?.type || 'Unknown'}
            </Badge>
            {metadata?.language && (
              <Badge variant="outline" className="border-white/20 text-white">
                {metadata.language}
              </Badge>
            )}
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Content Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Decoded Workstate</h1>
              <p className="text-gray-300">
                Shared {metadata && new Date(metadata.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Button 
                onClick={handleCopyContent}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {copied ? <Check className="mr-2 w-4 h-4" /> : <Copy className="mr-2 w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button 
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="mr-2 w-4 h-4" />
                Download
              </Button>
              <Button 
                onClick={() => window.location.href = `mailto:?subject=Shared Workstate&body=Check out this content: ${window.location.href}`}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Share className="mr-2 w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Content Display */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center">
                <ContentIcon className="w-5 h-5 mr-2" />
                Content
                {metadata?.language && (
                  <span className="ml-2 text-sm text-gray-400">({metadata.language})</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 max-h-[600px] overflow-auto">
                {formatContent(content, metadata?.type || 'text', metadata?.language)}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="mt-6 bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Content Type</p>
                  <p className="text-white font-medium">{metadata?.type || 'Unknown'}</p>
                </div>
                {metadata?.language && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-sm">Language</p>
                    <p className="text-white font-medium">{metadata.language}</p>
                  </div>
                )}
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Version</p>
                  <p className="text-white font-medium">v{metadata?.version || 1}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Size</p>
                  <p className="text-white font-medium">{content.length} chars</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create New */}
          <div className="mt-8 text-center">
            <p className="text-gray-300 mb-4">Want to create your own shareable URL?</p>
            <Link href="/e/create">
              <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
                Create New URL
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}