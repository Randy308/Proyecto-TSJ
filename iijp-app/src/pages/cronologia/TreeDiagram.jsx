import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

export default function TreeDiagram({ data }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [expanded, setExpanded] = useState(new Set());

  const horizontalSpacing = 250;
  const verticalSpacing = 150;

  useEffect(() => {
    if (Array.isArray(data)) {
      const rootNodes = data.map((item, index) => ({
        id: item.id.toString(),
        data: { label: `${item.nombre} (${item.cantidad})`, item },
        position: { x: index * horizontalSpacing, y: 0 },
      }));
      setNodes(rootNodes);
      setEdges([]);
    }
  }, [data]);

  const getLevel = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.position.y / verticalSpacing : 0;
  };

  const expandNode = (item, parentId) => {
    const isExpanded = expanded.has(parentId);

    if (isExpanded) {
      // Collapse: eliminar todos los hijos recursivamente
      const allDescendants = getDescendantIds(parentId);
      setNodes(prev => prev.filter(n => !allDescendants.includes(n.id)));
      setEdges(prev => prev.filter(e => !allDescendants.includes(e.target)));
      setExpanded(prev => {
        const copy = new Set(prev);
        allDescendants.forEach(id => copy.delete(id));
        copy.delete(parentId);
        return copy;
      });
      return;
    }

    if (!item.children || item.children.length === 0) return;

    const parentNode = nodes.find(n => n.id === parentId);
    const level = getLevel(parentId) + 1;
    const baseX = parentNode?.position?.x ?? 0;

    const childNodes = item.children.map((child, i) => ({
      id: child.id.toString(),
      data: { label: `${child.nombre} (${child.cantidad})`, item: child },
      position: {
        x: baseX + i * horizontalSpacing,
        y: level * verticalSpacing
      }
    }));

    const childEdges = item.children.map(child => ({
      id: `${parentId}-${child.id}`,
      source: parentId,
      target: child.id.toString(),
      animated: true
    }));

    setNodes(prev => [...prev, ...childNodes]);
    setEdges(prev => [...prev, ...childEdges]);
    setExpanded(prev => new Set(prev).add(parentId));
  };

  const getDescendantIds = (parentId) => {
    const stack = [parentId];
    const descendants = [];

    while (stack.length > 0) {
      const current = stack.pop();
      const childEdges = edges.filter(e => e.source === current);
      childEdges.forEach(edge => {
        descendants.push(edge.target);
        stack.push(edge.target);
      });
    }

    return descendants;
  };

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(event, node) => {
          const item = node.data.item;
          expandNode(item, node.id);
        }}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
// import React from "react";
// import TreeDiagram from "./TreeDiagram";
// import { useNodosContext } from "../../context/nodosContext";

// const Cronologias = () => {
//   const { nodos } = useNodosContext();
//   return (
//     <div>
//       <TreeDiagram data={nodos} />
//     </div>
//   );
// };

// export default Cronologias;
