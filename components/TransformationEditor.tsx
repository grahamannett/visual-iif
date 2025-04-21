"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection,
    addEdge,
} from 'reactflow';

// It's essential to import the CSS for react-flow to work correctly
import 'reactflow/dist/style.css';

interface TransformationEditorProps {
    csvHeaders: string[];
}

const initialEdges: Edge[] = [];

// Basic styling for the nodes
const nodeStyle = {
    border: '1px solid #777',
    padding: '10px',
    borderRadius: '3px',
    background: '#fff',
};

export default function TransformationEditor({ csvHeaders }: TransformationEditorProps) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    // Generate nodes from CSV headers when the component mounts or headers change
    useEffect(() => {
        const initialNodes: Node[] = csvHeaders.map((header, index) => ({
            id: `csv-${header}-${index}`, // Unique ID for each header node
            data: { label: header },
            position: { x: 100, y: 50 + index * 50 }, // Position nodes vertically
            type: 'input', // Mark as source nodes (can only have outgoing connections)
            style: nodeStyle,
        }));

        // Placeholder target nodes for IIF fields (we'll expand this later)
        const targetNodes: Node[] = [
            { id: 'iif-vendor', data: { label: 'Vendor' }, position: { x: 400, y: 100 }, type: 'output', style: nodeStyle },
            { id: 'iif-amount', data: { label: 'Amount' }, position: { x: 400, y: 200 }, type: 'output', style: nodeStyle },
        ];

        setNodes([...initialNodes, ...targetNodes]);
    }, [csvHeaders]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    // Function to handle connecting nodes
    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    return (
        // Set a fixed height for the react-flow container
        <div style={{ height: '500px', width: '100%', border: '1px solid #eee', background: '#f8f8f8' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView // Automatically zoom/pan to fit the nodes
                fitViewOptions={{ padding: 0.2 }}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}