import { Line, Group } from 'react-konva';
import type { Surface } from '../lib/types';
import { convertPercentageToPixels, getCentroid } from '../lib/polygonUtils';
import useImage from 'use-image';
import { useDesignStore } from '../store/useDesignStore';
import { TILES } from '../data/tiles';

interface Props {
  surface: Surface;
  imageWidth: number;
  imageHeight: number;
  onClick: () => void;
  isSelected: boolean;
}

export default function SurfaceOverlay({ surface, imageWidth, imageHeight, onClick, isSelected }: Props) {
  const points = convertPercentageToPixels(surface.polygon, imageWidth, imageHeight);
  const centroid = getCentroid(points);
  
  const config = useDesignStore(state => state.configs[surface.id]);
  const activeTile = config?.mode === 'single' ? TILES.find(t => t.id === config.tileId) : null;
  const sourceUrl = config?.mode === 'layout' ? config.generatedPatternUrl : activeTile?.imageUrl;
  const [image] = useImage(sourceUrl || '');
  
  const hasProduct = !!config;

  return (
    <Group>
      <Line
        points={points}
        closed
        fillPatternImage={image}
        fillPatternScale={{ x: 0.5, y: 0.5 }} // Adjust scaling as needed
        fill={!hasProduct ? (isSelected ? 'rgba(20,184,166,0.3)' : 'rgba(255,255,255,0.2)') : undefined}
        stroke={isSelected ? '#14b8a6' : (!hasProduct ? 'rgba(255,255,255,0.5)' : 'transparent')}
        strokeWidth={isSelected ? 3 : 1}
        dash={!hasProduct ? [10, 5] : undefined}
        onTap={onClick}
        onClick={onClick}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = 'pointer';
          if (!hasProduct || isSelected) {
            (e.target as any).stroke('#14b8a6');
            (e.target as any).strokeWidth(3);
          }
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = 'default';
          (e.target as any).stroke(isSelected ? '#14b8a6' : (hasProduct ? 'transparent' : 'rgba(255,255,255,0.5)'));
          (e.target as any).strokeWidth(isSelected ? 3 : (!hasProduct ? 1 : 0));
        }}
      />
    </Group>
  );
}
