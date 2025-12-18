"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = {
  id: string;
  name: string;
  cssVars: Record<string, string>;
};

// Define your presets exactly mapping to CSS variables
export const themePresets: Record<string, Theme> = {
  "modern-minimal": {
    id: "modern-minimal",
    name: "Modern Minimal",
    cssVars: {
      "--background": "0 0% 100%",           // White content
      "--foreground": "240 10% 3.9%",        // Dark text
      "--sidebar": "240 4.8% 95.9%",         // Light gray sidebar (#f4f4f5)
      "--sidebar-foreground": "240 5.9% 10%",// Dark sidebar text
      "--sidebar-accent": "240 4.8% 90%",    // Hover state
      "--sidebar-border": "240 5.9% 90%",    // Sidebar border
      "--primary": "240 5.9% 10%",           // Black primary
      "--primary-foreground": "0 0% 98%",
    },
  },
  "vibrant-creative": {
    id: "vibrant-creative",
    name: "Vibrant Creative",
    cssVars: {
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%",
      "--sidebar": "262 83% 96%",            // Light Purple sidebar
      "--sidebar-foreground": "262 47% 30%", // Dark Purple text
      "--sidebar-accent": "262 83% 92%",     // Hover
      "--sidebar-border": "262 83% 85%",
      "--primary": "262 83% 58%",            // Vivid Purple
      "--primary-foreground": "210 40% 98%",
    },
  },
  "corporate-trust": {
    id: "corporate-trust",
    name: "Corporate Trust",
    cssVars: {
      "--background": "210 40% 98%",         // Very light blueish gray
      "--foreground": "222.2 47.4% 11.2%",
      "--sidebar": "217 33% 17%",            // Dark Blue sidebar
      "--sidebar-foreground": "210 40% 98%", // White text
      "--sidebar-accent": "217 33% 25%",     // Lighter blue hover
      "--sidebar-border": "217 33% 20%",
      "--primary": "221.2 83.2% 53.3%",      // Corporate Blue
      "--primary-foreground": "210 40% 98%",
    },
  },
  "dark-mode-pro": {
    id: "dark-mode-pro",
    name: "Dark Future",
    cssVars: {
      "--background": "240 10% 3.9%",        // Almost black
      "--foreground": "0 0% 98%",            // White text
      "--sidebar": "0 0% 0%",                // Pure black sidebar
      "--sidebar-foreground": "240 5% 64.9%",// Gray text
      "--sidebar-accent": "240 3.7% 15.9%",  // Dark gray hover
      "--sidebar-border": "240 3.7% 15.9%",
      "--primary": "142.1 76.2% 36.3%",      // Neon Green
      "--primary-foreground": "355.7 100% 97.3%",
    },
  },
};

type ThemeContextType = {
  currentTheme: string;
  setTheme: (themeId: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState("modern-minimal");

  const setTheme = (themeId: string) => {
    const theme = themePresets[themeId];
    if (!theme) return;

    setCurrentTheme(themeId);
    
    // Inject CSS variables into the root
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Handle dark mode class for specific Tailwind utilities
    if (themeId === 'dark-mode-pro' || themeId === 'corporate-trust') {
        // Optional: Toggle a 'dark' class if you want to use dark: variants
        // document.documentElement.classList.add('dark');
    } else {
        // document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAdminTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return context;
};