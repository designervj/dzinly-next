import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const demopages = [
  {
  slug: "/home",
  title: "home",
  content:
    '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Inter,system-ui,sans-serif;background:#f7f7fb;padding:40px 0;">' +
    // HEADER
    '<div style="max-width:1200px;margin:0 auto;padding:0 20px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#fff;border:1px solid #eee;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.04);">' +
    '<div style="display:flex;align-items:center;gap:10px;">' +
    '<div style="width:36px;height:36px;border-radius:12px;border:1px solid #eee;background:linear-gradient(135deg,#667eea,#764ba2);"></div>' +
    '<div style="line-height:1.1;">' +
    '<div style="font-weight:700;color:#111;font-size:14px;">YourBrand</div>' +
    '<div style="font-size:12px;color:#777;">Company</div>' +
    '</div>' +
    '</div>' +
    '<div style="display:flex;gap:18px;align-items:center;font-size:13px;color:#666;">' +
    '<a href="/home" style="color:#111;text-decoration:none;font-weight:600;">Home</a>' +
    '<a href="/about" style="color:#666;text-decoration:none;">About</a>' +
    '<a href="/services" style="color:#666;text-decoration:none;">Services</a>' +
    '<a href="/contact" style="color:#666;text-decoration:none;">Contact</a>' +
    '</div>' +
    '<a href="/contact" style="text-decoration:none;background:#111;color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;">Get in touch</a>' +
    '</div>' +
    '</div>' +

    // HERO
    '<div style="max-width:1200px;margin:0 auto;padding:26px 20px 0;">' +
    '<div style="border:1px solid rgba(102,126,234,.18);border-radius:22px;background:linear-gradient(180deg,rgba(102,126,234,.10),rgba(118,75,162,.06) 45%,#fff);padding:36px 26px;box-shadow:0 14px 36px rgba(0,0,0,.05);">' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #eee;border-radius:999px;padding:6px 10px;font-size:12px;color:#555;">' +
    '<span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:#667eea;"></span>Welcome</div>' +
    '<h1 style="font-size:46px;line-height:1.1;font-weight:900;color:#111;margin:16px 0 12px;letter-spacing:-.02em;">Build your next experience with <span style="color:#667eea;">confidence</span>.</h1>' +
    '<p style="font-size:16px;color:#666;line-height:1.85;max-width:860px;margin:0;">Discover amazing experiences and create lasting memories with us. We design modern, reliable solutions that help you grow faster.</p>' +
    '<div style="margin-top:18px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;">' +
    '<a href="/about" style="text-decoration:none;background:#111;color:#fff;padding:12px 16px;border-radius:12px;font-weight:800;font-size:13px;display:inline-flex;align-items:center;gap:8px;">Learn more →</a>' +
    '<a href="/contact" style="text-decoration:none;background:#fff;color:#111;border:1px solid #eee;padding:12px 16px;border-radius:12px;font-weight:800;font-size:13px;">Talk to us</a>' +
    '<span style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;">' +
    '<span style="border:1px solid #eee;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Fast delivery</span>' +
    '<span style="border:1px solid #eee;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Premium UI</span>' +
    '<span style="border:1px solid #eee;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Scalable</span>' +
    '</span>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // STATS
    '<div style="max-width:1200px;margin:0 auto;padding:18px 20px 0;">' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:900;color:#111;">10k+</div><div style="font-size:12px;color:#777;margin-top:4px;">Happy Customers</div></div>' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:900;color:#111;">320+</div><div style="font-size:12px;color:#777;margin-top:4px;">Projects Delivered</div></div>' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:900;color:#111;">98%</div><div style="font-size:12px;color:#777;margin-top:4px;">Satisfaction</div></div>' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:900;color:#111;">24</div><div style="font-size:12px;color:#777;margin-top:4px;">Countries Served</div></div>' +
    '</div>' +
    '</div>' +

    // FEATURE CARDS (Mission/Innovation/Community but premium)
    '<div style="max-width:1200px;margin:0 auto;padding:38px 20px 0;">' +
    '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;">' +
    '<div>' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#f3f4ff;border:1px solid rgba(102,126,234,.18);border-radius:999px;padding:6px 10px;font-size:12px;color:#4b57c6;">What we focus on</div>' +
    '<h2 style="font-size:28px;font-weight:900;color:#111;margin:14px 0 6px;">A clear foundation for growth</h2>' +
    '<p style="color:#777;font-size:13px;line-height:1.7;margin:0;max-width:700px;">Simple principles, consistent delivery, and a team that stays accountable end-to-end.</p>' +
    '</div>' +
    '</div>' +

    '<div style="margin-top:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:20px;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="width:40px;height:40px;border-radius:14px;background:rgba(102,126,234,.12);border:1px solid rgba(102,126,234,.18);margin-bottom:12px;"></div>' +
    '<h3 style="font-size:16px;font-weight:900;color:#111;margin:0 0 8px;">Our Mission</h3>' +
    '<p style="font-size:13px;color:#666;line-height:1.8;margin:0;">To deliver exceptional value and create meaningful connections with our community.</p>' +
    '<div style="margin-top:14px;border-top:1px solid #f0f0f0;padding-top:12px;color:#667eea;font-weight:800;font-size:13px;">Impact-first delivery</div>' +
    '</div>' +

    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:20px;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="width:40px;height:40px;border-radius:14px;background:rgba(118,75,162,.12);border:1px solid rgba(118,75,162,.18);margin-bottom:12px;"></div>' +
    '<h3 style="font-size:16px;font-weight:900;color:#111;margin:0 0 8px;">Innovation</h3>' +
    '<p style="font-size:13px;color:#666;line-height:1.8;margin:0;">Constantly evolving and pushing boundaries to bring you the best solutions.</p>' +
    '<div style="margin-top:14px;border-top:1px solid #f0f0f0;padding-top:12px;color:#764ba2;font-weight:800;font-size:13px;">Ship & iterate</div>' +
    '</div>' +

    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:20px;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="width:40px;height:40px;border-radius:14px;background:rgba(79,172,254,.12);border:1px solid rgba(79,172,254,.18);margin-bottom:12px;"></div>' +
    '<h3 style="font-size:16px;font-weight:900;color:#111;margin:0 0 8px;">Community</h3>' +
    '<p style="font-size:13px;color:#666;line-height:1.8;margin:0;">Building a strong, supportive network that grows together.</p>' +
    '<div style="margin-top:14px;border-top:1px solid #f0f0f0;padding-top:12px;color:#4facfe;font-weight:800;font-size:13px;">People-first</div>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // PROCESS (extra section)
    '<div style="max-width:1200px;margin:0 auto;padding:38px 20px 0;">' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:22px;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#f3f4ff;border:1px solid rgba(102,126,234,.18);border-radius:999px;padding:6px 10px;font-size:12px;color:#4b57c6;">How it works</div>' +
    '<h2 style="font-size:26px;font-weight:900;color:#111;margin:14px 0 6px;">A simple, predictable process</h2>' +
    '<p style="color:#777;font-size:13px;line-height:1.7;margin:0;max-width:760px;">We keep the process clear—so you always know what’s happening and what’s next.</p>' +
    '<div style="margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">' +
    '<div style="border:1px solid #eee;border-radius:16px;padding:16px;background:linear-gradient(180deg,#fff,#fafafa);">' +
    '<div style="font-weight:900;color:#111;">01. Discover</div>' +
    '<div style="margin-top:8px;color:#666;font-size:13px;line-height:1.8;">We understand goals, constraints, and success metrics.</div>' +
    '</div>' +
    '<div style="border:1px solid #eee;border-radius:16px;padding:16px;background:linear-gradient(180deg,#fff,#fafafa);">' +
    '<div style="font-weight:900;color:#111;">02. Design</div>' +
    '<div style="margin-top:8px;color:#666;font-size:13px;line-height:1.8;">We craft clean UI, flows, and content structure.</div>' +
    '</div>' +
    '<div style="border:1px solid #eee;border-radius:16px;padding:16px;background:linear-gradient(180deg,#fff,#fafafa);">' +
    '<div style="font-weight:900;color:#111;">03. Deliver</div>' +
    '<div style="margin-top:8px;color:#666;font-size:13px;line-height:1.8;">We ship fast, test thoroughly, and support long-term.</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // CTA
    '<div style="max-width:1200px;margin:0 auto;padding:38px 20px 0 20px;">' +
    '<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:54px 26px;border-radius:18px;color:#fff;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.10);">' +
    '<h2 style="font-size:34px;margin:0 0 10px;font-weight:900;letter-spacing:-.02em;">Ready to Get Started?</h2>' +
    '<p style="font-size:15px;margin:0 auto 20px;opacity:.95;max-width:680px;line-height:1.8;">Join thousands of satisfied customers today. Let’s create something your users will love.</p>' +
    '<a href="/about" style="display:inline-block;background:#fff;color:#4b57c6;padding:12px 22px;border-radius:12px;font-size:14px;font-weight:800;text-decoration:none;">Learn More</a>' +
    '</div>' +
    '</div>' +

    // FOOTER
    '<div style="max-width:1200px;margin:0 auto;padding:26px 20px 40px;">' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">' +
    '<div style="color:#777;font-size:12px;">© ' +
    new Date().getFullYear() +
    ' YourBrand. All rights reserved.</div>' +
    '<div style="display:flex;gap:14px;font-size:12px;">' +
    '<a href="/privacy" style="color:#666;text-decoration:none;">Privacy</a>' +
    '<a href="/terms" style="color:#666;text-decoration:none;">Terms</a>' +
    '<a href="/contact" style="color:#666;text-decoration:none;">Contact</a>' +
    '</div>' +
    '</div>' +
    '</div>' +

    "</div>",
  status: "draft",
  tenantId: "",
  websiteId: "",
  createdAt: "2025-12-17T12:42:54.588+00:00",
  updatedAt: "2025-12-17T12:42:54.588+00:00",
},

  {
  slug: "/about",
  title: "about",
  content:
    '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Inter,system-ui,sans-serif;background:#f7f7fb;padding:40px 0;">' +
    // HEADER (simple)
    '<div style="max-width:1200px;margin:0 auto;padding:0 20px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#fff;border:1px solid #eee;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.04);">' +
    '<div style="display:flex;align-items:center;gap:10px;">' +
    '<div style="width:36px;height:36px;border-radius:12px;border:1px solid #eee;background:linear-gradient(135deg,#667eea,#764ba2);"></div>' +
    '<div style="line-height:1.1;">' +
    '<div style="font-weight:700;color:#111;font-size:14px;">YourBrand</div>' +
    '<div style="font-size:12px;color:#777;">Company</div>' +
    '</div>' +
    '</div>' +
    '<div style="display:flex;gap:18px;align-items:center;font-size:13px;color:#666;">' +
    '<a href="/" style="color:#666;text-decoration:none;">Home</a>' +
    '<a href="/about" style="color:#111;text-decoration:none;font-weight:600;">About</a>' +
    '<a href="/services" style="color:#666;text-decoration:none;">Services</a>' +
    '<a href="/contact" style="color:#666;text-decoration:none;">Contact</a>' +
    '</div>' +
    '<a href="/contact" style="text-decoration:none;background:#111;color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;">Get in touch</a>' +
    '</div>' +
    '</div>' +

    // HERO
    '<div style="max-width:1200px;margin:0 auto;padding:26px 20px 0;">' +
    '<div style="border:1px solid rgba(102,126,234,.18);border-radius:22px;background:linear-gradient(180deg,rgba(102,126,234,.10),rgba(118,75,162,.06) 45%,#fff);padding:34px 26px;box-shadow:0 14px 36px rgba(0,0,0,.05);">' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #eee;border-radius:999px;padding:6px 10px;font-size:12px;color:#555;">' +
    '<span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:#667eea;"></span>About Us</div>' +
    '<h1 style="font-size:44px;line-height:1.12;font-weight:800;color:#111;margin:16px 0 12px;letter-spacing:-.02em;">We build premium experiences that <span style="color:#667eea;">perform fast</span> and scale.</h1>' +
    '<p style="font-size:16px;color:#666;line-height:1.8;max-width:820px;margin:0;">a We are a passionate team dedicated to creating exceptional experiences and delivering outstanding results for our clients and community.</p>' +
    '<div style="margin-top:18px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;">' +
    '<a href="/contact" style="text-decoration:none;background:#111;color:#fff;padding:12px 16px;border-radius:12px;font-weight:700;font-size:13px;display:inline-flex;align-items:center;gap:8px;">Work with us →</a>' +
    '<a href="/services" style="text-decoration:none;background:#fff;color:#111;border:1px solid #eee;padding:12px 16px;border-radius:12px;font-weight:700;font-size:13px;">Explore services</a>' +
    '<span style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;">' +
    '<span style="border:1px solid #eee;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Trusted delivery</span>' +
    '<span style="border:1px solid #eee;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Quality-first</span>' +
    '<span style="border:1px solid #eee;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Long-term support</span>' +
    '</span>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // STATS
    '<div style="max-width:1200px;margin:0 auto;padding:18px 20px 0;">' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:800;color:#111;">320+</div><div style="font-size:12px;color:#777;margin-top:4px;">Projects Delivered</div></div>' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:800;color:#111;">98%</div><div style="font-size:12px;color:#777;margin-top:4px;">Client Satisfaction</div></div>' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:800;color:#111;">24</div><div style="font-size:12px;color:#777;margin-top:4px;">Countries Served</div></div>' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:800;color:#111;">45+</div><div style="font-size:12px;color:#777;margin-top:4px;">Team Members</div></div>' +
    '</div>' +
    '</div>' +

    // STORY + VALUES
    '<div style="max-width:1200px;margin:0 auto;padding:38px 20px 0;">' +
    '<div style="display:grid;grid-template-columns:1.1fr .9fr;gap:22px;">' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:22px;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#f3f4ff;border:1px solid rgba(102,126,234,.18);border-radius:999px;padding:6px 10px;font-size:12px;color:#4b57c6;">Our Story</div>' +
    '<h2 style="font-size:26px;font-weight:800;color:#111;margin:14px 0 10px;">From a small team to a trusted partner</h2>' +
    '<p style="color:#666;line-height:1.85;margin:0 0 12px;font-size:14px;">Founded in 2020, we started with a simple vision: to make a positive impact in everything we do. What began as a small team with big dreams has grown into a thriving organization.</p>' +
    '<p style="color:#666;line-height:1.85;margin:0;font-size:14px;">Today, we serve customers worldwide, always staying true to our core values of integrity, innovation, and excellence.</p>' +
    '<div style="margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
    '<div style="border:1px solid #eee;border-radius:14px;padding:14px;background:linear-gradient(180deg,#fff,#fafafa);"><div style="font-weight:800;color:#111;font-size:13px;">People-first</div><div style="color:#777;font-size:12px;line-height:1.6;margin-top:6px;">Strong teams build strong products.</div></div>' +
    '<div style="border:1px solid #eee;border-radius:14px;padding:14px;background:linear-gradient(180deg,#fff,#fafafa);"><div style="font-weight:800;color:#111;font-size:13px;">Outcome-driven</div><div style="color:#777;font-size:12px;line-height:1.6;margin-top:6px;">Success measured by results.</div></div>' +
    '</div>' +
    '</div>' +

    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:22px;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#f3f4ff;border:1px solid rgba(102,126,234,.18);border-radius:999px;padding:6px 10px;font-size:12px;color:#4b57c6;">Our Values</div>' +
    '<h2 style="font-size:26px;font-weight:800;color:#111;margin:14px 0 12px;">Principles that guide our work</h2>' +
    '<div style="display:grid;gap:10px;">' +
    '<div style="border:1px solid #eee;border-radius:14px;padding:14px;display:flex;gap:12px;align-items:flex-start;"><div style="width:34px;height:34px;border-radius:12px;background:rgba(102,126,234,.12);border:1px solid rgba(102,126,234,.18);"></div><div><div style="font-weight:800;color:#111;font-size:13px;">Integrity</div><div style="color:#777;font-size:12px;line-height:1.6;margin-top:4px;">We do what’s right, always.</div></div></div>' +
    '<div style="border:1px solid #eee;border-radius:14px;padding:14px;display:flex;gap:12px;align-items:flex-start;"><div style="width:34px;height:34px;border-radius:12px;background:rgba(102,126,234,.12);border:1px solid rgba(102,126,234,.18);"></div><div><div style="font-weight:800;color:#111;font-size:13px;">Excellence</div><div style="color:#777;font-size:12px;line-height:1.6;margin-top:4px;">We strive for the highest quality.</div></div></div>' +
    '<div style="border:1px solid #eee;border-radius:14px;padding:14px;display:flex;gap:12px;align-items:flex-start;"><div style="width:34px;height:34px;border-radius:12px;background:rgba(102,126,234,.12);border:1px solid rgba(102,126,234,.18);"></div><div><div style="font-weight:800;color:#111;font-size:13px;">Innovation</div><div style="color:#777;font-size:12px;line-height:1.6;margin-top:4px;">We embrace change and creativity.</div></div></div>' +
    '<div style="border:1px solid #eee;border-radius:14px;padding:14px;display:flex;gap:12px;align-items:flex-start;"><div style="width:34px;height:34px;border-radius:12px;background:rgba(102,126,234,.12);border:1px solid rgba(102,126,234,.18);"></div><div><div style="font-weight:800;color:#111;font-size:13px;">Collaboration</div><div style="color:#777;font-size:12px;line-height:1.6;margin-top:4px;">We succeed together.</div></div></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // TESTIMONIALS
    '<div style="max-width:1200px;margin:0 auto;padding:38px 20px 0;">' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:22px;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">' +
    '<div>' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#f3f4ff;border:1px solid rgba(102,126,234,.18);border-radius:999px;padding:6px 10px;font-size:12px;color:#4b57c6;">What Clients Say</div>' +
    '<h2 style="font-size:26px;font-weight:800;color:#111;margin:14px 0 6px;">Real feedback from real teams</h2>' +
    '<p style="color:#777;font-size:13px;line-height:1.7;margin:0;">We focus on long-term partnerships, not one-off projects.</p>' +
    '</div>' +
    '</div>' +
    '<div style="margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
    '<div style="border:1px solid #eee;border-radius:16px;padding:16px;background:linear-gradient(180deg,#fff,#fafafa);">' +
    '<div style="color:#666;font-size:13px;line-height:1.8;">“The team delivered faster than expected and the quality was outstanding. Clean UI, great performance, and smooth collaboration.”</div>' +
    '<div style="margin-top:10px;font-weight:800;color:#111;font-size:13px;">Operations Lead <span style="font-weight:600;color:#777;">— E-Commerce Brand</span></div>' +
    '</div>' +
    '<div style="border:1px solid #eee;border-radius:16px;padding:16px;background:linear-gradient(180deg,#fff,#fafafa);">' +
    '<div style="color:#666;font-size:13px;line-height:1.8;">“They understood our requirements quickly and built a polished experience. Support was responsive and professional.”</div>' +
    '<div style="margin-top:10px;font-weight:800;color:#111;font-size:13px;">Founder <span style="font-weight:600;color:#777;">— SaaS Startup</span></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // CTA
    '<div style="max-width:1200px;margin:0 auto;padding:38px 20px 0 20px;">' +
    '<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:54px 26px;border-radius:18px;color:#fff;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.10);">' +
    '<h2 style="font-size:34px;margin:0 0 10px;font-weight:900;letter-spacing:-.02em;">Join Our Journey</h2>' +
    '<p style="font-size:15px;margin:0 auto 20px;opacity:.95;max-width:680px;line-height:1.8;">Be part of something extraordinary. Let’s build a clean, scalable experience your users will love.</p>' +
    '<a href="/contact" style="display:inline-block;background:#fff;color:#4b57c6;padding:12px 22px;border-radius:12px;font-size:14px;font-weight:800;text-decoration:none;">Get in Touch</a>' +
    '</div>' +
    '</div>' +

    // FOOTER
    '<div style="max-width:1200px;margin:0 auto;padding:26px 20px 40px;">' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">' +
    '<div style="color:#777;font-size:12px;">© ' +
    new Date().getFullYear() +
    ' YourBrand. All rights reserved.</div>' +
    '<div style="display:flex;gap:14px;font-size:12px;">' +
    '<a href="/privacy" style="color:#666;text-decoration:none;">Privacy</a>' +
    '<a href="/terms" style="color:#666;text-decoration:none;">Terms</a>' +
    '<a href="/contact" style="color:#666;text-decoration:none;">Contact</a>' +
    '</div>' +
    '</div>' +
    '</div>' +

    "</div>",
  status: "draft",
  tenantId: "",
  websiteId: "",
  createdAt: "2025-12-17T12:42:54.588+00:00",
  updatedAt: "2025-12-17T12:42:54.588+00:00",
},

 {
  slug: "/contact",
  title: "contact",
  content:
    '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Inter,system-ui,sans-serif;background:#f7f7fb;padding:40px 0;">' +

    // HEADER
    '<div style="max-width:1200px;margin:0 auto;padding:0 20px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#fff;border:1px solid #eee;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.04);">' +
    '<div style="display:flex;align-items:center;gap:10px;">' +
    '<div style="width:36px;height:36px;border-radius:12px;border:1px solid #eee;background:linear-gradient(135deg,#667eea,#764ba2);"></div>' +
    '<div style="line-height:1.1;">' +
    '<div style="font-weight:700;color:#111;font-size:14px;">YourBrand</div>' +
    '<div style="font-size:12px;color:#777;">Company</div>' +
    '</div>' +
    '</div>' +
    '<div style="display:flex;gap:18px;align-items:center;font-size:13px;color:#666;">' +
    '<a href="/home" style="color:#666;text-decoration:none;">Home</a>' +
    '<a href="/about" style="color:#666;text-decoration:none;">About</a>' +
    '<a href="/services" style="color:#666;text-decoration:none;">Services</a>' +
    '<a href="/contact" style="color:#111;text-decoration:none;font-weight:600;">Contact</a>' +
    '</div>' +
    '<a href="/contact" style="text-decoration:none;background:#111;color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;">Get in touch</a>' +
    '</div>' +
    '</div>' +

    // HERO
    '<div style="max-width:1200px;margin:0 auto;padding:26px 20px 0;">' +
    '<div style="border:1px solid rgba(102,126,234,.18);border-radius:22px;background:linear-gradient(180deg,rgba(102,126,234,.10),rgba(118,75,162,.06) 45%,#fff);padding:34px 26px;box-shadow:0 14px 36px rgba(0,0,0,.05);">' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #eee;border-radius:999px;padding:6px 10px;font-size:12px;color:#555;">' +
    '<span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:#667eea;"></span>Contact</div>' +
    '<h1 style="font-size:44px;line-height:1.12;font-weight:900;color:#111;margin:16px 0 12px;letter-spacing:-.02em;">Let’s talk about your next project.</h1>' +
    '<p style="font-size:16px;color:#666;line-height:1.85;max-width:860px;margin:0;">We’d love to hear from you. Send a message and we’ll respond as soon as possible. You can also reach us using the details below.</p>' +
    '<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">' +
    '<span style="border:1px solid #eee;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Fast replies</span>' +
    '<span style="border:1px solid #eee;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Clear guidance</span>' +
    '<span style="border:1px solid #eee;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">No spam</span>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // MAIN GRID (Info + Form)
    '<div style="max-width:1200px;margin:0 auto;padding:18px 20px 0;">' +
    '<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:16px;">' +

    // LEFT: Contact Info + Cards
    '<div style="display:grid;gap:12px;align-content:start;">' +

    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:20px;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#f3f4ff;border:1px solid rgba(102,126,234,.18);border-radius:999px;padding:6px 10px;font-size:12px;color:#4b57c6;">Contact Information</div>' +
    '<h2 style="font-size:22px;font-weight:900;color:#111;margin:14px 0 6px;">Reach us directly</h2>' +
    '<p style="margin:0;color:#777;font-size:13px;line-height:1.7;">Choose the method that works best for you.</p>' +

    '<div style="margin-top:14px;display:grid;gap:10px;">' +

    // Email
    '<div style="border:1px solid #eee;border-radius:16px;padding:14px;display:flex;gap:12px;align-items:flex-start;background:linear-gradient(180deg,#fff,#fafafa);">' +
    '<div style="width:40px;height:40px;border-radius:14px;background:rgba(102,126,234,.12);border:1px solid rgba(102,126,234,.18);display:flex;align-items:center;justify-content:center;font-weight:900;color:#4b57c6;">@</div>' +
    '<div style="min-width:0;">' +
    '<div style="font-weight:900;color:#111;font-size:13px;margin-bottom:3px;">Email</div>' +
    '<div style="color:#666;font-size:13px;line-height:1.6;">contact@example.com</div>' +
    '<div style="color:#888;font-size:12px;margin-top:2px;">Best for detailed questions</div>' +
    '</div>' +
    '</div>' +

    // Phone
    '<div style="border:1px solid #eee;border-radius:16px;padding:14px;display:flex;gap:12px;align-items:flex-start;background:linear-gradient(180deg,#fff,#fafafa);">' +
    '<div style="width:40px;height:40px;border-radius:14px;background:rgba(118,75,162,.12);border:1px solid rgba(118,75,162,.18);display:flex;align-items:center;justify-content:center;font-weight:900;color:#764ba2;">☎</div>' +
    '<div style="min-width:0;">' +
    '<div style="font-weight:900;color:#111;font-size:13px;margin-bottom:3px;">Phone</div>' +
    '<div style="color:#666;font-size:13px;line-height:1.6;">+1 (555) 123-4567</div>' +
    '<div style="color:#888;font-size:12px;margin-top:2px;">Mon–Fri, 10am–6pm</div>' +
    '</div>' +
    '</div>' +

    // Address
    '<div style="border:1px solid #eee;border-radius:16px;padding:14px;display:flex;gap:12px;align-items:flex-start;background:linear-gradient(180deg,#fff,#fafafa);">' +
    '<div style="width:40px;height:40px;border-radius:14px;background:rgba(79,172,254,.12);border:1px solid rgba(79,172,254,.18);display:flex;align-items:center;justify-content:center;font-weight:900;color:#2f7ddc;">⌁</div>' +
    '<div style="min-width:0;">' +
    '<div style="font-weight:900;color:#111;font-size:13px;margin-bottom:3px;">Address</div>' +
    '<div style="color:#666;font-size:13px;line-height:1.6;">123 Business Street<br/>San Francisco, CA 94103</div>' +
    '<div style="color:#888;font-size:12px;margin-top:2px;">Visits by appointment</div>' +
    '</div>' +
    '</div>' +

    '</div>' +
    '</div>' +

    // Optional Map Placeholder Card
    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;overflow:hidden;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="padding:18px 20px;border-bottom:1px solid #f0f0f0;">' +
    '<div style="font-weight:900;color:#111;">Find us</div>' +
    '<div style="color:#777;font-size:12px;margin-top:4px;">Replace this block with Google Map iframe if needed.</div>' +
    '</div>' +
    '<div style="height:190px;background:linear-gradient(135deg,rgba(102,126,234,.18),rgba(118,75,162,.12));display:flex;align-items:center;justify-content:center;color:#4b57c6;font-weight:900;">Map Preview</div>' +
    '</div>' +

    '</div>' +

    // RIGHT: Form
    '<div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:22px;box-shadow:0 10px 26px rgba(0,0,0,.04);">' +
    '<div style="display:inline-flex;align-items:center;gap:8px;background:#f3f4ff;border:1px solid rgba(102,126,234,.18);border-radius:999px;padding:6px 10px;font-size:12px;color:#4b57c6;">Send a Message</div>' +
    '<h2 style="font-size:22px;font-weight:900;color:#111;margin:14px 0 6px;">Tell us what you need</h2>' +
    '<p style="margin:0;color:#777;font-size:13px;line-height:1.7;">Fill the form and we’ll get back shortly.</p>' +

    '<div style="margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
    '<div>' +
    '<label style="display:block;color:#111;margin-bottom:8px;font-weight:800;font-size:12px;">Name</label>' +
    '<input type="text" placeholder="Your name" style="width:100%;padding:12px 12px;border:1px solid #e6e6e6;border-radius:12px;font-size:14px;outline:none;background:#fff;" />' +
    '</div>' +
    '<div>' +
    '<label style="display:block;color:#111;margin-bottom:8px;font-weight:800;font-size:12px;">Email</label>' +
    '<input type="email" placeholder="you@company.com" style="width:100%;padding:12px 12px;border:1px solid #e6e6e6;border-radius:12px;font-size:14px;outline:none;background:#fff;" />' +
    '</div>' +
    '</div>' +

    '<div style="margin-top:12px;">' +
    '<label style="display:block;color:#111;margin-bottom:8px;font-weight:800;font-size:12px;">Subject</label>' +
    '<input type="text" placeholder="Project / enquiry subject" style="width:100%;padding:12px 12px;border:1px solid #e6e6e6;border-radius:12px;font-size:14px;outline:none;background:#fff;" />' +
    '</div>' +

    '<div style="margin-top:12px;">' +
    '<label style="display:block;color:#111;margin-bottom:8px;font-weight:800;font-size:12px;">Message</label>' +
    '<textarea placeholder="Write your message..." style="width:100%;padding:12px 12px;border:1px solid #e6e6e6;border-radius:12px;font-size:14px;min-height:140px;resize:vertical;outline:none;background:#fff;"></textarea>' +
    '</div>' +

    '<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">' +
    '<button style="background:#111;color:#fff;padding:13px 16px;border:none;border-radius:12px;font-size:14px;cursor:pointer;width:100%;font-weight:900;">Send Message</button>' +
    '<div style="width:100%;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:10px;">' +
    '<span style="border:1px solid #eee;background:#fafafa;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">No spam</span>' +
    '<span style="border:1px solid #eee;background:#fafafa;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Quick response</span>' +
    '<span style="border:1px solid #eee;background:#fafafa;border-radius:999px;padding:7px 10px;font-size:12px;color:#666;">Clear next steps</span>' +
    '</div>' +
    '</div>' +

    '</div>' +

    '</div>' +
    '</div>' +

    // CTA STRIP
    '<div style="max-width:1200px;margin:0 auto;padding:22px 20px 0;">' +
    '<div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:26px 18px;border-radius:18px;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;box-shadow:0 18px 40px rgba(0,0,0,.10);">' +
    '<div>' +
    '<div style="font-weight:900;font-size:18px;letter-spacing:-.01em;">Prefer a quick call?</div>' +
    '<div style="opacity:.95;font-size:13px;margin-top:4px;line-height:1.6;">Book a 15-minute intro and we’ll share a plan.</div>' +
    '</div>' +
    '<a href="/contact" style="display:inline-block;background:#fff;color:#4b57c6;padding:12px 18px;border-radius:12px;font-size:13px;font-weight:900;text-decoration:none;">Book a call</a>' +
    '</div>' +
    '</div>' +

    // FOOTER
    '<div style="max-width:1200px;margin:0 auto;padding:26px 20px 40px;">' +
    '<div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">' +
    '<div style="color:#777;font-size:12px;">© ' +
    new Date().getFullYear() +
    ' YourBrand. All rights reserved.</div>' +
    '<div style="display:flex;gap:14px;font-size:12px;">' +
    '<a href="/privacy" style="color:#666;text-decoration:none;">Privacy</a>' +
    '<a href="/terms" style="color:#666;text-decoration:none;">Terms</a>' +
    '<a href="/about" style="color:#666;text-decoration:none;">About</a>' +
    '</div>' +
    '</div>' +
    '</div>' +

    "</div>",
  status: "draft",
  tenantId: "",
  websiteId: "",
  createdAt: "2025-12-17T12:42:54.588+00:00",
  updatedAt: "2025-12-17T12:42:54.588+00:00",
},

];

 const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadBase64ToS3(base64: string) {
  const [meta, data] = base64.split(",");
  const mime = meta.match(/:(.*?);/)?.[1];

  if (!mime) throw new Error("Invalid base64 image");

  const buffer = Buffer.from(data, "base64");
  const ext = mime.split("/")[1];
  const key = `products/${randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: mime,
    })
  );

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
