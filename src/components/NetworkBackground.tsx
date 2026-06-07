import React, { useEffect, useRef } from 'react';

type NetworkNode = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  isTarget: boolean;
  id: string;
};

export const NetworkBackground = React.memo(({ faded = false }: { faded?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;
    let nodes: NetworkNode[] = [];
    let time = 0;
    let lastTime = performance.now();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;

    const mouse = { x: -1000, y: -1000, radius: 120 };

    const initNetwork = () => {
      nodes = [];
      const density = prefersReducedMotion ? 32000 : (width < 768 ? 26000 : 18000);
      const minNodes = prefersReducedMotion ? 18 : 26;
      const maxNodes = prefersReducedMotion ? 48 : 120;
      const numNodes = Math.min(maxNodes, Math.max(minNodes, Math.floor((width * height) / density)));

      for (let i = 0; i < numNodes; i++) {
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        nodes.push({
          x: startX,
          y: startY,
          ox: startX,
          oy: startY,
          vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.3 : 1.5),
          vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.3 : 1.5),
          isTarget: Math.random() > 0.92,
          id: `0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`,
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initNetwork();
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        draw();
      }
    };

    const handleReducedMotionChange = () => {
      prefersReducedMotion = motionQuery.matches;
      resize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', handleReducedMotionChange);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    
    resize();

    const draw = () => {
      const now = performance.now();
      let dt = now - lastTime;
      const frameInterval = prefersReducedMotion ? 1000 / 18 : 1000 / 30;

      if (dt < frameInterval) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      if (dt > 120) dt = 16;
      lastTime = now;
      time += dt;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      // 1. Moving Grid Background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = prefersReducedMotion ? 80 : 60;
      const offset = (time * 0.04) % gridSize;
      
      ctx.beginPath();
      for (let x = 0; x < width + gridSize; x += gridSize) {
        ctx.moveTo(x - offset, 0);
        ctx.lineTo(x - offset, height);
      }
      for (let y = 0; y < height + gridSize; y += gridSize) {
        ctx.moveTo(0, y - offset);
        ctx.lineTo(width, y - offset);
      }
      ctx.stroke();

      // 2. Update node physics
      for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        n.ox += n.vx;
        n.oy += n.vy;

        // Wrap edges safely
        if (n.ox < 0) { n.ox += width; n.x += width; }
        if (n.ox > width) { n.ox -= width; n.x -= width; }
        if (n.oy < 0) { n.oy += height; n.y += height; }
        if (n.oy > height) { n.oy -= height; n.y -= height; }

        // Interactive mouse pulling
        if (!prefersReducedMotion) {
          const dx = mouse.x - n.ox;
          const dy = mouse.y - n.oy;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const targetX = n.ox + dx * force * 0.4;
            const targetY = n.oy + dy * force * 0.4;

            n.x += (targetX - n.x) * 0.15;
            n.y += (targetY - n.y) * 0.15;

            // Draw hacking line from node to mouse
            ctx.strokeStyle = `rgba(0, 240, 255, ${force * 0.45})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          } else {
            n.x += (n.ox - n.x) * 0.1;
            n.y += (n.oy - n.y) * 0.1;
          }
        } else {
          n.x = n.ox;
          n.y = n.oy;
        }
      }

      // 3. Draw Edges
      ctx.lineWidth = 1;
      const maxDist = prefersReducedMotion ? 110 : 150;
      const maxDistSq = maxDist * maxDist;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const opacity = 1 - (dist / maxDist);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw Nodes and Glitch Effects
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        
        let dotX = n.x;
        let dotY = n.y;
        let dotW = 3;
        let dotH = 3;

        const isGlitching = !prefersReducedMotion && Math.random() < 0.015;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        if (isGlitching) {
          dotX += (Math.random() - 0.5) * 20;
          if (Math.random() > 0.6) {
            dotW = Math.random() * 30 + 5;
            dotH = 2;
          }
          const r = Math.random();
          if (r > 0.66) ctx.fillStyle = '#00f0ff';
          else if (r > 0.33) ctx.fillStyle = '#ff003c';
        }

        // Draw dot (standard nodes have a subtle flicker/chance to skip frame)
        if (prefersReducedMotion || Math.random() > (isGlitching ? 0.1 : 0.05)) {
          if (!n.isTarget) {
            ctx.fillRect(dotX - dotW/2, dotY - dotH/2, dotW, dotH);
          }
        }

        // Draw Target Highlight
        if (n.isTarget) {
          ctx.strokeStyle = '#ff003c';
          ctx.lineWidth = 1;
          ctx.strokeRect(n.x - 10, n.y - 10, 20, 20);

          ctx.fillStyle = '#ff003c';
          ctx.fillRect(n.x - 2, n.y - 2, 4, 4);

          ctx.font = '10px "Share Tech Mono", monospace';
          ctx.fillText(`ID:${n.id}`, n.x + 15, n.y - 5);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillText(`[${Math.floor(n.x)},${Math.floor(n.y)}]`, n.x + 15, n.y + 7);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleReducedMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none bg-black transition-opacity duration-1000 ease-in-out ${faded ? 'opacity-15' : 'opacity-100'}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
        backgroundSize: '100% 4px',
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)'
      }}></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>
    </div>
  );
});
