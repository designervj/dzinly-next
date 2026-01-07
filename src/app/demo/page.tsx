"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { setMockPage, setPageEdit } from '@/hooks/slices/pageEditSlice';
import { useRouter } from 'next/navigation';
 export interface MockPageData {
  html: string;
  css: string;
}


export interface ThemeModel{
  cssVariables: {
    [key: string]: string;
  };
  globalCSS: string;
}
// Mock data from our examples
const MOCK_PAGE_DATA = {
  html: `<section class="hero-section">
  <div class="container">
    <h1 class="hero-title">Management Redefined.</h1>
    <p class="hero-description">The ultimate RBAC engine for enterprise franchises.</p>
    <div class="hero-buttons">
      <a href="/admin" class="btn btn-primary">Go to Admin Dashboard</a>
      <a href="#" class="btn btn-secondary">View Documentation</a>
    </div>
  </div>
</section>

<section class="stats-section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">10k+</div>
        <div class="stat-label">Active Users</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">500+</div>
        <div class="stat-label">Franchises</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">99.9%</div>
        <div class="stat-label">Uptime</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">24/7</div>
        <div class="stat-label">Support</div>
      </div>
    </div>
  </div>
</section>

<section class="features-section">
  <div class="container">
    <h2 class="section-title">Powerful Features</h2>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>RBAC Security</h3>
        <p>Enterprise-level Role Based Access Control with custom permission levels.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3>White Labeling</h3>
        <p>Transform the UI to match your franchise branding with dynamic CSS injection.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3>Fast Onboarding</h3>
        <p>Invite clients and setup new franchise tenants in seconds.</p>
      </div>
    </div>
  </div>
</section>`,
  css: `.hero-section {
  background-color: var(--color-primary);
  padding: 6rem 1.5rem 10rem;
  text-align: center;
  color: white;
}

.container {
  max-width: var(--container-max-width, 1200px);
  margin: 0 auto;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

.hero-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 42rem;
  margin: 0 auto 2.5rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2.5rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background-color: white;
  color: var(--color-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.stats-section {
  position: relative;
  z-index: 20;
  margin-top: -4rem;
  padding: 0 1.5rem;
  margin-bottom: 4rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  background-color: white;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(148, 163, 184, 0.25);
}

.stat-card {
  text-align: center;
  padding: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-primary);
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  padding-top: 0.5rem;
}

.features-section {
  padding: 4rem 1.5rem;
  background-color: #F9FAFB;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #6B7280;
  line-height: 1.6;
}`
};

const MOCK_THEME_DATA = {
  cssVariables: {
    "--color-primary": "#6D1F4A",
    "--color-secondary": "#E9B949",
    "--color-tertiary": "#0EA5E9",
    "--color-primary-soft": "rgba(109, 31, 74, 0.08)",
    "--color-secondary-soft": "rgba(233, 185, 73, 0.1)",
    "--color-tertiary-soft": "rgba(14, 165, 233, 0.1)",
    "--font-family": "Inter, sans-serif",
    "--font-heading": "Inter, sans-serif",
    "--font-body": "Inter, sans-serif",
    "--container-max-width": "1200px",
    "--section-padding": "60px",
    "--border-radius": "8px",
    "--border-radius-lg": "16px",
    "--border-radius-xl": "24px",
    "--shadow-sm": "0 1px 3px rgba(0, 0, 0, 0.1)",
    "--shadow-md": "0 4px 6px rgba(0, 0, 0, 0.1)",
    "--shadow-lg": "0 10px 25px rgba(0, 0, 0, 0.15)"
  },
  globalCSS: `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  color: #1F2937;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  margin-top: 0;
}

p {
  margin-top: 0;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
}

.container {
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}`
};

export default function DemoPage() {
  const [mounted, setMounted] = useState(false);
   const dispatch = useDispatch();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading demo...</p>
        </div>
      </div>
    );
  }

  // Generate CSS variables string
  const cssVariablesString = Object.entries(MOCK_THEME_DATA.cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n    ');


     const router = useRouter();
    const handleEditPageNavigation = () => {
     dispatch (setMockPage({
      page:MOCK_PAGE_DATA,
      theme:MOCK_THEME_DATA
     }))
     router.push('/builder/demo')
    } 
  return (
    <>
      {/* Global Theme CSS Variables */}
      <style dangerouslySetInnerHTML={{
        __html: `:root {\n    ${cssVariablesString}\n  }`
      }} />

      {/* Global Theme CSS */}
      <style dangerouslySetInnerHTML={{
        __html: MOCK_THEME_DATA.globalCSS
      }} />

      {/* Page-specific CSS */}
      <style dangerouslySetInnerHTML={{ __html: MOCK_PAGE_DATA.css }} />

      {/* Demo Info Banner */}
      <div style={{
                backgroundColor: '#FEF3C7',
                borderBottom: '2px solid #F59E0B',
                padding: '1rem',
                textAlign: 'center',
                fontWeight: '600',
                color: '#92400E'
            }}>
                📋 Demo Page - Rendering Mock Data (Homepage with Mahima Valenza Theme)
            </div>

      {/* Page HTML */}
      <div
        className="grapejs-rendered-page"
        dangerouslySetInnerHTML={{ __html: MOCK_PAGE_DATA.html }}
      />

      {/* Debug Info */}
      <div style={{
        backgroundColor: '#F3F4F6',
        padding: '2rem',
        marginTop: '4rem',
        borderTop: '2px solid #E5E7EB'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ color: '#6D1F4A', marginBottom: '1rem' }}>Debug Information</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ color: '#6D1F4A', marginBottom: '0.5rem' }}>Theme Colors</h4>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#6D1F4A',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem'
                }}>Primary</div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#E9B949',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem'
                }}>Secondary</div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#0EA5E9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem'
                }}>Tertiary</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ color: '#6D1F4A', marginBottom: '0.5rem' }}>CSS Variables</h4>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                {Object.keys(MOCK_THEME_DATA.cssVariables).length} variables loaded
              </p>
              <code style={{
                fontSize: '0.75rem',
                color: '#059669',
                display: 'block',
                marginTop: '0.5rem'
              }}>
                var(--color-primary)<br />
                var(--color-secondary)<br />
                var(--container-max-width)
              </code>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ color: '#6D1F4A', marginBottom: '0.5rem' }}>Data Source</h4>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                ✅ Mock Data (Client-side)<br />
                📄 Homepage Schema<br />
                🎨 Mahima Valenza Theme
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Edit Button */}
       <Button onClick={() => handleEditPageNavigation() }>
        Edit
       </Button>
      
    </>
  );
}
