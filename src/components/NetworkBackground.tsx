import React, { useEffect, useRef } from 'react';

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
    let nodes: any[] = [];
    let time = 0;
    let lastTime = performance.now();

    const initNetwork = () => {
      nodes = [];
      const numNodes = Math.floor((width * height) / 15000);
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          isTarget: Math.random() > 0.92,
          id: `0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
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

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    resize();

    const draw = () => {
      const now = performance.now();
      let dt = now - lastTime;
      if (dt > 100) dt = 16;
      lastTime = now;
      time += dt;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 60;
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

      for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 150;
          
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const opacity = 1 - (dist / maxDist);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.25})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n.isTarget) {
          ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3);
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
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
