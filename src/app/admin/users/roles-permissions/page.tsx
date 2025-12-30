import { RolesAndPermissions } from "@/components/admin/users/RolesAndPermissions";


export default async function RoleAndPermission() {

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/rolesandpermissions`)
  const result = await res.json()

  const {roles} = result

  return (
    <div>
      <RolesAndPermissions totalroles={roles} />
    </div>
  );
}
