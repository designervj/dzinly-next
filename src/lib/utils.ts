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
      '<div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;"><div style="text-align: center; margin-bottom: 60px;"><h1 style="font-size: 3.5rem; font-weight: 700; color: #1a1a1a; margin-bottom: 20px;">Welcome Home</h1><p style="font-size: 1.25rem; color: #666; max-width: 600px; margin: 0 auto;">Discover amazing experiences and create lasting memories with us.</p></div><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 60px;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 12px; color: white;"><h2 style="font-size: 1.8rem; margin-bottom: 15px;">Our Mission</h2><p style="font-size: 1.1rem; line-height: 1.6;">To deliver exceptional value and create meaningful connections with our community.</p></div><div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px; border-radius: 12px; color: white;"><h2 style="font-size: 1.8rem; margin-bottom: 15px;">Innovation</h2><p style="font-size: 1.1rem; line-height: 1.6;">Constantly evolving and pushing boundaries to bring you the best solutions.</p></div><div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px; border-radius: 12px; color: white;"><h2 style="font-size: 1.8rem; margin-bottom: 15px;">Community</h2><p style="font-size: 1.1rem; line-height: 1.6;">Building a strong, supportive network that grows together.</p></div></div><div style="background: #f8f9fa; padding: 50px 40px; border-radius: 12px; text-align: center;"><h2 style="font-size: 2rem; color: #1a1a1a; margin-bottom: 20px;">Ready to Get Started?</h2><p style="font-size: 1.1rem; color: #666; margin-bottom: 30px;">Join thousands of satisfied customers today</p><button style="background: #667eea; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; transition: transform 0.2s;">Learn More</button></div></div>',
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
      '<div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;"><div style="margin-bottom: 60px;"><h1 style="font-size: 3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 20px;">About Us</h1><p style="font-size: 1.2rem; color: #666; line-height: 1.8; max-width: 800px;">We are a passionate team dedicated to creating exceptional experiences and delivering outstanding results for our clients and community.</p></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 60px;"><div><h2 style="font-size: 2rem; color: #1a1a1a; margin-bottom: 20px;">Our Story</h2><p style="color: #555; line-height: 1.8; margin-bottom: 15px;">Founded in 2020, we started with a simple vision: to make a positive impact in everything we do. What began as a small team with big dreams has grown into a thriving organization.</p><p style="color: #555; line-height: 1.8;">Today, we serve customers worldwide, always staying true to our core values of integrity, innovation, and excellence.</p></div><div><h2 style="font-size: 2rem; color: #1a1a1a; margin-bottom: 20px;">Our Values</h2><ul style="list-style: none; padding: 0;"><li style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #555;"><strong style="color: #667eea;">Integrity:</strong> We do what\'s right, always</li><li style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #555;"><strong style="color: #667eea;">Excellence:</strong> We strive for the highest quality</li><li style="padding: 12px 0; border-bottom: 1px solid #e0e0e0; color: #555;"><strong style="color: #667eea;">Innovation:</strong> We embrace change and creativity</li><li style="padding: 12px 0; color: #555;"><strong style="color: #667eea;">Collaboration:</strong> We succeed together</li></ul></div></div><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 40px; border-radius: 12px; color: white; text-align: center;"><h2 style="font-size: 2.5rem; margin-bottom: 20px;">Join Our Journey</h2><p style="font-size: 1.2rem; margin-bottom: 30px; opacity: 0.95;">Be part of something extraordinary</p><button style="background: white; color: #667eea; padding: 15px 40px; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer;">Get in Touch</button></div></div>',
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
      '<div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;"><div style="text-align: center; margin-bottom: 60px;"><h1 style="font-size: 3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 20px;">Get in Touch</h1><p style="font-size: 1.2rem; color: #666; max-width: 600px; margin: 0 auto;">We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.</p></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px;"><div><h2 style="font-size: 2rem; color: #1a1a1a; margin-bottom: 30px;">Contact Information</h2><div style="margin-bottom: 30px;"><div style="display: flex; align-items: start; margin-bottom: 25px;"><div style="background: #667eea; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; flex-shrink: 0;"><span style="color: white; font-size: 1.5rem;">📧</span></div><div><h3 style="color: #1a1a1a; margin-bottom: 5px; font-size: 1.2rem;">Email</h3><p style="color: #666; margin: 0;">contact@example.com</p></div></div><div style="display: flex; align-items: start; margin-bottom: 25px;"><div style="background: #667eea; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; flex-shrink: 0;"><span style="color: white; font-size: 1.5rem;">📞</span></div><div><h3 style="color: #1a1a1a; margin-bottom: 5px; font-size: 1.2rem;">Phone</h3><p style="color: #666; margin: 0;">+1 (555) 123-4567</p></div></div><div style="display: flex; align-items: start;"><div style="background: #667eea; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; flex-shrink: 0;"><span style="color: white; font-size: 1.5rem;">📍</span></div><div><h3 style="color: #1a1a1a; margin-bottom: 5px; font-size: 1.2rem;">Address</h3><p style="color: #666; margin: 0;">123 Business Street<br>San Francisco, CA 94103</p></div></div></div></div><div style="background: #f8f9fa; padding: 40px; border-radius: 12px;"><h2 style="font-size: 2rem; color: #1a1a1a; margin-bottom: 25px;">Send a Message</h2><div style="margin-bottom: 20px;"><label style="display: block; color: #1a1a1a; margin-bottom: 8px; font-weight: 500;">Name</label><input type="text" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"></div><div style="margin-bottom: 20px;"><label style="display: block; color: #1a1a1a; margin-bottom: 8px; font-weight: 500;">Email</label><input type="email" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"></div><div style="margin-bottom: 20px;"><label style="display: block; color: #1a1a1a; margin-bottom: 8px; font-weight: 500;">Message</label><textarea style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; min-height: 120px; resize: vertical;"></textarea></div><button style="background: #667eea; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; width: 100%; font-weight: 600;">Send Message</button></div></div></div>',
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
