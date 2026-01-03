import { auth } from "@/auth";
import AccountHome from "@/components/admin/accounts/AccountHome";
import GetAllAccount from "@/components/admin/accounts/GetAllAccount";
import { TenantModel } from "@/components/admin/accounts/AccountType";
const isSessionExpired = (expires: string) => {
  return new Date() > new Date(expires);
};
export default async function PagesAdmin() {
  const session = await auth();
  let allaccounts: TenantModel[] = [];
  
  if (!session?.user?.tenantId) {
    return (
      <div className="text-sm text-red-600">Unauthorized: Please sign in</div>
    );
  }
  
  if(session?.expires && session.user.role == "superadmin"){
    if (!isSessionExpired(session?.expires)) {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:55803';
      const url = `${baseUrl.replace(/\/$/, '')}/api/admin/users/accounts`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      });
      console.log(" res---", res)
      if (res.ok) {
        const data = await res.json();
        allaccounts = data.tenants || [];
        console.log("allaccounts", allaccounts);
      } else {
        console.error("Failed to fetch tenants", res.status, await res.text());
      }
    } else {
      // Session expired: handle accordingly (e.g., redirect, show message)
    }
  }
   return(
    <>
    <AccountHome/>
    <GetAllAccount
    allaccounts={allaccounts||[]}
    />
    </>
   )

}