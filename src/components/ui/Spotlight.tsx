"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { MousePointer } from "lucide-react";

interface SpotlightItem {
  id: string;
  label: string;
  image: string;
}

interface SpotlightProps {
  buttonText?: string;
  items?: SpotlightItem[];
  rightColumnContent?: React.ReactNode;
  backgroundColor?: string;
  buttonBorderColor?: string;
  buttonHoverBgColor?: string;
  buttonTextColor?: string;
  menuWidth?: string;
  menuHeight?: string;
  menuBorderRadius?: string;
  menuBgColor?: string;
  menuBorderColor?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  leftColumnBorderColor?: string;
  itemGradientFrom?: string;
  itemGradientTo?: string;
  itemHoverGradientFrom?: string;
  itemHoverGradientTo?: string;
  itemFontSize?: string;
  rightColumnTextColor?: string;
  iconColor?: string;
  iconSize?: number;
  noiseOpacity?: number;
  menuTop?: string;
}

const Spotlight: React.FC<SpotlightProps> = ({
  buttonText = "Reveal",
  items = [
    {
      id: "1",
      label: "Intelligence",
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200",
    },
    {
      id: "2",
      label: "Security",
      image:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200",
    },
    {
      id: "3",
      label: "Quantum",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200",
    },
    {
      id: "4",
      label: "Cloud",
      image:
        "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=1200",
    },
  ],
  rightColumnContent,
  backgroundColor = "#050505",
  buttonBorderColor = "rgba(255,255,255,0.2)",
  buttonHoverBgColor = "rgba(255,255,255,0.05)",
  buttonTextColor = "#ffffff",
  menuWidth = "800px",
  menuHeight = "400px",
  menuBorderRadius = "1.5rem",
  menuBgColor = "#171717",
  menuBorderColor = "rgba(255,255,255,0.1)",
  spotlightColor = "rgba(255,255,255,0.15)",
  spotlightSize = 300,
  leftColumnBorderColor = "rgba(255,255,255,0.05)",
  itemGradientFrom = "#737373",
  itemGradientTo = "#404040",
  itemHoverGradientFrom = "#ffffff",
  itemHoverGradientTo = "#a3a3a3",
  itemFontSize = "2.25rem",
  rightColumnTextColor = "#737373",
  iconColor = "#737373",
  iconSize = 48,
  noiseOpacity = 0.03,
  menuTop = "6rem",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>(items[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const maskImage = useMotionTemplate`
    radial-gradient(
      ${spotlightSize}px circle at ${mouseX}px ${mouseY}px,
      black,
      transparent
    )
  `;

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center pt-10"
      style={{ backgroundColor }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 border px-6 py-2 rounded-full transition-colors"
        style={{
          borderColor: buttonBorderColor,
          color: buttonTextColor,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = buttonHoverBgColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        {buttonText}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-40 rounded-3xl overflow-hidden border"
            style={{
              top: menuTop,
              width: menuWidth,
              height: menuHeight,
              backgroundColor: menuBgColor,
              borderColor: menuBorderColor,
            }}
            onMouseMove={handleMouseMove}
            ref={containerRef}
          >
            <div className="absolute inset-0 z-0">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    opacity: activeItem === item.id ? 1 : 0,
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-black/80" />
            </div>

            <motion.div
              className="pointer-events-none absolute -inset-px rounded-3xl z-10"
              style={{
                maskImage: maskImage,
                WebkitMaskImage: maskImage,
              }}
            >
              {/* Revealed Content Layer */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    opacity: activeItem === item.id ? 1 : 0,
                  }}
                />
              ))}
            </motion.div>

            <div className="relative z-10 grid grid-cols-2 h-full">
              <div
                className="p-10 border-r flex flex-col justify-center space-y-6"
                style={{ borderColor: leftColumnBorderColor }}
              >
                {items.map((item) => (
                  <h2
                    key={item.id}
                    className="font-bold text-transparent bg-clip-text bg-gradient-to-r cursor-pointer transition-all duration-300 relative z-20"
                    style={{
                      fontSize: itemFontSize,
                      backgroundImage: `linear-gradient(to right, ${itemGradientFrom}, ${itemGradientTo})`,
                    }}
                    onMouseEnter={(e) => {
                      setActiveItem(item.id);
                      e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${itemHoverGradientFrom}, ${itemHoverGradientTo})`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${itemGradientFrom}, ${itemGradientTo})`;
                    }}
                  >
                    {item.label}
                  </h2>
                ))}
              </div>
              <div className="p-10 flex items-center justify-center">
                {rightColumnContent || (
                  <div
                    className="text-center"
                    style={{ color: rightColumnTextColor }}
                  >
                    <MousePointer
                      className="mx-auto mb-4 opacity-20"
                      style={{
                        width: iconSize,
                        height: iconSize,
                        color: iconColor,
                      }}
                    />
                    <p>Move cursor to reveal details</p>
                  </div>
                )}
              </div>
            </div>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: noiseOpacity,
                backgroundImage:
                  "url('https://grainy-gradients.vercel.app/noise.svg')",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Spotlight;
