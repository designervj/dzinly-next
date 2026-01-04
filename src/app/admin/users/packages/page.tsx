
import { auth } from "@/auth";
import AccountHome from "@/components/admin/accounts/AccountHome";
import PackageHome from "@/components/admin/users/package/PackageHome";
import { PackageModel } from "@/components/admin/users/package/packageType";

const isSessionExpired = (expires: string) => {
  return new Date() > new Date(expires);
};
export default async function PackageAdmin() {
  const session = await auth();
    let allpackages: PackageModel[] = [];
    
    if (!session?.user?.tenantId) {
      return (
        <div className="text-sm text-red-600">Unauthorized: Please sign in</div>
      )
    }
    if(session?.expires && session.user.role == "superadmin"){
    if (!isSessionExpired(session?.expires)) {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:55803';
      const url = `${baseUrl.replace(/\/$/, '')}/api/admin/users/packages`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      });
      console.log(" res---", res)
      if (res.ok) {
        const data = await res.json();
        allpackages = data.packages || [];
        console.log("allpackages", allpackages);
      } else {
        console.error("Failed to fetch packages", res.status, await res.text());
      }
    } else {
      // Session expired: handle accordingly (e.g., redirect, show message)
    }
  }return(
    <>
    <PackageHome
    packages={allpackages||[]}
    />
    </>
  )
}