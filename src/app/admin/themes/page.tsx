"use client";

import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { themePresets, useAdminTheme } from "../../../components/admin/ThemeProvider";


export default function ThemePage() {
  const { currentTheme, setTheme } = useAdminTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Themes</h1>
        <p className="text-muted-foreground">Instantly apply a cohesive look to your entire workspace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(themePresets).map((theme) => {
          const isActive = currentTheme === theme.id;
          
          // Extract colors for the preview visualization from cssVars
          // We clean up the HSL/RGB string to a valid CSS color for the style prop
          const bg = `hsl(${theme.cssVars["--background"]})`; 
          const sidebar = `hsl(${theme.cssVars["--sidebar"]})`; 
          const primary = `hsl(${theme.cssVars["--primary"]})`;

          return (
            <Card 
              key={theme.id} 
              className={`overflow-hidden transition-all hover:border-primary/50 ${isActive ? 'ring-2 ring-primary border-primary' : ''}`}
            >
              {/* Live Preview Area */}
              <div className="h-32 relative group border-b">
                 <div className="absolute inset-0 flex">
                    {/* Sidebar Preview */}
                    <div className="w-1/3 h-full" style={{ backgroundColor: sidebar }}></div>
                    {/* Content Preview */}
                    <div className="w-2/3 h-full relative" style={{ backgroundColor: bg }}>
                        {/* Fake button preview */}
                        <div className="absolute top-4 left-4 w-16 h-6 rounded" style={{ backgroundColor: primary }}></div>
                    </div>
                 </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{theme.name}</CardTitle>
                  {isActive && <Badge variant="default" className="gap-1"><Check className="w-3 h-3" /> Active</Badge>}
                </div>
                {/* <CardDescription>...</CardDescription> */}
              </CardHeader>

              <CardFooter className="pt-4">
                {isActive ? (
                  <Button variant="outline" className="w-full" disabled>Applied</Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => setTheme(theme.id)}
                  >
                    Apply Theme
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}