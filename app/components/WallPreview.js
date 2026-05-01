'use client';

import { useState } from 'react';
import { usePaint } from '../../context/PaintContext';
import { rgbToCss } from '../../lib/pigmentData';

/**
 * WallPreview Component
 * Shows the mixed color applied to different wall textures with lighting options
 */
export default function WallPreview() {
  const { resultColor } = usePaint();
  const [texture, setTexture] = useState('smooth');
  const [lighting, setLighting] = useState('daylight');

  // Texture patterns (using CSS)
  const textures = {
    smooth: {
      name: 'Smooth Wall',
      pattern: null,
      background: rgbToCss(resultColor),
    },
    textured: {
      name: 'Textured',
      pattern: `repeating-linear-gradient(
        90deg,
        ${rgbToCss(resultColor)} 0px,
        ${rgbToCss({ ...resultColor, r: resultColor.r * 0.95, g: resultColor.g * 0.95, b: resultColor.b * 0.95 })} 2px,
        ${rgbToCss(resultColor)} 4px
      )`,
      background: rgbToCss(resultColor),
    },
    rough: {
      name: 'Rough/Stucco',
      pattern: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(0,0,0,0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                ${rgbToCss(resultColor)}`,
      background: rgbToCss(resultColor),
    },
  };

  // Lighting filters
  const lightingFilters = {
    daylight: {
      name: 'Daylight',
      filter: 'brightness(1) saturate(1)',
    },
    warmIndoor: {
      name: 'Warm Indoor',
      filter: 'brightness(0.95) saturate(1.1) sepia(0.15)',
    },
    coolIndoor: {
      name: 'Cool Indoor',
      filter: 'brightness(0.9) saturate(0.95) hue-rotate(5deg)',
    },
  };

  const currentTexture = textures[texture];
  const currentLighting = lightingFilters[lighting];

  return (
    <div className="bg-slate-800 rounded-lg shadow-2xl h-full flex flex-col overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-600">
        <h3 className="text-lg font-bold text-gray-100">Wall Visualization</h3>
        <p className="text-sm text-gray-400">See your color on a realistic wall</p>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3 border-b border-slate-600">
        {/* Texture Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">
            Wall Texture
          </label>
          <div className="flex gap-2">
            {Object.entries(textures).map(([key, tex]) => (
              <button
                key={key}
                onClick={() => setTexture(key)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  texture === key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {tex.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lighting Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">
            Lighting Condition
          </label>
          <div className="flex gap-2">
            {Object.entries(lightingFilters).map(([key, light]) => (
              <button
                key={key}
                onClick={() => setLighting(key)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  lighting === key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {light.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wall Preview */}
      <div className="flex-1 p-6 bg-gray-900 relative overflow-hidden">
        {/* Wall Surface */}
        <div className="absolute inset-6 rounded-lg shadow-2xl overflow-hidden border-4 border-gray-700">
          <div
            className="w-full h-full transition-all duration-500"
            style={{
              background: currentTexture.pattern !== null ? currentTexture.pattern : currentTexture.background,
              filter: currentLighting.filter,
            }}
          >
            {/* Lighting Gradient Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 30% 30%,
                  rgba(255, 255, 255, 0.2) 0%,
                  transparent 50%,
                  rgba(0, 0, 0, 0.15) 100%)`,
              }}
            />

            {/* Room Context Shadows */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black/10 to-transparent" />
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black/10 to-transparent" />
          </div>
        </div>

        {/* Info Label */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
          <div className="font-medium">{currentTexture.name}</div>
          <div className="text-gray-300">{currentLighting.name}</div>
        </div>
      </div>
    </div>
  );
}
