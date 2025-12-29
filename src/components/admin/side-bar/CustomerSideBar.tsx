

import React from 'react';
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
} from 'lucide-react';

const Logo = () => (
  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
    <img src="/dzinly-favicon.svg" className="w-6 h-6 invert brightness-0" alt="Dzinly logo" />
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
    id: 'workspace',
    label: 'Workspace',
    items: [
      { label: 'Projects', href: '/admin/projects', icon: Folder },
      { label: 'Assets', href: '', icon: Box, badge: '4' },
      { label: 'Boards', href: '', icon: LayoutGrid },
    ],
  },
  {
    id: 'materials',
    label: 'Materials Library',
    items: [
      { label: 'Materials Library', href: '/materials', icon: BookOpen },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Features',
    items: [
      { label: 'Design Tools', href: '/tools', icon: Wrench },
      { label: 'Share Project', href: '/share', icon: Share2 },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    items: [
      { label: 'Blogs', href: '/blogs', icon: Newspaper },
      { label: 'Affiliate Program', href: '/affiliate', icon: Users },
    ],
  },
];




const CustomerSideBar = () => {
  // Example website selector (replace with real data/logic as needed)
  const [selectedWebsite, setSelectedWebsite] = React.useState('Demo Website');
  const websites = [
    { name: 'Demo Website', value: 'demo' },
    // Add more websites as needed
  ];

  return (
    <aside className="w-[320px] min-h-screen bg-[#fafbfc] border-r flex flex-col justify-between shadow-none">
      <div>
   

        {/* Section cards */}
        <nav className="flex flex-col gap-3 mt-4 px-2">
          {navSections.map(section => (
            <div key={section.id} className="rounded-xl border bg-white shadow-sm mb-1">
              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                {/* Section icon placeholder */}
                <span className="inline-block w-5 h-5 text-muted-foreground">
                  {/* <section.items[0].icon width={20} height={20} /> */}
                </span>
                <span className="text-[15px] font-semibold text-foreground">{section.label.replace(/_/g, ' ')}</span>
              </div>
              <ul className="mt-1">
                {section.items.map(item => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="flex items-center w-full px-6 py-2 text-left rounded-lg transition-colors hover:bg-muted/40 text-[15px]"
                    >
                      <span className="mr-3 text-lg"><item.icon width={20} height={20} /></span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">{item.badge}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      {/* Settings/account area at bottom */}
      <div className="px-4 py-4 border-t bg-white">
        <button className="flex items-center gap-2 w-full text-gray-600 hover:text-black text-sm font-medium">
          <Settings width={20} height={20} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default CustomerSideBar;