'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, FileText, GitBranch, Share, Users, Zap, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [copiedDemo, setCopiedDemo] = useState(false);

  const handleCopyDemo = async () => {
    const demoUrl = 'https://OneWorkLoc.app/v3/code/Bc3e1/eNqrVspLzSlNzStRslJKK8rPTSxTslJKTixJzsjMS1WyMjJQUkorys9VqihKzEvMTVWyqlbKTUxOzsjNycxLt1Ky0lFKyixNzCvJSE0tsqpVAqvNTYQpKUkt0lHKz0vJTAexiiurqgEAYjAmRA==';
    
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
            <Link href="/e/create">
              <Button variant="outline" className="hidden sm:inline-flex border-white/20 text-white hover:bg-white/10">
                Try Demo
              </Button>
            </Link>
            <Link href="/e/create">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Started
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
            Universal Workstate Encoder Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Encode Any Digital Work Into
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Shareable URLs</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Share code, diagrams, designs, and entire workstates instantly. Recipients view and interact with your exact work without accounts or installations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/e/create">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 text-lg">
                Create Your First URL
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
            <p className="text-sm text-gray-400 mb-2">Example encoded URL:</p>
            <code className="text-xs sm:text-sm text-blue-300 font-mono break-all">
              OneWorkLoc.app/v3/code/Bc3e1/eNqrVspLzSlNzStRslJKK8rPTSxTslJKTixJzsjMS1WyMjJQUkorys9VqihKzEvMTVWyqlbKTUxOzsjNycxLt1Ky0lFKyixNzCvJSE0tsqpVAqvNTYQpKUkt0lHKz0vJTAexiiurqgEAYjAmRA==
            </code>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Advanced compression and encoding technology transforms your work into compact, shareable URLs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Adaptive Encoding</CardTitle>
              <CardDescription className="text-gray-300">
                Intelligent compression with LZMA/Brotli and Base62/Base91 encoding based on content type and size
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Smart Router</CardTitle>
              <CardDescription className="text-gray-300">
                Auto-detects content type from URLs and renders appropriate viewers with syntax highlighting
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Zero-Install Sharing</CardTitle>
              <CardDescription className="text-gray-300">
                Recipients instantly view and interact with your exact workstate without accounts or software
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Professional Use Cases</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Transform how teams collaborate across different tools and platforms
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Architecture Reviews",
              description: "Encode cloud diagrams + Terraform configs in one URL",
              icon: GitBranch,
              color: "from-blue-500 to-cyan-600"
            },
            {
              title: "Code Pairing",
              description: "Share IDE state with cursor positions and open files",
              icon: Code,
              color: "from-green-500 to-emerald-600"
            },
            {
              title: "Design Handoffs",
              description: "Send vector assets with inspection layers",
              icon: FileText,
              color: "from-purple-500 to-violet-600"
            },
            {
              title: "Technical Proposals",
              description: "Combine docs, architecture, and cost estimates",
              icon: Share,
              color: "from-orange-500 to-red-600"
            }
          ].map((useCase, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className={`w-10 h-10 bg-gradient-to-r ${useCase.color} rounded-lg flex items-center justify-center mb-4`}>
                  <useCase.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Workflow?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join professionals who are already using OneWorkLoc to streamline their collaboration and eliminate context loss.
          </p>
          <Link href="/e/create">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Start Encoding Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
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
            © 2025 OneWorkLoc. Universal Workstate Encoding Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}