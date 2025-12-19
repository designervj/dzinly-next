"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = {
  id: string;
  name: string;
  cssVars: Record<string, string>;
  isDark: boolean; // Flag to tell icons/images how to behave
};

export const themePresets: Record<string, Theme> = {
  // 1. Palette: Earthy Organic (Light)
  // https://coolors.co/palette/edede9-d6ccc2-f5ebe0-e3d5ca-d5bdaf
  "organic-calm": {
    id: "organic-calm",
    name: "Organic Calm",
    isDark: false,
    cssVars: {
      "--background": "30 29% 97%",     // #F5EBE0 (Light Cream)
      "--foreground": "24 7% 19%",      // Dark Brown/Gray for text (Contrast)
      "--card": "60 17% 96%",           // #EDEDE9
      "--card-foreground": "24 7% 19%",
      "--popover": "60 17% 96%",
      "--popover-foreground": "24 7% 19%",
      "--primary": "24 16% 50%",        // #D5BDAF (Muted Brown)
      "--primary-foreground": "0 0% 100%", // White text on button
      "--secondary": "30 24% 86%",      // #E3D5CA
      "--secondary-foreground": "24 7% 19%",
      "--muted": "30 20% 90%",
      "--muted-foreground": "24 7% 50%",
      "--accent": "27 22% 82%",         // #D6CCC2
      "--accent-foreground": "24 7% 19%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "27 22% 82%",         // Matches Accent for soft border
      "--input": "27 22% 82%",
      "--ring": "24 16% 50%",
      
      // Sidebar (Creamy)
      "--sidebar": "60 17% 94%",        
      "--sidebar-foreground": "24 7% 19%",
      "--sidebar-primary": "24 16% 50%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "30 24% 86%",
      "--sidebar-accent-foreground": "24 7% 19%",
      "--sidebar-border": "27 22% 82%",
      "--sidebar-ring": "24 16% 50%",
      
      // Charts (Earthy Tones)
      "--chart-1": "24 16% 50%",
      "--chart-2": "30 24% 60%",
      "--chart-3": "100 20% 50%",
      "--chart-4": "40 30% 60%",
      "--chart-5": "20 20% 60%",
    },
  },

  // 2. Palette: Royal Dusk (Dark/Mixed)
  // https://coolors.co/palette/6d455a-293849-ffffff-efece3-ffe6a7
  "royal-dusk": {
    id: "royal-dusk",
    name: "Royal Dusk",
    isDark: true,
    cssVars: {
      "--background": "212 28% 22%",    // #293849 (Deep Blue-Grey)
      "--foreground": "45 27% 91%",     // #EFECE3 (Off-white)
      "--card": "212 28% 18%",          // Slightly darker than BG
      "--card-foreground": "45 27% 91%",
      "--popover": "212 28% 18%",
      "--popover-foreground": "45 27% 91%",
      "--primary": "328 22% 35%",       // #6D455A (Plum)
      "--primary-foreground": "45 27% 91%",
      "--secondary": "37 100% 83%",     // #FFE6A7 (Gold)
      "--secondary-foreground": "212 28% 22%", // Dark text on gold
      "--muted": "212 20% 30%",
      "--muted-foreground": "212 10% 70%",
      "--accent": "328 22% 35%",
      "--accent-foreground": "45 27% 91%",
      "--destructive": "0 62% 30%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "212 20% 35%",        // Subtle border
      "--input": "212 20% 35%",
      "--ring": "37 100% 83%",          // Gold Ring
      
      // Sidebar
      "--sidebar": "212 35% 15%",       // Darker Blue-Grey
      "--sidebar-foreground": "45 27% 91%",
      "--sidebar-primary": "37 100% 83%", // Gold active state
      "--sidebar-primary-foreground": "212 28% 22%",
      "--sidebar-accent": "328 22% 35%",
      "--sidebar-accent-foreground": "45 27% 91%",
      "--sidebar-border": "212 20% 30%",
      "--sidebar-ring": "37 100% 83%",
      
      // Charts
      "--chart-1": "37 100% 83%",
      "--chart-2": "328 22% 50%",
      "--chart-3": "212 28% 60%",
      "--chart-4": "45 27% 91%",
      "--chart-5": "0 0% 100%",
    },
  },

  // 3. Palette: Soft Pastel (Light)
  // https://coolors.co/palette/9381ff-b8b8ff-f8f7ff-ffeedd-ffd8be
  "soft-pastel": {
    id: "soft-pastel",
    name: "Soft Pastel",
    isDark: false,
    cssVars: {
      "--background": "248 100% 98%",   // #F8F7FF (Very light purple tint)
      "--foreground": "249 20% 20%",    // Dark purple/grey text for readablity
      "--card": "0 0% 100%",            // White
      "--card-foreground": "249 20% 20%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "249 20% 20%",
      "--primary": "249 100% 79%",      // #9381FF (Lavender)
      "--primary-foreground": "0 0% 100%",
      "--secondary": "32 100% 93%",     // #FFEEDD (Peach)
      "--secondary-foreground": "249 20% 20%",
      "--muted": "240 50% 96%",
      "--muted-foreground": "249 20% 50%",
      "--accent": "240 100% 86%",       // #B8B8FF
      "--accent-foreground": "249 20% 20%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "240 100% 90%",
      "--input": "240 100% 90%",
      "--ring": "249 100% 79%",
      
      // Sidebar
      "--sidebar": "0 0% 100%",
      "--sidebar-foreground": "249 20% 20%",
      "--sidebar-primary": "249 100% 79%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "32 100% 93%",
      "--sidebar-accent-foreground": "249 20% 20%",
      "--sidebar-border": "240 100% 92%",
      "--sidebar-ring": "249 100% 79%",

       // Charts
      "--chart-1": "249 100% 79%",
      "--chart-2": "24 100% 87%",
      "--chart-3": "240 100% 86%",
      "--chart-4": "32 100% 93%",
      "--chart-5": "280 60% 70%",
    },
  },

  // 4. Palette: Cyber Punk (Dark)
  // https://coolors.co/palette/f72585-7209b7-3a0ca3-4361ee-4cc9f0
  "cyber-punk": {
    id: "cyber-punk",
    name: "Cyber Punk",
    isDark: true,
    cssVars: {
      "--background": "258 87% 20%",    // #3A0CA3 (Deep Indigo - darkened for bg)
      "--foreground": "0 0% 100%",      // White text
      "--card": "258 87% 15%",          // Darker Indigo
      "--card-foreground": "0 0% 100%",
      "--popover": "258 87% 15%",
      "--popover-foreground": "0 0% 100%",
      "--primary": "332 91% 56%",       // #F72585 (Neon Pink)
      "--primary-foreground": "0 0% 100%",
      "--secondary": "278 89% 38%",     // #7209B7 (Violet)
      "--secondary-foreground": "0 0% 100%",
      "--muted": "258 60% 30%",
      "--muted-foreground": "258 30% 80%",
      "--accent": "229 84% 60%",        // #4361EE (Electric Blue)
      "--accent-foreground": "0 0% 100%",
      "--destructive": "332 91% 40%",
      "--destructive-foreground": "0 0% 100%",
      "--border": "278 89% 38%",
      "--input": "278 89% 38%",
      "--ring": "193 88% 62%",          // #4CC9F0 (Cyan)
      
      // Sidebar
      "--sidebar": "258 90% 12%",       // Very dark indigo
      "--sidebar-foreground": "0 0% 100%",
      "--sidebar-primary": "193 88% 62%", // Cyan active
      "--sidebar-primary-foreground": "258 87% 20%", // Dark text on cyan
      "--sidebar-accent": "278 89% 38%",
      "--sidebar-accent-foreground": "0 0% 100%",
      "--sidebar-border": "278 89% 38%",
      "--sidebar-ring": "193 88% 62%",

      // Charts
      "--chart-1": "332 91% 56%",
      "--chart-2": "193 88% 62%",
      "--chart-3": "278 89% 38%",
      "--chart-4": "229 84% 60%",
      "--chart-5": "260 80% 50%",
    },
  },
};

type ThemeContextType = {
  currentTheme: string;
  setTheme: (themeId: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState("organic-calm");

  const applyTheme = (themeId: string) => {
    const theme = themePresets[themeId];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Toggle Tailwind 'dark' class based on the theme definition
    if (theme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme && themePresets[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("organic-calm");
    }
  }, []);

  const setTheme = (themeId: string) => {
    const theme = themePresets[themeId];
    if (!theme) return;
    setCurrentTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem("admin-theme", themeId);
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