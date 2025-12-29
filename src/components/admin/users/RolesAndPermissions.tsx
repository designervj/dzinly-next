import { DotSquareIcon, Ellipsis } from "lucide-react";
import React from "react";

export const RolesAndPermissions = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <p>Roles & Permissions</p>
          <p>Rerview your members roles and allocate permissions</p>
        </div>
        <div>
          <button>Manage Roles</button>
          <button>
            <Ellipsis />
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
};


