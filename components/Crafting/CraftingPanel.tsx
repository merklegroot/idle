'use client'

import { useMemo, useState, useEffect, useRef } from 'react';
import RecipeDetails from './RecipeDetails';
import RecipeItem from './RecipeItem';
import { CRAFTING_RECIPES, CraftingRecipeId } from '@/constants/CraftingRecipeDefs';
import { recipeUtil } from '@/utils/recipeUtil';

interface CraftingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCrafting?: (recipeId: CraftingRecipeId) => void;
}

export default function CraftingPanel({ isOpen, onClose, onStartCrafting }: CraftingPanelProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<CraftingRecipeId | undefined>(
    CRAFTING_RECIPES[0]?.id
  );
  const [position, setPosition] = useState<{ x: number; y: number } | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const selectedRecipe = useMemo(() => {
    return recipeUtil.getRecipeById(selectedRecipeId as CraftingRecipeId);
  }, [selectedRecipeId]);

  const handleCraft = (recipeId: CraftingRecipeId) => {
    onStartCrafting?.(recipeId);
  };

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset position when opening
  useEffect(() => {
    if (isOpen && !isDragging) {
      setPosition(undefined);
    }
  }, [isOpen]);

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;
    
    const rect = windowRef.current.getBoundingClientRect();
    
    // Calculate offset from mouse position to window's top-left corner
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // If position was undefined (centered), set initial position based on current rect
    if (position === undefined) {
      setPosition({ x: rect.left, y: rect.top });
    }
    
    setIsDragging(true);
  };

  if (!isOpen) return null;

  const windowStyle = position
    ? { left: `${position.x}px`, top: `${position.y}px`, transform: 'none', position: 'fixed' as const }
    : {};

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${position ? '' : 'flex items-center justify-center'} p-4`}>
      <div 
        ref={windowRef}
        className="bg-white rounded-lg shadow-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
        style={windowStyle}
      >
        <div 
          className="flex justify-between items-center mb-4 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-2xl font-bold text-gray-800">Crafting</h2>
          <button
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {Object.keys(CRAFTING_RECIPES).length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No recipes available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top: recipe list */}
            <div className="border rounded-lg border-gray-200 overflow-hidden">
              <div className="max-h-40 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                  {CRAFTING_RECIPES.map(recipe => {
                    return (
                      <RecipeItem
                        key={recipe.id}
                        recipe={recipe}
                        isSelected={recipe.id === selectedRecipe?.id}
                        onSelect={setSelectedRecipeId}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom: selected recipe details */}
            <div className="border rounded-lg border-gray-200 p-4">
              <RecipeDetails 
                selectedRecipe={selectedRecipe} 
                onCraft={handleCraft}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
