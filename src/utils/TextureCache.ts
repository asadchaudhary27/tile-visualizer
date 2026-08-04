import * as THREE from 'three';

const cache = new Map<string, THREE.CanvasTexture>();

export const TextureCache = {
  getDarkFabric: () => {
    if (!cache.has('darkFabric')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b'; 
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#0f172a'; 
        for(let i=0; i<512; i+=64) {
          ctx.fillRect(i, 0, 16, 512);
          ctx.fillRect(0, i, 512, 16);
        }
        ctx.fillStyle = '#8B6508';
        for(let i=32; i<512; i+=128) {
          ctx.fillRect(i, 0, 2, 512);
          ctx.fillRect(0, i, 512, 2);
        }
        for (let i = 0; i < 60000; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          ctx.fillStyle = Math.random() > 0.5 ? '#334155' : '#020617';
          ctx.globalAlpha = 0.05;
          ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1.0;
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      tex.anisotropy = 8;
      cache.set('darkFabric', tex);
    }
    return cache.get('darkFabric')!;
  },
  
  getPlainFabric: () => {
    if (!cache.has('plainFabric')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 80000; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#c0c0c0';
          ctx.globalAlpha = 0.4;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      tex.anisotropy = 8;
      cache.set('plainFabric', tex);
    }
    return cache.get('plainFabric')!;
  },

  getLightPattern: () => {
    if (!cache.has('lightPattern')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f5f5f0';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#e0ded8';
        ctx.lineWidth = 6;
        for(let i = -512; i < 1024; i += 32) {
           ctx.beginPath();
           ctx.moveTo(i, 0);
           ctx.lineTo(i + 512, 512);
           ctx.stroke();
        }
        for (let i = 0; i < 60000; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#c0c0c0';
          ctx.globalAlpha = 0.3;
          ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1.0;
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      tex.anisotropy = 8;
      cache.set('lightPattern', tex);
    }
    return cache.get('lightPattern')!;
  },

  getWood: () => {
    if (!cache.has('wood')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#4A3728';
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#3A2718';
        for (let i = 0; i < 200; i++) {
          const y = Math.random() * 512;
          const h = Math.random() * 4 + 1;
          ctx.globalAlpha = Math.random() * 0.4 + 0.1;
          ctx.fillRect(0, y, 512, h);
        }
        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          ctx.fillStyle = Math.random() > 0.5 ? '#5A4738' : '#2A1708';
          ctx.globalAlpha = 0.15;
          ctx.fillRect(x, y, 2, 2);
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      cache.set('wood', tex);
    }
    return cache.get('wood')!;
  },

  getTerrazzo: () => {
    if (!cache.has('terrazzo')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fff5f5'; 
        ctx.fillRect(0, 0, 512, 512);
        const chips = ['#e2e8f0', '#94a3b8', '#d1d5db', '#1e293b', '#ccb38c'];
        for (let i = 0; i < 2000; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const s = Math.random() * 8 + 2;
          ctx.fillStyle = chips[Math.floor(Math.random() * chips.length)];
          ctx.globalAlpha = Math.random() * 0.8 + 0.2;
          ctx.beginPath();
          ctx.arc(x, y, s, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      cache.set('terrazzo', tex);
    }
    return cache.get('terrazzo')!;
  },

  getMarble: () => {
    if (!cache.has('marble')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fafafa';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#e5e5e5';
        for (let i = 0; i < 20; i++) {
           ctx.beginPath();
           ctx.moveTo(Math.random() * 512, 0);
           ctx.bezierCurveTo(
             Math.random() * 512, 170, 
             Math.random() * 512, 340, 
             Math.random() * 512, 512
           );
           ctx.lineWidth = Math.random() * 15 + 2;
           ctx.stroke();
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      cache.set('marble', tex);
    }
    return cache.get('marble')!;
  },

  getDarkWood: () => {
    if (!cache.has('darkWood')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b'; 
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#0f172a';
        for (let i = 0; i < 150; i++) {
          const y = Math.random() * 512;
          const h = Math.random() * 5 + 1;
          ctx.globalAlpha = Math.random() * 0.5 + 0.1;
          ctx.fillRect(0, y, 512, h);
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      cache.set('darkWood', tex);
    }
    return cache.get('darkWood')!;
  },

  getOak: () => {
    if (!cache.has('oak')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e1b18'; // Dark smoked oak
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#2a2520';
        for (let i = 0; i < 300; i++) {
          const x = Math.random() * 512;
          const w = Math.random() * 4 + 1;
          ctx.globalAlpha = Math.random() * 0.4 + 0.1;
          ctx.fillRect(x, 0, w, 512);
        }
        for (let i = 0; i < 15000; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? '#3d3630' : '#0a0908';
          ctx.globalAlpha = 0.15;
          ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 3);
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      cache.set('oak', tex);
    }
    return cache.get('oak')!;
  },

  getStone: () => {
    if (!cache.has('stone')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#e5e5e5'; // White/Grey Terrazzo or Stone
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#cccccc';
        for (let i = 0; i < 50000; i++) {
           ctx.globalAlpha = 0.2;
           ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random()*3, Math.random()*3);
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      cache.set('stone', tex);
    }
    return cache.get('stone')!;
  },

  getGoldMarble: () => {
    if (!cache.has('goldMarble')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111111'; // Deep black
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#d4af37'; // Gold veins
        ctx.lineWidth = 3;
        for (let i = 0; i < 30; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * 512, Math.random() * 512);
          ctx.bezierCurveTo(Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512, 
Math.random() * 512, Math.random() * 512);
          ctx.stroke();
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      cache.set('goldMarble', tex);
    }
    return cache.get('goldMarble')!;
  },

  getKitchenMarble: () => {
    if (!cache.has('kitchenMarble')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * 512, Math.random() * 512);
          ctx.bezierCurveTo(Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512, 
Math.random() * 512, Math.random() * 512);
          ctx.stroke();
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      cache.set('kitchenMarble', tex);
    }
    return cache.get('kitchenMarble')!;
  },

  getBacksplash: () => {
    if (!cache.has('backsplash')) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#cbd5e1'; // Grout
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#ffffff'; // Tile
        const tw = 128;
        const th = 64;
        const grout = 4;
        for(let y=0; y<512; y+=th) {
           const offset = (y / th) % 2 === 0 ? 0 : tw/2;
           for(let x=-tw; x<512; x+=tw) {
              ctx.fillRect(x + offset + grout/2, y + grout/2, tw - grout, th - grout);
           }
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(6, 1.5);
      cache.set('backsplash', tex);
    }
    return cache.get('backsplash')!;
  },

  getModernCeiling: () => {
    if (!cache.has('modernCeiling')) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Base: Acoustic felt (deep matte black)
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, 1024, 1024);
  
        // Wood Slats (Warm modern walnut)
        const slatWidth = 32;
        const gapWidth = 12;
        
        for (let x = 0; x < 1024; x += (slatWidth + gapWidth)) {
          ctx.fillStyle = '#8b5a2b';
          ctx.fillRect(x, 0, slatWidth, 1024);
          
          // Add subtle wood grain variations
          ctx.fillStyle = '#734a22';
          for (let w = 0; w < 4; w++) {
              ctx.fillRect(x + Math.random() * (slatWidth - 2), 0, 2, 1024);
          }
        }
  
        // 2026 Trend: Integrated Seamless Linear LED Channels
        // Draw bright glowing LED strips slicing across the wood slats
        ctx.shadowColor = '#e0f2fe';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        
        // Three clean architectural light lines
        ctx.fillRect(0, 250, 1024, 16);
        ctx.fillRect(0, 512, 1024, 16);
        ctx.fillRect(0, 774, 1024, 16);
        
        ctx.shadowBlur = 0;
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4); // Scale for realistic slat sizes
      tex.anisotropy = 16;
      tex.colorSpace = THREE.SRGBColorSpace;
      cache.set('modernCeiling', tex);
    }
    return cache.get('modernCeiling')!;
  }
};
