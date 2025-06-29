'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Square,
    Circle,
    ArrowRight,
    Type,
    Minus,
    Palette,
    Save,
    Download,
    Undo,
    Redo,
    Trash2
} from 'lucide-react';

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

interface DiagramEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function DiagramEditor({ content, onChange }: DiagramEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [elements, setElements] = useState<DiagramElement[]>([]);
    const [selectedTool, setSelectedTool] = useState<DiagramElement['type']>('rectangle');
    const [selectedColor, setSelectedColor] = useState('#3B82F6');
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const tools = [
        { type: 'rectangle' as const, icon: Square, label: 'Rectangle', color: 'from-blue-500 to-blue-600' },
        { type: 'circle' as const, icon: Circle, label: 'Circle', color: 'from-green-500 to-green-600' },
        { type: 'arrow' as const, icon: ArrowRight, label: 'Arrow', color: 'from-purple-500 to-purple-600' },
        { type: 'text' as const, icon: Type, label: 'Text', color: 'from-orange-500 to-orange-600' },
        { type: 'line' as const, icon: Minus, label: 'Line', color: 'from-gray-500 to-gray-600' }
    ];

    const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
    ];

    useEffect(() => {
        if (content) {
            try {
                const parsed = JSON.parse(content);
                if (Array.isArray(parsed)) {
                    setElements(parsed);
                }
            } catch (error) {
                // If content is not valid JSON, start fresh
            }
        }
    }, []);

    useEffect(() => {
        if (elements.length > 0) {
            onChange(JSON.stringify(elements, null, 2));
        }
        drawCanvas();
    }, [elements]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
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
            ctx.fillStyle = element.color + '20';
            ctx.lineWidth = 2;

            switch (element.type) {
                case 'rectangle':
                    ctx.fillRect(element.x, element.y, element.width || 100, element.height || 60);
                    ctx.strokeRect(element.x, element.y, element.width || 100, element.height || 60);
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
                    ctx.beginPath();
                    ctx.moveTo(element.x, element.y);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();

                    // Arrow head
                    const angle = Math.atan2(endY - element.y, endX - element.x);
                    ctx.beginPath();
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(endX - 10 * Math.cos(angle - Math.PI / 6), endY - 10 * Math.sin(angle - Math.PI / 6));
                    ctx.moveTo(endX, endY);
                    ctx.lineTo(endX - 10 * Math.cos(angle + Math.PI / 6), endY - 10 * Math.sin(angle + Math.PI / 6));
                    ctx.stroke();
                    break;
                case 'text':
                    ctx.fillStyle = element.color;
                    ctx.font = '16px Inter';
                    ctx.fillText(element.text || 'Text', element.x, element.y);
                    break;
            }
        });
    };

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setStartPos({ x, y });

        if (selectedTool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                const newElement: DiagramElement = {
                    id: Date.now().toString(),
                    type: 'text',
                    x,
                    y,
                    text,
                    color: selectedColor
                };
                setElements(prev => [...prev, newElement]);
            }
            setIsDrawing(false);
        }
    };

    const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const newElement: DiagramElement = {
            id: Date.now().toString(),
            type: selectedTool,
            x: startPos.x,
            y: startPos.y,
            color: selectedColor
        };

        if (selectedTool === 'rectangle') {
            newElement.width = Math.abs(endX - startPos.x);
            newElement.height = Math.abs(endY - startPos.y);
        } else if (selectedTool === 'arrow' || selectedTool === 'line') {
            newElement.endX = endX;
            newElement.endY = endY;
        }

        if (selectedTool !== 'text') {
            setElements(prev => [...prev, newElement]);
        }

        setIsDrawing(false);
    };

    const clearCanvas = () => {
        setElements([]);
        onChange('');
    };

    const exportDiagram = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'diagram.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="grid lg:grid-cols-4 gap-6">
            {/* Tools Panel */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-sm">Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {tools.map((tool) => (
                            <Button
                                key={tool.type}
                                onClick={() => setSelectedTool(tool.type)}
                                variant={selectedTool === tool.type ? "default" : "outline"}
                                className={`w-full justify-start ${selectedTool === tool.type
                                        ? `bg-gradient-to-r ${tool.color}`
                                        : 'border-white/20 text-white hover:bg-white/10'
                                    }`}
                            >
                                <tool.icon className="mr-2 w-4 h-4" />
                                {tool.label}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <p className="text-white text-sm">Colors</p>
                        <div className="grid grid-cols-5 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-6 h-6 rounded border-2 ${selectedColor === color ? 'border-white' : 'border-transparent'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Button
                            onClick={clearCanvas}
                            variant="outline"
                            className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
                        >
                            <Trash2 className="mr-2 w-4 h-4" />
                            Clear
                        </Button>
                        <Button
                            onClick={exportDiagram}
                            variant="outline"
                            className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                            <Download className="mr-2 w-4 h-4" />
                            Export PNG
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Canvas */}
            <div className="lg:col-span-3">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white">Diagram Canvas</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Badge className={`bg-gradient-to-r ${tools.find(t => t.type === selectedTool)?.color} text-white border-none`}>
                                    {tools.find(t => t.type === selectedTool)?.label}
                                </Badge>
                                <div
                                    className="w-4 h-4 rounded border border-white/20"
                                    style={{ backgroundColor: selectedColor }}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-slate-800 rounded-lg p-4 overflow-auto">
                            <canvas
                                ref={canvasRef}
                                width={800}
                                height={600}
                                className="border border-white/20 rounded cursor-crosshair bg-slate-900"
                                onMouseDown={handleCanvasMouseDown}
                                onMouseUp={handleCanvasMouseUp}
                            />
                        </div>
                        <div className="mt-4 text-sm text-gray-400">
                            <p>Click and drag to create shapes. Selected tool: <span className="text-white">{tools.find(t => t.type === selectedTool)?.label}</span></p>
                            <p>Elements: {elements.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}