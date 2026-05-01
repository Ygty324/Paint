'use client';

import PigmentSelector from './components/PigmentSelector';
import ColorVisualizer from './components/ColorVisualizer';
import RecipePanel from './components/RecipePanel';

/**
 * Digital Paint Lab - Main Page
 * Three-column layout: Pigments | Visualizer | Recipe
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-xl border-b-2 border-blue-500">
        <div className="max-w-[2000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Digital Paint Lab
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                Professional paint mixing simulator with industry-standard pigments
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <main className="max-w-[2000px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Pigment Selector */}
          <div className="lg:col-span-3 h-[calc(100vh-140px)]">
            <PigmentSelector />
          </div>

          {/* Center Column - Color Visualizer */}
          <div className="lg:col-span-6 h-[calc(100vh-140px)]">
            <ColorVisualizer />
          </div>

          {/* Right Column - Recipe Panel */}
          <div className="lg:col-span-3 h-[calc(100vh-140px)]">
            <RecipePanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white mt-auto border-t border-slate-700">
        <div className="max-w-[2000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              © 2026 Digital Paint Lab - Paint Mixing Simulator
            </div>
            <div className="text-gray-400">
              Built with Next.js
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
