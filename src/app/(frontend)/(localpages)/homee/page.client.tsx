"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Shield, Layout, Users, Zap, CheckCircle, ArrowRight } from "lucide-react"; // Install lucide-react if not present

export default function RootClientPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  const handleLogin = () => {
    if (user) router.push("/admin");
    else router.push("/auth/signin");
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* SECTION 1: HERO SECTION (Dark Modern) */}
      <section className="relative bg-[#0f172a] pt-20 pb-32 px-6 overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -mr-40 -mt-40"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-block p-4 rounded-2xl mb-8 animate-fade-in">
            <img src="/dzinlylogo.svg" alt="Dzinly Logo" className="w-60 h-auto brightness-0 invert" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Redefined.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate RBAC engine for enterprise franchises. White-labeling, 
            deep analytics, and granular control in one powerful dashboard.
          </p>

          <button
            onClick={handleLogin}
            className="group px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-blue-500/50 flex items-center mx-auto gap-2"
          >
            Go to Admin Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* SECTION 2: STATS BAR (Floating) */}
      <section className="relative z-20 -mt-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-8 rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100">
          <Stat item="10k+" label="Active Users" />
          <Stat item="500+" label="Franchises" />
          <Stat item="99.9%" label="Uptime" />
          <Stat item="24/7" label="Support" />
        </div>
      </section>

      {/* SECTION 3: CORE FEATURES (White Grid) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-[48px] font-bold mb-4">Powerful Features</h2>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Shield className="text-blue-600" />}
            title="RBAC Security"
            desc="Enterprise-level Role Based Access Control with custom permission levels."
          />
          <FeatureCard 
            icon={<Layout className="text-indigo-600" />}
            title="White Labeling"
            desc="Transform the UI to match your franchise branding with dynamic CSS injection."
          />
          <FeatureCard 
            icon={<Zap className="text-amber-500" />}
            title="Fast Onboarding"
            desc="Invite clients and setup franchises in seconds with our automated workflow."
          />
        </div>
      </section>

      {/* SECTION 4: CAPABILITIES (Alternating Layout) */}
      <section className="py-20 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Enterprise Ready</span>
            <h2 className="text-4xl font-bold mt-4 mb-6 leading-tight">Advanced User Management for Global Teams</h2>
            <div className="space-y-4">
              <CheckItem text="Hierarchical data isolation between tenants" />
              <CheckItem text="Custom theme engine for colors & typography" />
              <CheckItem text="Real-time audit logs and security monitoring" />
              <CheckItem text="Bulk user import and permission syncing" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-200 rotate-2">
            <div className="bg-slate-900 rounded-2xl h-80 flex items-center justify-center text-blue-400 font-mono italic">
              {"// Dynamic Dashboard Preview"}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA (Dark Blue) */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-[#0f172a] rounded-[40px] p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to transform your workflow?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto relative z-10 text-lg">
            Join hundreds of franchises worldwide using Dzinly to power their operations.
          </p>
          <button 
            onClick={handleLogin}
            className="relative z-10 px-12 py-5 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-all shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6  border-t border-slate-200 text-center text-gray-600 font-medium text-sm bg-[#f7f7f7]">
        <p>&copy; 2024 Dzinly Admin System. High-performance enterprise solutions.</p>
      </footer>
    </main>
  );
}

// Helper Components
function Stat({ item, label }: { item: string, label: string }) {
  return (
    <div className="text-center border-r last:border-0 border-slate-100">
      <div className="text-4xl font-black text-blue-600 font-bold">{item}</div>
      <div className="text-slate-500 text-sm font-medium pt-2">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-blue-500" />
      <span className="text-slate-700 font-medium">{text}</span>
    </div>
  );
}