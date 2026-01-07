
"use client";
import { Website } from "@/components/admin/AppShell";
import { DataTableExt } from "@/components/dataTable/DataTableExt";
import { deleteWebsitePageByWebsiteId } from "@/hooks/slices/websites/websitePageSlice";
import { deleteWebsiteById } from "@/hooks/slices/websites/WebsiteThunk";
import { setCurrentWebsite } from "@/hooks/slices/websites/WebsiteSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/dataTable/delete-confirmation-modal";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function WebsitesExtTable({ items, currentId }: { items: any[]; currentId: string | null }) {
  const rows = (items || []).map((w) => ({
    ...w,
    isCurrent: currentId === w.websiteId,
  }));
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Website | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (data: Website) => {
    setItemToDelete(data);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      const response = await dispatch(deleteWebsiteById(itemToDelete._id)).unwrap();
      if (response.success) {
        const deleteWebsite = await dispatch(deleteWebsitePageByWebsiteId(itemToDelete.websiteId)).unwrap();
        if (deleteWebsite.success) {
          toast.success("Website deleted successfully");
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }
      }
    } catch (error: any) {
      toast.error(error || "Failed to delete website");
    } finally {
      setIsDeleting(false);
    }
  };

  const handeleEditClick = (data: Website) => {
    dispatch(setCurrentWebsite(data));
    router.push(`/admin/domain/${data._id}`);
  };

  return (
    <>
      <DataTableExt
        title="Websites"
        data={rows}
        onView={(data) => { handeleEditClick(data) }}
        opentab={() => { }}
        onDelete={(data) => { handleDeleteClick(data) }}
        initialColumns={[
          {
            key: "name",
            label: "Name",
            render: (_v, row) => (<a className="underline" href="#">{row.name}</a>)
          },
          {
            key: "systemSubdomain",
            label: "System Subdomain"
          },
          {
            key: "primaryDomain",
            label: "Primary Domains",
            render: (value, row) => {
              // Handle both array and single value for backward compatibility
              const domains = Array.isArray(value) ? value : (value ? [value] : []);

              if (domains.length === 0) {
                return <span className="text-gray-400">-</span>;
              }

              return (
                <div className="flex flex-wrap gap-1">
                  {domains.map((domain: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              );
            }
          },
          {
            key: "serviceType",
            label: "Service"
          },
          {
            key: "isCurrent",
            label: "Current"
          },
          {
            key: "websiteId",
            label: "Website Id"
          }
        ]}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Website Domain"
        itemName={itemToDelete?.name}
        description={`This will permanently delete the website domain "${itemToDelete?.primaryDomain}" and all its associated pages. This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}
