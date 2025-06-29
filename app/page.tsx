'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, FileText, GitBranch, Share, Users, Zap, Copy, Check, Palette } from 'lucide-react';
import Link from 'next/link';
import { createDemoUrl } from '@/lib/encoder';

export default function HomePage() {
  const [copiedDemo, setCopiedDemo] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  useEffect(() => {
    setCurrentDomain(window.location.host);
    // Generate a working demo URL
    try {
      const demo = createDemoUrl();
      setDemoUrl(demo);
    } catch (error) {
      console.error('Failed to create demo URL:', error);
      setDemoUrl(`${window.location.origin}/v3/code/ABC12/demo-content-here`);
    }
  }, []);

  const handleCopyDemo = async () => {
    try {
      await navigator.clipboard.writeText(demoUrl);
      setCopiedDemo(true);
      setTimeout(() => setCopiedDemo(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">OneWorkLoc</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/workspace">
              <Button variant="outline" className="hidden sm:inline-flex border-white/20 text-white hover:bg-white/10">
                <Palette className="mr-2 w-4 h-4" />
                Workspace
              </Button>
            </Link>
            <Link href="/e/create">
              <Button variant="outline" className="hidden sm:inline-flex border-white/20 text-white hover:bg-white/10">
                Share Content
              </Button>
            </Link>
            <Link href="/workspace">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Start Creating
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
            Collaborative Digital Workspace
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Create, Collaborate, and
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Share Your Work</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            A unified workspace for coding, diagramming, writing, and data editing. Create professional content and share it instantly with shareable URLs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/workspace">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 text-lg">
                <Palette className="mr-2 w-5 h-5" />
                Open Workspace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg"
              onClick={handleCopyDemo}
            >
              {copiedDemo ? <Check className="mr-2 w-5 h-5" /> : <Copy className="mr-2 w-5 h-5" />}
              {copiedDemo ? 'Copied!' : 'Copy Demo URL'}
            </Button>
          </div>

          {/* Demo URL Display */}
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 max-w-3xl mx-auto">
            <p className="text-sm text-gray-400 mb-2">Example shared work URL:</p>
            <code className="text-xs sm:text-sm text-blue-300 font-mono break-all">
              {demoUrl || `${currentDomain || 'loading...'}/v3/code/ABC12/demo-loading...`}
            </code>
            {demoUrl && (
              <div className="mt-3">
                <Link href={demoUrl.replace(window.location.origin, '')}>
                  <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                    <ArrowRight className="mr-2 w-4 h-4" />
                    View Demo Work
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Workspace Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Integrated Creative Tools</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Everything you need to create professional content in one unified workspace
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Code Editor",
              description: "Write and execute code with syntax highlighting and live output",
              icon: Code,
              color: "from-green-500 to-emerald-600",
              features: ["Multi-language support", "Live execution", "Syntax highlighting"]
            },
            {
              title: "Diagram Studio",
              description: "Create flowcharts, wireframes, and technical diagrams visually",
              icon: GitBranch,
              color: "from-purple-500 to-violet-600",
              features: ["Drag & drop tools", "Shape library", "Export options"]
            },
            {
              title: "Rich Text Editor",
              description: "Write documents with formatting and real-time preview",
              icon: FileText,
              color: "from-blue-500 to-cyan-600",
              features: ["Markdown support", "Live preview", "Word count"]
            },
            {
              title: "JSON Editor",
              description: "Structure and validate JSON data with schema support",
              icon: Share,
              color: "from-orange-500 to-red-600",
              features: ["Real-time validation", "Auto-formatting", "Statistics"]
            }
          ].map((tool, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center mb-4`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{tool.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            From creation to collaboration in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <CardTitle className="text-white">Create</CardTitle>
              <CardDescription className="text-gray-300">
                Use our integrated tools to write code, design diagrams, edit text, or structure data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <CardTitle className="text-white">Share</CardTitle>
              <CardDescription className="text-gray-300">
                Generate a compact, shareable URL that encodes your entire work state
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <CardTitle className="text-white">Collaborate</CardTitle>
              <CardDescription className="text-gray-300">
                Recipients instantly access your exact work without accounts or installations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Creating?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join professionals who are already using OneWorkLoc to streamline their creative workflow and eliminate context loss.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workspace">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Palette className="mr-2 w-5 h-5" />
                Open Workspace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/e/create">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Share className="mr-2 w-5 h-5" />
                Share Existing Content
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">OneWorkLoc</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 OneWorkLoc. Collaborative Digital Workspace Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}