import HomePage from "./HomePage";
import RootClientPage from "./page.client";

// Force dynamic rendering since this page fetches data with cache: 'no-store'
export const dynamic = 'force-dynamic';

export default async function Home() {

  return <HomePage />;
}
