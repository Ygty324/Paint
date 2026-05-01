'use client';

import { usePaint } from '../../context/PaintContext';
import { rgbToCss } from '../../lib/pigmentData';
import WallPreview from './WallPreview';

/**
 * ColorVisualizer Component
 * Large preview area showing the resulting mixed color
 * Displays color codes and provides reset functionality
 */
export default function ColorVisualizer() {
  const { resultColor, resetMix, hasPigments, undoLastAddition, pigmentCount } = usePaint();

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto">
      {/* Paint Bucket Preview */}
      <div className="bg-slate-800 rounded-lg shadow-2xl p-6 flex-shrink-0 border border-slate-700">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-100">Mixed Color Preview</h2>
          <p className="text-sm text-gray-400 mt-1">
            {hasPigments
              ? `${pigmentCount} pigment${pigmentCount > 1 ? 's' : ''} added`
              : 'Add pigments to see your custom color'}
          </p>
        </div>

        {/* Large Color Preview */}
        <div className="relative">
          <div
            className="w-full h-64 rounded-xl shadow-2xl border-4 border-slate-600 transition-all duration-500 ease-in-out"
            style={{ backgroundColor: rgbToCss(resultColor) }}
          >
            {/* Paint Can Illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {!hasPigments && (
                  <div className="text-gray-500 text-6xl mb-2">🎨</div>
                )}
              </div>
            </div>
          </div>

          {/* Shimmer Effect Overlay */}
          {hasPigments && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl pointer-events-none" />
          )}
        </div>

        {/* Color Codes */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
            <div className="text-xs font-medium text-gray-400 uppercase mb-1">
              Hex Code
            </div>
            <div className="text-2xl font-bold text-gray-100 font-mono">
              {resultColor.hex}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4 text-center border border-slate-600">
            <div className="text-xs font-medium text-gray-400 uppercase mb-1">
              RGB Values
            </div>
            <div className="text-lg font-bold text-gray-100 font-mono">
              {Math.round(resultColor.r)}, {Math.round(resultColor.g)},{' '}
              {Math.round(resultColor.b)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {hasPigments && (
            <>
              <button
                onClick={undoLastAddition}
                className="flex-1 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
              >
                ↶ Undo Last
              </button>

              <button
                onClick={resetMix}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                🗑️ Reset Mix
              </button>
            </>
          )}

          {!hasPigments && (
            <div className="flex-1 px-4 py-3 bg-slate-700 text-gray-400 rounded-lg font-medium text-center border border-slate-600">
              Pure White Base
            </div>
          )}
        </div>
      </div>

      {/* Wall Preview Section */}
      <div className="flex-shrink-0 min-h-[500px]">
        <WallPreview />
      </div>
    </div>
  );
}
