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
    content: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,system-ui,sans-serif;background:#f7f7fb;padding:40px 0;">

  <!-- HEADER -->
  <div style="max-width:1200px;margin:0 auto;padding:0 20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#fff;border:1px solid #eee;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.04);">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;border-radius:12px;border:1px solid #eee;background:linear-gradient(135deg,#667eea,#764ba2);"></div>
        <div style="line-height:1.1;">
          <div style="font-weight:700;color:#111;font-size:14px;">YourBrand</div>
          <div style="font-size:12px;color:#777;">Company</div>
        </div>
      </div>

      <div style="display:flex;gap:18px;align-items:center;font-size:13px;color:#666;">
        <a href="/home" style="color:#111;text-decoration:none;font-weight:600;">Home</a>
        <a href="/about" style="color:#666;text-decoration:none;">About</a>
        <a href="/services" style="color:#666;text-decoration:none;">Services</a>
        <a href="/contact" style="color:#666;text-decoration:none;">Contact</a>
      </div>

      <a href="/contact" style="text-decoration:none;background:#111;color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;">
        Get in touch
      </a>
    </div>
  </div>

  <!-- HERO -->
  <div style="max-width:1200px;margin:0 auto;padding:26px 20px 0;">
    <div style="border:1px solid rgba(102,126,234,.18);border-radius:22px;background:linear-gradient(180deg,rgba(102,126,234,.10),rgba(118,75,162,.06) 45%,#fff);padding:36px 26px;box-shadow:0 14px 36px rgba(0,0,0,.05);">
      <div style="display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #eee;border-radius:999px;padding:6px 10px;font-size:12px;color:#555;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:#667eea;"></span>
        Welcome
      </div>

      <h1 style="font-size:46px;line-height:1.1;font-weight:900;color:#111;margin:16px 0 12px;letter-spacing:-.02em;">
        Build your next experience with <span style="color:#667eea;">confidence</span>.
      </h1>

      <p style="font-size:16px;color:#666;line-height:1.85;max-width:860px;margin:0;">
        Discover amazing experiences and create lasting memories with us. We design modern, reliable solutions that help you grow faster.
      </p>
    </div>
  </div>

  <!-- CTA -->
  <div style="max-width:1200px;margin:0 auto;padding:38px 20px;">
    <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:54px 26px;border-radius:18px;color:#fff;text-align:center;">
      <h2 style="font-size:34px;margin:0 0 10px;font-weight:900;">
        Ready to Get Started?
      </h2>
      <p style="font-size:15px;margin:0 auto 20px;max-width:680px;">
        Join thousands of satisfied customers today.
      </p>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="max-width:1200px;margin:0 auto;padding:26px 20px 40px;">
    <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;display:flex;justify-content:space-between;">
      <div style="color:#777;font-size:12px;">
        © ${new Date().getFullYear()} YourBrand. All rights reserved.
      </div>
      <div style="display:flex;gap:14px;font-size:12px;">
        <a href="/privacy" style="color:#666;text-decoration:none;">Privacy</a>
        <a href="/terms" style="color:#666;text-decoration:none;">Terms</a>
        <a href="/contact" style="color:#666;text-decoration:none;">Contact</a>
      </div>
    </div>
  </div>

