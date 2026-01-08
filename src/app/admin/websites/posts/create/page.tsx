"use client";

import React, { useMemo, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  LayoutGrid,
  Image as ImageIcon,
  Minus,
} from "lucide-react";
import BreadCrumbPage from "@/components/breadCrumb/BreadCrumbPage";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

/* ================= TYPES ================= */
type FooterTemplateKey =
  | "classic"
  | "modern"
  | "minimal"
  | "newsletter"
  | "cvrs_teal"
  | "windfield_white"
  | "urban_yellow";

type FooterLink = {
  id: string;
  label: string;
  href: string;
};

type FooterGroup = {
  id: string;
  title: string;
  links: FooterLink[];
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

/* ================= TEMPLATE LIST ================= */
const FOOTER_TEMPLATES: Record<
  FooterTemplateKey,
  { name: string; desc: string; needsNewsletter?: boolean }
> = {
  classic: {
    name: "Classic Dark (4 Column)",
    desc: "Simple dark footer + columns.",
  },
  modern: {
    name: "Modern Split",
    desc: "Brand wide left, columns right.",
  },
  minimal: {
    name: "Minimal Centered",
    desc: "Centered text + compact links.",
  },
  newsletter: {
    name: "Newsletter CTA",
    desc: "Top CTA strip + columns",
    needsNewsletter: true,
  },
  cvrs_teal: {
    name: "CVRS Teal (Like Image #1)",
    desc: "Teal gradient + 4 columns + right contact",
  },
  windfield_white: {
    name: "Windfield White (Like Image #2)",
    desc: "White footer + columns + newsletter form",
    needsNewsletter: true,
  },
  urban_yellow: {
    name: "Urban Yellow (Like Image #3)",
    desc: "Big brand left + menu + newsletter card",
    needsNewsletter: true,
  },
};

/* ================= DEFAULT DATA ================= */
const DEFAULT_GROUPS: FooterGroup[] = [
  {
    id: uid(),
    title: "About Us",
    links: [
      { id: uid(), label: "Home", href: "/" },
      { id: uid(), label: "About", href: "/about" },
      { id: uid(), label: "Team", href: "/team" },
      { id: uid(), label: "Contact", href: "/contact" },
    ],
  },
  {
    id: uid(),
    title: "Resources",
    links: [
      { id: uid(), label: "Blog", href: "/blog" },
      { id: uid(), label: "Docs", href: "/docs" },
      { id: uid(), label: "Guides", href: "/guides" },
      { id: uid(), label: "Support", href: "/support" },
    ],
  },
  {
    id: uid(),
    title: "Information",
    links: [
      { id: uid(), label: "Privacy Policy", href: "/privacy" },
      { id: uid(), label: "Cookie Policy", href: "/cookies" },
      { id: uid(), label: "Terms", href: "/terms" },
      { id: uid(), label: "Accessibility", href: "/accessibility" },
    ],
  },
];

export default function Page() {
  /* ================= STATES ================= */
  const [templateKey, setTemplateKey] = useState<FooterTemplateKey>("classic");

  // Branding
  const [brand, setBrand] = useState("AdminCMS");
  const [brandUrl, setBrandUrl] = useState("https://admincms.com");
  const [logoUrl, setLogoUrl] = useState(""); // optional logo image url
  const [about, setAbout] = useState(
    "A modern CMS platform to manage content with clean UI."
  );

  // Groups
  const [groups, setGroups] = useState<FooterGroup[]>(DEFAULT_GROUPS);

  // Contact
  const [address, setAddress] = useState("Jaipur, Rajasthan, India");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("support@admincms.com");

  // Social toggles
  const [showFacebook, setShowFacebook] = useState(true);
  const [showTwitter, setShowTwitter] = useState(true);
  const [showInstagram, setShowInstagram] = useState(true);
  const [showLinkedin, setShowLinkedin] = useState(true);

  // Newsletter
  const [newsletterTitle, setNewsletterTitle] = useState(
    "Be part of our journey"
  );
  const [newsletterDesc, setNewsletterDesc] = useState(
    "Get updates, tips and announcements in your inbox."
  );
  const [newsletterButton, setNewsletterButton] = useState("Subscribe");

  const tmpl = useMemo(() => FOOTER_TEMPLATES[templateKey], [templateKey]);

  /* ================= GROUP EDIT HELPERS ================= */
  const addGroup = () => {
    setGroups((prev) => [
      ...prev,
      { id: uid(), title: "New Group", links: [{ id: uid(), label: "New Link", href: "#" }] },
    ]);
  };

  const removeGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const updateGroupTitle = (groupId: string, value: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, title: value } : g))
    );
  };

  const addLinkToGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              links: [...g.links, { id: uid(), label: "New Link", href: "#" }],
            }
          : g
      )
    );
  };

  const removeLinkFromGroup = (groupId: string, linkId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, links: g.links.filter((l) => l.id !== linkId) }
          : g
      )
    );
  };

  const updateLink = (
    groupId: string,
    linkId: string,
    patch: Partial<FooterLink>
  ) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          links: g.links.map((l) => (l.id === linkId ? { ...l, ...patch } : l)),
        };
      })
    );
  };

  /* ================= PREVIEW HELPERS ================= */
  const SocialIcons = ({ darkHover = true }: { darkHover?: boolean }) => (
    <div className="flex gap-4">
      {showFacebook && (
        <Facebook
          className={`h-5 w-5 cursor-pointer ${
            darkHover ? "hover:text-white" : "hover:text-slate-900"
          }`}
        />
      )}
      {showTwitter && (
        <Twitter
          className={`h-5 w-5 cursor-pointer ${
            darkHover ? "hover:text-white" : "hover:text-slate-900"
          }`}
        />
      )}
      {showInstagram && (
        <Instagram
          className={`h-5 w-5 cursor-pointer ${
            darkHover ? "hover:text-white" : "hover:text-slate-900"
          }`}
        />
      )}
      {showLinkedin && (
        <Linkedin
          className={`h-5 w-5 cursor-pointer ${
            darkHover ? "hover:text-white" : "hover:text-slate-900"
          }`}
        />
      )}
    </div>
  );

  const BrandBlock = ({
    titleClass,
    textClass,
    showUrl = false,
    compact = false,
    tealLine = false,
  }: {
    titleClass: string;
    textClass: string;
    showUrl?: boolean;
    compact?: boolean;
    tealLine?: boolean;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="logo"
            className={compact ? "h-10 w-10 rounded-md object-cover" : "h-14 w-14 rounded-md object-cover"}
          />
        ) : (
          <div
            className={
              compact
                ? "h-10 w-10 rounded-md bg-black text-white flex items-center justify-center font-bold"
                : "h-14 w-14 rounded-md bg-black text-white flex items-center justify-center font-bold text-xl"
            }
          >
            {brand.charAt(0)}
          </div>
        )}

        <div>
          <div className={titleClass}>{brand}</div>
          {showUrl && (
            <div className={textClass}>{brandUrl}</div>
          )}
        </div>
      </div>

      {tealLine && <div className="h-px w-full bg-white/20" />}

      <div className={textClass}>{about}</div>
    </div>
  );

  const GroupCols = ({
    take = 3,
    titleClass,
    linkClass,
  }: {
    take?: number;
    titleClass: string;
    linkClass: string;
  }) => {
    const show = groups.slice(0, take);
    return (
      <>
        {show.map((g) => (
          <div key={g.id}>
            <div className={titleClass}>{g.title}</div>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.id} className={linkClass}>
                  {l.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );
  };

  const ContactBlock = ({
    titleClass,
    textClass,
    iconClass,
  }: {
    titleClass: string;
    textClass: string;
    iconClass: string;
  }) => (
    <div>
      <div className={titleClass}>Help</div>
      <ul className={`mt-3 space-y-3 ${textClass}`}>
        <li className="flex gap-2 items-start">
          <Phone className={`h-4 w-4 mt-0.5 ${iconClass}`} /> {phone}
        </li>
        <li className="flex gap-2 items-start">
          <Mail className={`h-4 w-4 mt-0.5 ${iconClass}`} /> {email}
        </li>
        <li className="flex gap-2 items-start">
          <MapPin className={`h-4 w-4 mt-0.5 ${iconClass}`} /> {address}
        </li>
      </ul>
    </div>
  );

  const NewsletterForm = ({
    inputClass,
    buttonClass,
    wrapClass,
  }: {
    inputClass: string;
    buttonClass: string;
    wrapClass?: string;
  }) => (
    <div className={wrapClass ?? ""}>
      <div className="font-semibold">{newsletterTitle}</div>
      <div className="text-sm text-muted-foreground mt-1">{newsletterDesc}</div>
      <div className="mt-4 flex gap-2">
        <input className={inputClass} placeholder="Email" />
        <button className={buttonClass}>{newsletterButton}</button>
      </div>
    </div>
  );

  /* ================= FOOTER PREVIEW SWITCH ================= */
  const FooterPreview = () => {
    // 1) Classic Dark
    if (templateKey === "classic") {
      return (
        <footer className="bg-slate-900 text-gray-300">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
            <BrandBlock
              titleClass="text-2xl font-bold text-white"
              textClass="text-sm text-gray-400"
            />

            <GroupCols
              take={2}
              titleClass="text-lg font-semibold text-white"
              linkClass="text-sm hover:text-white cursor-pointer"
            />

            <ContactBlock
              titleClass="text-lg font-semibold text-white"
              textClass="text-sm text-gray-300"
              iconClass="text-gray-300"
            />

            <div>
              <div className="text-lg font-semibold text-white">Follow Us</div>
              <div className="mt-3 text-gray-300">
                <SocialIcons darkHover />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 text-center py-4 text-sm text-gray-400">
            © 2026 {brand}. All rights reserved.
          </div>
        </footer>
      );
    }

    // 2) Modern Split
    if (templateKey === "modern") {
      return (
        <footer className="bg-zinc-950 text-zinc-200">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <BrandBlock
                titleClass="text-3xl font-semibold text-white"
                textClass="text-sm text-zinc-400 leading-relaxed"
              />
            </div>

            <div className="lg:col-span-3">
              <GroupCols
                take={1}
                titleClass="text-base font-semibold text-white"
                linkClass="text-sm text-zinc-300 hover:text-white cursor-pointer"
              />
            </div>

            <div className="lg:col-span-4">
              <ContactBlock
                titleClass="text-base font-semibold text-white"
                textClass="text-sm text-zinc-300"
                iconClass="text-zinc-300"
              />
              <div className="mt-4 text-zinc-300">
                <SocialIcons darkHover />
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 text-center py-4 text-sm text-zinc-500">
            © 2026 {brand}. All rights reserved.
          </div>
        </footer>
      );
    }

    // 3) Minimal Centered
    if (templateKey === "minimal") {
      const flatLinks = groups.flatMap((g) => g.links).slice(0, 8);
      return (
        <footer className="bg-white text-slate-800 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-6">
            <div className="text-xl font-bold">{brand}</div>
            <div className="text-sm text-slate-500 text-center max-w-xl">
              {about}
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {flatLinks.map((l) => (
                <span
                  key={l.id}
                  className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {l.label}
                </span>
              ))}
            </div>

            <div className="text-slate-700">
              <SocialIcons darkHover={false} />
            </div>
          </div>

          <div className="border-t border-slate-200 text-center py-4 text-sm text-slate-500">
            © 2026 {brand}. All rights reserved.
          </div>
        </footer>
      );
    }

    // 4) Newsletter CTA (Top strip)
    if (templateKey === "newsletter") {
      return (
        <footer className="bg-slate-950 text-slate-200">
          <div className="max-w-7xl mx-auto px-6 pt-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-white">{newsletterTitle}</div>
                <div className="text-sm text-slate-400 mt-1">{newsletterDesc}</div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  className="w-full md:w-64 rounded-xl px-3 py-2 bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 outline-none"
                  placeholder="Enter your email"
                />
                <button className="rounded-xl px-4 py-2 bg-white text-slate-900 text-sm font-semibold">
                  {newsletterButton}
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
            <BrandBlock
              titleClass="text-2xl font-semibold text-white"
              textClass="text-sm text-slate-400"
            />
            <GroupCols
              take={2}
              titleClass="text-base font-semibold text-white"
              linkClass="text-sm text-slate-300 hover:text-white cursor-pointer"
            />
            <ContactBlock
              titleClass="text-base font-semibold text-white"
              textClass="text-sm text-slate-300"
              iconClass="text-slate-300"
            />
            <div>
              <div className="text-base font-semibold text-white">Follow Us</div>
              <div className="mt-3 text-slate-300">
                <SocialIcons darkHover />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 text-center py-4 text-sm text-slate-500">
            © 2026 {brand}. All rights reserved.
          </div>
        </footer>
      );
    }

    // 5) CVRS Teal (Like Image #1)
    if (templateKey === "cvrs_teal") {
      return (
        <footer className="text-white bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <BrandBlock
                titleClass="text-2xl font-semibold"
                textClass="text-sm text-white/70"
                showUrl
                tealLine
              />

              {/* (optional) font size buttons preview (like screenshot) */}
              <div className="mt-6">
                <div className="text-sm text-white/80 mb-3">Adjust the font size</div>
                <div className="flex items-center gap-4">
                  <button className="text-sky-300 font-bold text-xl">A</button>
                  <button className="text-sky-300 font-bold text-2xl">A</button>
                  <button className="text-sky-300 font-bold text-3xl">A</button>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-10">
              <GroupCols
                take={3}
                titleClass="text-sm font-bold tracking-widest uppercase"
                linkClass="text-sm text-white/80 hover:text-white cursor-pointer"
              />
            </div>
          </div>

          <div className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-white/70">
              <div>© 2026 {brand}. Made with ♥</div>
              <div className="flex gap-3">
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer">Cookie Policy</span>
              </div>
            </div>
          </div>
        </footer>
      );
    }

    // 6) Windfield White (Like Image #2)
    if (templateKey === "windfield_white") {
      const g1 = groups[0];
      const g2 = groups[1];

      return (
        <footer className="bg-white text-slate-800 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left contact/brand */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="logo" className="h-12 w-12 object-cover rounded-md" />
                ) : (
                  <div className="h-12 w-12 bg-slate-900 text-white rounded-md flex items-center justify-center font-bold">
                    {brand.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-lg">{brand}</div>
                  <div className="text-xs text-slate-500">{brandUrl}</div>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3 items-start">
                  <Phone className="h-4 w-4 mt-0.5 text-slate-500" /> {phone}
                </li>
                <li className="flex gap-3 items-start">
                  <Mail className="h-4 w-4 mt-0.5 text-slate-500" /> {email}
                </li>
                <li className="flex gap-3 items-start">
                  <MapPin className="h-4 w-4 mt-0.5 text-slate-500" /> {address}
                </li>
              </ul>

              <div className="text-slate-700">
                <SocialIcons darkHover={false} />
              </div>
            </div>

            {/* Middle columns */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <div className="text-lg font-semibold text-green-800 tracking-wide">
                  {g1?.title ?? "Services"}
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {(g1?.links ?? []).slice(0, 6).map((l) => (
                    <li key={l.id} className="hover:text-slate-900 cursor-pointer">
                      {l.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-lg font-semibold text-green-800 tracking-wide">
                  {g2?.title ?? "Our Properties"}
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {(g2?.links ?? []).slice(0, 6).map((l) => (
                    <li key={l.id} className="hover:text-slate-900 cursor-pointer">
                      {l.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right newsletter */}
            <div className="lg:col-span-3">
              <div className="text-lg font-semibold text-green-800 tracking-wide">
                Stay Connected
              </div>
              <div className="mt-4 space-y-3">
                <input
                  className="w-full border border-green-700/40 rounded-md px-3 py-2 text-sm outline-none"
                  placeholder="Email"
                />
                <button className="w-full rounded-md bg-green-800 text-white py-3 text-sm font-semibold">
                  {newsletterButton.toUpperCase()}
                </button>
              </div>
              <div className="mt-4 text-xs text-slate-500">
                {newsletterDesc}
              </div>
            </div>
          </div>

          <div className="bg-black text-white/80 text-center py-3 text-sm">
            © 2026 {brand}. All rights reserved. |{" "}
            <span className="underline cursor-pointer">Accessibility Statement</span>
          </div>
        </footer>
      );
    }

    // 7) Urban Yellow (Like Image #3)
    if (templateKey === "urban_yellow") {
      const menuLinks = groups[0]?.links ?? [];
      return (
        <footer className="bg-yellow-400 text-slate-900">
          <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left big brand/logo */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="logo"
                    className="h-24 w-24 rounded-full object-cover border-4 border-purple-700"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-purple-700 text-white flex items-center justify-center font-extrabold text-3xl">
                    {brand.slice(0, 1)}
                  </div>
                )}
                <div>
                  <div className="text-2xl font-extrabold leading-tight">{brand}</div>
                  <div className="text-sm text-slate-800/70">{brandUrl}</div>
                </div>
              </div>

              <div className="text-sm text-slate-800/80 max-w-sm">{about}</div>
            </div>

            {/* Center menu */}
            <div className="lg:col-span-3">
              <div className="text-xl font-bold text-purple-700">Menu</div>
              <ul className="mt-4 space-y-3 text-base font-semibold text-purple-700">
                {menuLinks.slice(0, 6).map((l) => (
                  <li key={l.id} className="hover:opacity-80 cursor-pointer">
                    {l.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-md p-8 max-w-xl mx-auto">
                <div className="text-xl font-bold">{newsletterTitle.toUpperCase()}</div>
                <div className="text-sm text-slate-600 mt-2">{newsletterDesc}</div>

                <div className="mt-6 space-y-4">
                  <input
                    className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm outline-none"
                    placeholder="Email"
                  />
                  <button className="w-full rounded-md bg-purple-700 text-white py-3 text-sm font-semibold">
                    {newsletterButton.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-5 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <div>Copyright © {brand} | Privacy Policy</div>
            <div className="text-purple-700">
              <SocialIcons darkHover={false} />
            </div>
          </div>
        </footer>
      );
    }

    return null;
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="mb-6">
        <BreadCrumbPage />
      </div>

      {/* ================= EDITOR PANEL ================= */}
      <div className="px-6 pb-6">
        <Card className="rounded-2xl p-5 bg-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Footer Editor</h2>
              <p className="text-sm text-muted-foreground">
                Template select karo, content edit karo — live preview neeche.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              <Select
                value={templateKey}
                onValueChange={(v) => setTemplateKey(v as FooterTemplateKey)}
              >
                <SelectTrigger className="w-[300px] rounded-xl">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FOOTER_TEMPLATES).map(([key, t]) => (
                    <SelectItem key={key} value={key}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="rounded-full">
                {FOOTER_TEMPLATES[templateKey].desc}
              </Badge>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Form grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT: Brand + Newsletter */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Brand Website URL</Label>
                <Input
                  value={brandUrl}
                  onChange={(e) => setBrandUrl(e.target.value)}
                  className="rounded-xl"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Logo Image URL (optional)
                </Label>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="rounded-xl"
                  placeholder="https://.../logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label>About Text</Label>
                <Textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="rounded-xl"
                  rows={4}
                />
              </div>

              {(tmpl.needsNewsletter ?? false) && (
                <div className="rounded-2xl border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Newsletter / CTA</p>
                    <Badge variant="outline" className="rounded-full">
                      template
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>Newsletter Title</Label>
                    <Input
                      value={newsletterTitle}
                      onChange={(e) => setNewsletterTitle(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Newsletter Description</Label>
                    <Textarea
                      value={newsletterDesc}
                      onChange={(e) => setNewsletterDesc(e.target.value)}
                      className="rounded-xl"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      value={newsletterButton}
                      onChange={(e) => setNewsletterButton(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Contact + Groups */}
            <div className="space-y-5">
              {/* Contact */}
              <div className="rounded-2xl border p-4">
                <h3 className="font-semibold mb-3">Contact Info</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Groups / Links */}
              <div className="rounded-2xl border p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Footer Link Groups</h3>
                    <p className="text-sm text-muted-foreground">
                      Columns banane ke liye groups use karo (About/Resources/etc.)
                    </p>
                  </div>
                  <Button onClick={addGroup} className="rounded-xl">
                    <Plus className="h-4 w-4 mr-2" /> Add Group
                  </Button>
                </div>

                <div className="space-y-4">
                  {groups.map((g) => (
                    <div key={g.id} className="rounded-xl border bg-muted/20 p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          value={g.title}
                          onChange={(e) => updateGroupTitle(g.id, e.target.value)}
                          className="rounded-xl"
                          placeholder="Group title"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeGroup(g.id)}
                          title="Remove group"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {g.links.map((l) => (
                          <div key={l.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                            <Input
                              value={l.label}
                              onChange={(e) => updateLink(g.id, l.id, { label: e.target.value })}
                              className="rounded-xl"
                              placeholder="Link label"
                            />
                            <Input
                              value={l.href}
                              onChange={(e) => updateLink(g.id, l.id, { href: e.target.value })}
                              className="rounded-xl"
                              placeholder="/path or https://..."
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeLinkFromGroup(g.id, l.id)}
                              title="Remove link"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="rounded-xl"
                          onClick={() => addLinkToGroup(g.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Link
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="rounded-xl"
                          onClick={() => {
                            // quick: remove last link
                            const last = g.links[g.links.length - 1];
                            if (!last) return;
                            removeLinkFromGroup(g.id, last.id);
                          }}
                        >
                          <Minus className="h-4 w-4 mr-2" /> Remove Last
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Toggles */}
              <div className="rounded-2xl border p-4">
                <h3 className="font-semibold mb-3">Social Icons</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showFacebook}
                      onChange={() => setShowFacebook(!showFacebook)}
                    />
                    Facebook
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showTwitter}
                      onChange={() => setShowTwitter(!showTwitter)}
                    />
                    Twitter
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showInstagram}
                      onChange={() => setShowInstagram(!showInstagram)}
                    />
                    Instagram
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showLinkedin}
                      onChange={() => setShowLinkedin(!showLinkedin)}
                    />
                    Linkedin
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ================= LIVE PREVIEW ================= */}
      <div className="mt-auto">
        <FooterPreview />
      </div>
    </div>
  );
}
