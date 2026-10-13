"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface SidekickProps {
  items?: string[];
  footerLinks?: string[];
  backgroundColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonHoverScale?: number;
  overlayBgColor?: string;
  drawerWidth?: string;
  drawerBgColor?: string;
  drawerShadowColor?: string;
  itemTextColor?: string;
  itemHoverColor?: string;
  itemHoverTranslateX?: string;
  footerBgColor?: string;
  footerBorderColor?: string;
  footerTextColor?: string;
  springDamping?: number;
  springStiffness?: number;
  itemDelay?: number;
  sideImage?: string;
}

const Sidekick: React.FC<SidekickProps> = ({
  items = ["Collections", "New Arrivals", "Accessories", "Editorial"],
  footerLinks = ["Instagram", "Twitter", "LinkedIn"],
  backgroundColor = "#f5f5f5",
  buttonBgColor = "#000000",
  buttonTextColor = "#ffffff",
  buttonHoverScale = 1.1,
  overlayBgColor = "rgba(0,0,0,0.2)",
  drawerWidth = "400px",
  drawerBgColor = "#ffffff",
  drawerShadowColor = "rgba(0,0,0,0.5)",
  itemTextColor = "#a3a3a3",
  itemHoverColor = "#000000",
  itemHoverTranslateX = "1rem",
  footerBgColor = "#fafafa",
  footerBorderColor = "#f5f5f5",
  footerTextColor = "#737373",
  springDamping = 25,
  springStiffness = 200,
  itemDelay = 0.1,
  sideImage = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="absolute top-10 right-10 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 rounded-full shadow-lg transition-transform"
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = `scale(${buttonHoverScale})`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 backdrop-blur-sm z-30"
              style={{ backgroundColor: overlayBgColor }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: springDamping,
                stiffness: springStiffness,
              }}
              className="absolute top-0 right-0 h-full z-40 shadow-2xl flex overflow-hidden"
              style={{
                width: "80vw", // Significantly wider
                maxWidth: "1600px",
                backgroundColor: drawerBgColor,
                boxShadow: `0 25px 50px -12px ${drawerShadowColor}`,
              }}
            >
              {/* Left Image Section - 75% roughly or flex-grow */}
              <div className="w-3/4 relative hidden md:block">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${sideImage})` }}
                />
                <div className="absolute inset-0 bg-black/20" />{" "}
                {/* subtle overlay */}
              </div>

              {/* Right Content Section */}
              <div
                className="flex-1 flex flex-col w-full md:w-1/4 min-w-[300px] border-l"
                style={{ borderColor: footerBorderColor }}
              >
                <div className="flex-1 p-10 flex flex-col justify-center space-y-8">
                  {items.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * itemDelay + 0.2 }}
                      className="group cursor-pointer"
                    >
                      <h2
                        className="text-4xl font-light transition-all duration-300"
                        style={{
                          color: itemTextColor,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = itemHoverColor;
                          e.currentTarget.style.transform = `translateX(${itemHoverTranslateX})`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = itemTextColor;
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        {item}
                      </h2>
                    </motion.div>
                  ))}
                </div>
                <div
                  className="p-10 border-t"
                  style={{
                    backgroundColor: footerBgColor,
                    borderColor: footerBorderColor,
                  }}
                >
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: footerTextColor }}
                  >
                    {footerLinks.map((link) => (
                      <span key={link}>{link}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidekick;
