'use client';

import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';

interface DiagramElement {
    id: string;
    type: 'rectangle' | 'circle' | 'arrow' | 'text' | 'line';
    x: number;
    y: number;
    width?: number;
    height?: number;
    text?: string;
    color: string;
    endX?: number;
    endY?: number;
}

interface DiagramViewerProps {
    elements: DiagramElement[];
}

export function DiagramViewer({ elements }: DiagramViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        drawDiagram();
    }, [elements]);

    const drawDiagram = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set canvas background
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw subtle grid
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Draw elements
        elements.forEach(element => {
            ctx.strokeStyle = element.color;
            ctx.fillStyle = element.color + '40'; // Add transparency
            ctx.lineWidth = 2;

            switch (element.type) {
                case 'rectangle':
                    const width = element.width || 100;
                    const height = element.height || 60;
                    ctx.fillRect(element.x, element.y, width, height);
                    ctx.strokeRect(element.x, element.y, width, height);
                    break;

                case 'circle':
                    ctx.beginPath();
                    ctx.arc(element.x + 50, element.y + 50, 40, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    break;

                case 'line':
                    ctx.beginPath();
                    ctx.moveTo(element.x, element.y);
                    ctx.lineTo(element.endX || element.x + 100, element.endY || element.y);
                    ctx.stroke();
                    break;

                case 'arrow':
                    const endX = element.endX || element.x + 100;
                    const endY = element.endY || element.y;

                    // Draw line
                    ctx.beginPath();
                    ctx.moveTo(element.x, element.y);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();

                    // Draw arrow head
                    const angle = Math.atan2(endY - element.y, endX - element.x);
                    const headLength = 15;

                    ctx.beginPath();
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(
                        endX - headLength * Math.cos(angle - Math.PI / 6),
                        endY - headLength * Math.sin(angle - Math.PI / 6)
                    );
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(
                        endX - headLength * Math.cos(angle + Math.PI / 6),
                        endY - headLength * Math.sin(angle + Math.PI / 6)
                    );
                    ctx.stroke();
                    break;

                case 'text':
                    ctx.fillStyle = element.color;
                    ctx.font = '16px Inter, sans-serif';
                    ctx.textBaseline = 'top';
                    ctx.fillText(element.text || 'Text', element.x, element.y);
                    break;
            }
        });
    };

    const getElementTypeCounts = () => {
        const counts = elements.reduce((acc, element) => {
            acc[element.type] = (acc[element.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([type, count]) => ({
            type: type.charAt(0).toUpperCase() + type.slice(1),
            count
        }));
    };

    const elementCounts = getElementTypeCounts();

    return (
        <div className="space-y-4">
            {/* Diagram Info */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-none">
                        <GitBranch className="w-3 h-3 mr-1" />
                        Diagram
                    </Badge>
                    <span className="text-gray-300 text-sm">{elements.length} elements</span>
                </div>
                <div className="flex space-x-2">
                    {elementCounts.map(({ type, count }) => (
                        <Badge key={type} variant="outline" className="border-white/20 text-white text-xs">
                            {count} {type}{count !== 1 ? 's' : ''}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Canvas */}
            <div className="bg-slate-800 rounded-lg p-4 overflow-auto">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="border border-white/20 rounded max-w-full h-auto"
                />
            </div>

            {/* Diagram Stats */}
            {elements.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-white font-bold text-lg">{elements.length}</p>
                        <p className="text-gray-400 text-xs">Total Elements</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-white font-bold text-lg">
                            {new Set(elements.map(e => e.color)).size}
                        </p>
                        <p className="text-gray-400 text-xs">Colors Used</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-white font-bold text-lg">
                            {elements.filter(e => e.type === 'text').length}
                        </p>
                        <p className="text-gray-400 text-xs">Text Elements</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-white font-bold text-lg">
                            {elements.filter(e => e.type === 'arrow').length}
                        </p>
                        <p className="text-gray-400 text-xs">Connections</p>
                    </div>
                </div>
            )}
        </div>
    );
}