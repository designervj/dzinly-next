import Home from "./(frontend)/(localpages)/homee/page";

// Force dynamic rendering since this page fetches data with cache: 'no-store'
export const dynamic = 'force-dynamic';

export default function MainHomePage() {
  return <Home />;
}
