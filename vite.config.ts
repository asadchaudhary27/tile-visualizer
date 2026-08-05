import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs';
import path from 'path';

function saveRoomPlugin() {
  return {
    name: 'save-room-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/save-room' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const roomsFilePath = path.join(process.cwd(), 'src', 'data', 'rooms.ts');
              let fileContent = fs.readFileSync(roomsFilePath, 'utf-8');
              
              const insertIndex = fileContent.lastIndexOf('];');
              if (insertIndex === -1) throw new Error('Could not find the end of the ROOMS array');
              
              const newRoomId = `room-${Date.now()}`;
              const newRoomString = `,
  {
    id: '${newRoomId}',
    name: 'New Room (${new Date().toLocaleTimeString()})',
    imageUrl: '${data.imageUrl}',
    surfaces: [
      {
        id: '${newRoomId}-floor',
        label: 'Floor',
        type: 'floor',
        polygon: [],
        maskUrl: '${data.maskUrl}',
        perspective: ${data.perspective},
        rotateX: ${data.rotateX},
        rotateY: ${data.rotateY},
        rotateZ: ${data.rotateZ},
        scale: ${data.scale},
        panX: ${data.panX},
        panY: ${data.panY}
      }
    ]
  }
`;
              const updatedContent = fileContent.slice(0, insertIndex) + newRoomString + fileContent.slice(insertIndex);
              fs.writeFileSync(roomsFilePath, updatedContent);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: (error as Error).message }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    saveRoomPlugin(),
  ],
})
