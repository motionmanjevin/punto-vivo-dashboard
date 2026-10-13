"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  title: string;
  desc: string;
}

interface NebulaProps {
  brandName?: string;
  navItems?: string[];
  menuItems?: MenuItem[];
  ctaText?: string;
  backgroundColor?: string;
  blob1Color?: string;
  blob2Color?: string;
  blobSize?: string;
  noiseOpacity?: number;
  navBgColor?: string;
  navBorderColor?: string;
  navTextColor?: string;
  navHoverTextColor?: string;
  menuWidth?: string;
  menuBgColor?: string;
  menuBorderColor?: string;
  menuShadowColor?: string;
  sidebarBgColor?: string;
  sidebarGradientFrom?: string;
  sidebarGradientTo?: string;
  sidebarTitleColor?: string;
  sidebarDescColor?: string;
  ctaButtonBgColor?: string;
  ctaButtonHoverBgColor?: string;
  ctaButtonTextColor?: string;
  itemDotColor?: string;
  itemDotHoverColor?: string;
  itemDotHoverScale?: number;
  itemTitleColor?: string;
  itemDescColor?: string;
  menuTop?: string;
  animationDuration?: number;
  animationEase?: [number, number, number, number];
}

const Nebula: React.FC<NebulaProps> = ({
  brandName = "NEBULA",
  navItems = ["Products", "Pricing"],
  menuItems = [
    { title: "Starlight Analytics", desc: "Real-time data processing" },
    { title: "Gravity Engine", desc: "Physics simulation core" },
    { title: "Orbit UI", desc: "Component library" },
    { title: "Cosmos DB", desc: "Distributed database" },
  ],
  ctaText = "Start Trial",
  backgroundColor = "#171717",
  blob1Color = "rgba(147,51,234,0.3)",
  blob2Color = "rgba(37,99,235,0.3)",
  blobSize = "500px",
  noiseOpacity = 0.2,
  navBgColor = "rgba(255,255,255,0.05)",
  navBorderColor = "rgba(255,255,255,0.1)",
  navTextColor = "rgba(255,255,255,0.8)",
  navHoverTextColor = "#ffffff",
  menuWidth = "900px",
  menuBgColor = "rgba(0,0,0,0.4)",
  menuBorderColor = "rgba(255,255,255,0.1)",
  menuShadowColor = "rgba(0,0,0,0.5)",
  sidebarBgColor = "rgba(255,255,255,0.05)",
  sidebarGradientFrom = "rgba(168,85,247,0.2)",
  sidebarGradientTo = "rgba(59,130,246,0.2)",
  sidebarTitleColor = "#ffffff",
  sidebarDescColor = "rgba(255,255,255,0.6)",
  ctaButtonBgColor = "#ffffff",
  ctaButtonHoverBgColor = "#e5e7eb",
  ctaButtonTextColor = "#000000",
  itemDotColor = "#3b82f6",
  itemDotHoverColor = "#a78bfa",
  itemDotHoverScale = 1.5,
  itemTitleColor = "#ffffff",
  itemDescColor = "rgba(255,255,255,0.4)",
  menuTop = "6rem",
  animationDuration = 0.4,
  animationEase = [0.23, 1, 0.32, 1],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center pt-10"
      style={{ backgroundColor }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "#0a0a0a" }}>
        <div
          className="absolute top-[-10%] left-[-10%] rounded-full blur-[120px]"
          style={{
            width: blobSize,
            height: blobSize,
            backgroundColor: blob1Color,
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] rounded-full blur-[120px]"
          style={{
            width: blobSize,
            height: blobSize,
            backgroundColor: blob2Color,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: noiseOpacity,
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />
      </div>

      <nav
        className="relative z-50 flex items-center gap-6 px-8 py-4 rounded-full border backdrop-blur-md shadow-2xl"
        style={{
          backgroundColor: navBgColor,
          borderColor: navBorderColor,
        }}
      >
        <span
          className="font-bold tracking-widest"
          style={{ color: "#ffffff" }}
        >
          {brandName}
        </span>
        <div
          className="h-6 w-px"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />
        {navItems.map((item, idx) => (
          <button
            key={item}
            className="text-sm font-medium transition-colors"
            style={{ color: navTextColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = navHoverTextColor;
              idx === 0 && handleMouseEnter();
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = navTextColor;
              idx === 0 && handleMouseLeave();
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: animationDuration, ease: animationEase }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute z-40 p-2"
            style={{ top: menuTop, width: menuWidth }}
          >
            <div
              className="w-full rounded-3xl border backdrop-blur-xl overflow-hidden"
              style={{
                backgroundColor: menuBgColor,
                borderColor: menuBorderColor,
                boxShadow: `0 0 50px -12px ${menuShadowColor}`,
              }}
            >
              <div className="grid grid-cols-12 gap-0">
                <div
                  className="col-span-4 p-8 flex flex-col justify-between relative overflow-hidden group"
                  style={{ backgroundColor: sidebarBgColor }}
                >
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to bottom right, ${sidebarGradientFrom}, ${sidebarGradientTo})`,
                      opacity: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}
                  />
                  <div className="relative z-10">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: sidebarTitleColor }}
                    >
                      Explore the Void
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: sidebarDescColor }}
                    >
                      Advanced telemetry for space-age applications. Navigate
                      the future.
                    </p>
                  </div>
                  <button
                    className="relative z-10 mt-6 w-fit rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                    style={{
                      backgroundColor: ctaButtonBgColor,
                      color: ctaButtonTextColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        ctaButtonHoverBgColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = ctaButtonBgColor;
                    }}
                  >
                    {ctaText}
                  </button>
                </div>
                <div className="col-span-8 p-8 grid grid-cols-2 gap-8">
                  {menuItems.map((item, i) => (
                    <motion.div
                      key={i}
                      className="group cursor-pointer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <div
                          className="w-2 h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: itemDotColor,
                            boxShadow: `0 0 10px ${itemDotColor}80`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              itemDotHoverColor;
                            e.currentTarget.style.transform = `scale(${itemDotHoverScale})`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              itemDotColor;
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        />
                        <h4
                          className="font-medium transition-transform"
                          style={{ color: itemTitleColor }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateX(0.25rem)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateX(0)";
                          }}
                        >
                          {item.title}
                        </h4>
                      </div>
                      <p
                        className="text-xs pl-5"
                        style={{ color: itemDescColor }}
                      >
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Nebula;
