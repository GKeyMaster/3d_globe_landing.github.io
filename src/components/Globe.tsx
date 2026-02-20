import { useEffect, useRef } from 'react';
import { Viewer } from 'cesium';
import { createViewer } from '../lib/cesium/createViewer';
import 'cesium/Build/Cesium/Widgets/widgets.css';

export function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the Cesium viewer
    const viewer = createViewer({
      container: containerRef.current,
    });

    viewerRef.current = viewer;

    // Cleanup function
    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    />
  );
}