</div>
`,
    status: "draft",
    tenantId: "",
    websiteId: "",
    createdAt: "2025-12-17T12:42:54.588+00:00",
    updatedAt: "2025-12-17T12:42:54.588+00:00",
  },

  {
    slug: "/about",
    title: "about",
    content: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,system-ui,sans-serif;background:#f7f7fb;padding:40px 0;">

  <!-- HEADER -->
  <div style="max-width:1200px;margin:0 auto;padding:0 20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#fff;border:1px solid #eee;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.04);">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;border-radius:12px;border:1px solid #eee;background:linear-gradient(135deg,#667eea,#764ba2);"></div>
        <div style="line-height:1.1;">
          <div style="font-weight:700;color:#111;font-size:14px;">YourBrand</div>
          <div style="font-size:12px;color:#777;">Company</div>
        </div>
      </div>

      <div style="display:flex;gap:18px;align-items:center;font-size:13px;color:#666;">
        <a href="/" style="color:#666;text-decoration:none;">Home</a>
        <a href="/about" style="color:#111;text-decoration:none;font-weight:600;">About</a>
        <a href="/services" style="color:#666;text-decoration:none;">Services</a>
        <a href="/contact" style="color:#666;text-decoration:none;">Contact</a>
      </div>

      <a href="/contact" style="text-decoration:none;background:#111;color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;">
        Get in touch
      </a>
    </div>
  </div>

  <!-- HERO -->
  <div style="max-width:1200px;margin:0 auto;padding:26px 20px 0;">
    <div style="border:1px solid rgba(102,126,234,.18);border-radius:22px;background:linear-gradient(180deg,rgba(102,126,234,.10),rgba(118,75,162,.06) 45%,#fff);padding:34px 26px;box-shadow:0 14px 36px rgba(0,0,0,.05);">
      <div style="display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #eee;border-radius:999px;padding:6px 10px;font-size:12px;color:#555;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:99px;background:#667eea;"></span>
        About Us
      </div>

      <h1 style="font-size:44px;line-height:1.12;font-weight:800;color:#111;margin:16px 0 12px;letter-spacing:-.02em;">
        We build premium experiences that <span style="color:#667eea;">perform fast</span> and scale.
      </h1>

      <p style="font-size:16px;color:#666;line-height:1.8;max-width:820px;margin:0;">
        We are a passionate team dedicated to creating exceptional experiences and delivering outstanding results for our clients and community.
      </p>
    </div>
  </div>

  <!-- STATS -->
  <div style="max-width:1200px;margin:0 auto;padding:18px 20px 0;">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
      <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:800;color:#111;">320+</div><div style="font-size:12px;color:#777;margin-top:4px;">Projects Delivered</div></div>
      <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:800;color:#111;">98%</div><div style="font-size:12px;color:#777;margin-top:4px;">Client Satisfaction</div></div>
      <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:800;color:#111;">24</div><div style="font-size:12px;color:#777;margin-top:4px;">Countries Served</div></div>
      <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;"><div style="font-size:26px;font-weight:800;color:#111;">45+</div><div style="font-size:12px;color:#777;margin-top:4px;">Team Members</div></div>
    </div>
  </div>

  <!-- CTA -->
  <div style="max-width:1200px;margin:0 auto;padding:38px 20px;">
    <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:54px 26px;border-radius:18px;color:#fff;text-align:center;">
      <h2 style="font-size:34px;margin:0 0 10px;font-weight:900;">Join Our Journey</h2>
      <p style="font-size:15px;margin:0 auto 20px;max-width:680px;">Be part of something extraordinary.</p>
      <a href="/contact" style="display:inline-block;background:#fff;color:#4b57c6;padding:12px 22px;border-radius:12px;font-size:14px;font-weight:800;text-decoration:none;">
        Get in Touch
      </a>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="max-width:1200px;margin:0 auto;padding:26px 20px 40px;">
    <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px 16px;display:flex;justify-content:space-between;">
      <div style="color:#777;font-size:12px;">
        © ${new Date().getFullYear()} YourBrand. All rights reserved.
      </div>
      <div style="display:flex;gap:14px;font-size:12px;">
        <a href="/privacy" style="color:#666;text-decoration:none;">Privacy</a>
        <a href="/terms" style="color:#666;text-decoration:none;">Terms</a>
        <a href="/contact" style="color:#666;text-decoration:none;">Contact</a>
      </div>
    </div>
  </div>

</div>
`,
    status: "draft",
    tenantId: "",
    websiteId: "",
    createdAt: "2025-12-17T12:42:54.588+00:00",
    updatedAt: "2025-12-17T12:42:54.588+00:00",
  },

  {
    slug: "/contact",
    title: "contact",
    content: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,system-ui,sans-serif;background:#f7f7fb;padding:40px 0;">

  <!-- HEADER -->
  <div style="max-width:1200px;margin:0 auto;padding:0 20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#fff;border:1px solid #eee;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.04);">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;border-radius:12px;border:1px solid #eee;background:linear-gradient(135deg,#667eea,#764ba2);"></div>
        <div>
          <div style="font-weight:700;color:#111;font-size:14px;">YourBrand</div>
          <div style="font-size:12px;color:#777;">Company</div>
        </div>
      </div>

      <div style="display:flex;gap:18px;font-size:13px;">
        <a href="/home" style="color:#666;text-decoration:none;">Home</a>
        <a href="/about" style="color:#666;text-decoration:none;">About</a>
        <a href="/services" style="color:#666;text-decoration:none;">Services</a>
        <a href="/contact" style="color:#111;text-decoration:none;font-weight:600;">Contact</a>
      </div>

      <a href="/contact" style="background:#111;color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:600;text-decoration:none;">
        Get in touch
      </a>
    </div>
  </div>

  <!-- HERO -->
  <div style="max-width:1200px;margin:0 auto;padding:26px 20px 0;">
    <div style="border:1px solid rgba(102,126,234,.18);border-radius:22px;background:linear-gradient(180deg,rgba(102,126,234,.10),rgba(118,75,162,.06) 45%,#fff);padding:34px 26px;box-shadow:0 14px 36px rgba(0,0,0,.05);">
      <div style="display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #eee;border-radius:999px;padding:6px 10px;font-size:12px;color:#555;">
        <span style="width:8px;height:8px;border-radius:99px;background:#667eea;display:inline-block;"></span>
        Contact
      </div>

      <h1 style="font-size:44px;font-weight:900;color:#111;margin:16px 0 12px;">
        Let’s talk about your next project.
      </h1>

      <p style="font-size:16px;color:#666;line-height:1.85;max-width:860px;">
        We’d love to hear from you. Send a message and we’ll respond as soon as possible.
      </p>
    </div>
  </div>

  <!-- CONTACT GRID -->
  <div style="max-width:1200px;margin:0 auto;padding:18px 20px;">
    <div style="display:grid;grid-template-columns:1fr 1.05fr;gap:16px;">

      <!-- LEFT -->
      <div style="display:grid;gap:12px;">
        <div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:20px;">
          <h2 style="font-size:22px;font-weight:900;">Contact Information</h2>
          <p style="font-size:13px;color:#777;">Choose the best way to reach us.</p>

          <div style="margin-top:14px;display:grid;gap:10px;">
            <div style="border:1px solid #eee;border-radius:16px;padding:14px;">
              <strong>Email:</strong> contact@example.com
            </div>
            <div style="border:1px solid #eee;border-radius:16px;padding:14px;">
              <strong>Phone:</strong> +1 (555) 123-4567
            </div>
            <div style="border:1px solid #eee;border-radius:16px;padding:14px;">
              <strong>Address:</strong><br/>
              123 Business Street, San Francisco, CA
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT FORM -->
      <div style="background:#fff;border:1px solid #eee;border-radius:18px;padding:22px;">
        <h2 style="font-size:22px;font-weight:900;">Send a Message</h2>

        <input placeholder="Name" style="width:100%;margin-top:12px;padding:12px;border-radius:12px;border:1px solid #e6e6e6;" />
        <input placeholder="Email" style="width:100%;margin-top:12px;padding:12px;border-radius:12px;border:1px solid #e6e6e6;" />
        <input placeholder="Subject" style="width:100%;margin-top:12px;padding:12px;border-radius:12px;border:1px solid #e6e6e6;" />
        <textarea placeholder="Message" style="width:100%;margin-top:12px;padding:12px;border-radius:12px;border:1px solid #e6e6e6;min-height:120px;"></textarea>

        <button style="margin-top:14px;width:100%;background:#111;color:#fff;padding:14px;border-radius:12px;font-weight:900;">
          Send Message
        </button>
      </div>

    </div>
  </div>

  <!-- FOOTER -->
  <div style="max-width:1200px;margin:0 auto;padding:26px 20px 40px;">
    <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:18px;display:flex;justify-content:space-between;">
      <div style="font-size:12px;color:#777;">
        © ${new Date().getFullYear()} YourBrand. All rights reserved.
      </div>
      <div style="font-size:12px;">
        <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a>
      </div>
    </div>
  </div>

</div>
`,
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
