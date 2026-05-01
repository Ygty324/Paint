'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WHITE_BASE } from '../lib/pigmentData';
import { mixColor } from '../lib/colorMixing';
import { scaleRecipeForArea } from '../lib/paintCalculations';

// Create context
const PaintContext = createContext();

// Initial state
const initialBasePaint = {
  type: WHITE_BASE.name,
  amount: 1000, // ml (1 liter)
  color: { ...WHITE_BASE.rgb },
};

/**
 * Paint Context Provider Component
 * Manages all paint mixing state and calculations
 */
export function PaintProvider({ children }) {
  // State
  const [basePaint, setBasePaint] = useState(initialBasePaint);
  const [addedPigments, setAddedPigments] = useState([]);
  const [resultColor, setResultColor] = useState({
    r: 255,
    g: 255,
    b: 255,
    hex: '#FFFFFF',
  });
  const [wallArea, setWallArea] = useState(0);
  const [calculatedNeeds, setCalculatedNeeds] = useState(null);

  // Auto-recalculate result color whenever pigments change
  useEffect(() => {
    const newColor = mixColor(basePaint, addedPigments);
    setResultColor(newColor);
  }, [basePaint, addedPigments]);

  // Auto-recalculate material needs whenever wallArea or recipe changes
  useEffect(() => {
    if (wallArea > 0) {
      const scaled = scaleRecipeForArea(basePaint, addedPigments, wallArea);
      setCalculatedNeeds(scaled);
    } else {
      setCalculatedNeeds(null);
    }
  }, [basePaint, addedPigments, wallArea]);

  /**
   * Add a pigment to the mix
   * @param {Object} pigment - Pigment object from pigmentData
   * @param {number} amount - Amount to add
   * @param {string} unit - Unit of measurement ('drop', 'ml', 'tube')
   */
  const addPigment = useCallback((pigment, amount, unit) => {
    if (!pigment || amount <= 0) {
      console.warn('Invalid pigment or amount');
      return;
    }

    // Create pigment entry
    const newPigment = {
      id: pigment.id,
      name: pigment.name,
      code: pigment.code,
      color: { ...pigment.rgb },
      amount: Number(amount),
      unit: unit.toLowerCase(),
      strength: pigment.strength,
      opacity: pigment.opacity,
      addedAt: Date.now(), // For tracking order
    };

    setAddedPigments((prev) => [...prev, newPigment]);
  }, []);

  /**
   * Remove a pigment by index
   * @param {number} index - Index of pigment to remove
   */
  const removePigment = useCallback((index) => {
    setAddedPigments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Remove all instances of a pigment by ID
   * @param {string} pigmentId - ID of pigment to remove all instances of
   */
  const removePigmentById = useCallback((pigmentId) => {
    setAddedPigments((prev) => prev.filter((p) => p.id !== pigmentId));
  }, []);

  /**
   * Reset the entire mix back to white base
   */
  const resetMix = useCallback(() => {
    setAddedPigments([]);
    setBasePaint(initialBasePaint);
    setWallArea(0);
  }, []);

  /**
   * Update wall area for coverage calculations
   * @param {number} area - Wall area in square meters
   */
  const updateWallArea = useCallback((area) => {
    const numArea = Number(area);
    setWallArea(numArea >= 0 ? numArea : 0);
  }, []);

  /**
   * Get total count of a specific pigment in the mix
   * @param {string} pigmentId - Pigment ID to count
   * @returns {number} Total amount of this pigment across all additions
   */
  const getPigmentTotal = useCallback((pigmentId, unit = 'ml') => {
    const filtered = addedPigments.filter((p) => p.id === pigmentId);

    // Sum up amounts (convert to requested unit)
    const total = filtered.reduce((sum, p) => {
      // For simplicity, just sum if units match
      // In a real app, we'd convert all to ml first, then convert to target unit
      if (p.unit === unit) {
        return sum + p.amount;
      }
      return sum;
    }, 0);

    return total;
  }, [addedPigments]);

  /**
   * Undo last pigment addition
   */
  const undoLastAddition = useCallback(() => {
    setAddedPigments((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  // Context value
  const value = {
    // State
    basePaint,
    addedPigments,
    resultColor,
    wallArea,
    calculatedNeeds,

    // Actions
    addPigment,
    removePigment,
    removePigmentById,
    resetMix,
    updateWallArea,
    getPigmentTotal,
    undoLastAddition,

    // Computed values
    hasPigments: addedPigments.length > 0,
    pigmentCount: addedPigments.length,
  };

  return <PaintContext.Provider value={value}>{children}</PaintContext.Provider>;
}

/**
 * Hook to use paint context
 * @returns {Object} Paint context value
 */
export function usePaint() {
  const context = useContext(PaintContext);

  if (!context) {
    throw new Error('usePaint must be used within a PaintProvider');
  }

  return context;
}

export default PaintContext;
