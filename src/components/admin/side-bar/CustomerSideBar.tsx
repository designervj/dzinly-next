"use client";

import React from "react";
import {
  Folder,
  Box,
  LayoutGrid,
  BookOpen,
  Wrench,
  Share2,
  Newspaper,
  Users,
  Settings,
  ChevronDown,
} from "lucide-react";

const Logo = () => (
  <div className="h-10 w-10 rounded-lg bg-purple-700 flex items-center justify-center">
    <img
      src="/dzinly-favicon.svg"
      className="w-6 h-6 invert brightness-0"
      alt="Dzinly logo"
    />
  </div>
);

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  permission?: string | string[];
  badge?: string;
};

type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  permission?: string;
};

const navSections: NavSection[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { label: 'Projects', href: '/projects', icon: Folder },
      { label: 'Assets', href: '', icon: Box, badge: '4' },
      { label: 'Boards', href: '', icon: LayoutGrid },
    ],
  },
  {
    id: "materials",
    label: "Materials Library",
    items: [{ label: "Materials Library", href: "/materials", icon: BookOpen }],
  },
  {
    id: "tools",
    label: "Tools & Features",
    items: [
      { label: "Design Tools", href: "/tools", icon: Wrench },
      { label: "Share Project", href: "/share", icon: Share2 },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      { label: "Blogs", href: "/blogs", icon: Newspaper },
      { label: "Affiliate Program", href: "/affiliate", icon: Users },
    ],
  },

   {
    id: "settings",
    label: "Settings",
    items: [
      { label: "User Management", href: "/admin/users", icon: Users },
      { label: "System Settings", href: "/admin/settings", icon: Settings },
    ],
  },

];

const CustomerSideBar = () => {
  // 🔹 dropdown state (per section)
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(
    {
      workspace: true, // default open
    }
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside className="min-h-screen  flex flex-col justify-between">
      {/* Brand */}
      

      {/* User Card */}
     

      {/* Navigation */}
      <nav className="flex-1 space-y-3 px-2 ">
        {navSections.map((section) => {
          const isOpen = openSections[section.id];

          return (
            <div
              key={section.id}
              className="rounded-xl  overflow-hidden"
            >
              {/* Section Header (clickable) */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center px-4 py-3 text-sm font-semibold shadow-sm  text-gray-800 hover:bg-gray-50  bg-white rounded-lg"
              >
                {section.label}
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Section Items */}
              {isOpen && (
                <ul className="px-2 pb-2 space-y-1 mt-2">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="flex items-center bg-gray-100 gap-3 px-3 py-2  rounded-lg text-sm text-gray-600 hover:bg-white transition hover:shadow-sm"
                      >
                        <item.icon size={16} />
                        <span className="flex-1">{item.label}</span>

                        {item.badge && (
                          <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Settings */}
      {/* <div className="px-4 py-4 border-t bg-white">
        <button className="flex items-center gap-2 w-full text-gray-600 hover:text-gray-900 text-sm font-medium">
          <Settings size={18} />
          Settings
        </button>
      </div> */}
    </aside>
  );
};

export default CustomerSideBar;
