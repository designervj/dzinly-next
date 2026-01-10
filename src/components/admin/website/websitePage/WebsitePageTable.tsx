"use client"
import { AppDispatch, RootState } from '@/store/store'
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataTableExt } from '../../../dataTable/DataTableExt'

import { useRouter } from 'next/navigation';

import { WebsitePageModel } from './WebsitePageType'
import { deleteWebsitePage, updateCurrentPage } from '@/hooks/slices/websites/websitePageSlice'
import { DeleteConfirmationModal } from '@/components/dataTable/delete-confirmation-modal'
import { toast } from 'sonner'

const WebsitePageTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, tenantUser } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { websitePages } = useSelector((state: RootState) => state.websitePage);
 
  const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteWebsitePageId, setDeleteWebsitePageId] = useState<WebsitePageModel | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

  const filteredPages = useMemo(() => {
    if (
      currentWebsite &&
      currentWebsite._id &&
      websitePages &&
      websitePages.length > 0
    ) {
      return websitePages;
    }
    return [];
  }, [currentWebsite, websitePages]);

  const handleDelete = async (row: WebsitePageModel) => {
    const id = row?._id ;

    setDeleteWebsitePageId(row);
    if (!id) {
      toast( 'Missing id' );
      return;
    }
    setDeleteModalOpen(true);
    // const ok = confirm(`Delete page "${row?.title ?? id}"?`);
    // if (!ok) return;

    // dispatch(deleteWebsitePage(id));

  };

    const handleConfirmDelete = async () => {
      if (!deleteWebsitePageId) return;
      const id = deleteWebsitePageId?._id;
      if (!id) return;
     const response=  await dispatch(deleteWebsitePage(id)).unwrap();
       if(response){
        toast( 'Page deleted successfully' );
       }
     setDeleteModalOpen(false);
      setDeleteWebsitePageId(null);
    }
  const handleView = (row: WebsitePageModel) => {
    const id = row?._id;
    console.log("id. website --", id)
    if (!id) return;
    dispatch(updateCurrentPage(row))
    router.push(`/admin/websites/pages/${id}`);
  };

  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'id', label: 'ID', hidden: true },
    { key: 'slug', label: 'Slug' },
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'tenantId', label: 'Tenant ID',
      render: (row: WebsitePageModel) => {
        console.log("tenantUser", tenantUser?._id)
        console.log("tenantUser", row.tenantId)
        return(
      
        <span>{ tenantUser?.name }</span>
      )}
     },
    { key: 'createdAt', label: 'Created' },
  ];


  const handleViewTab = (row: WebsitePageModel) => {
    const currentSubdomain = Array.isArray(currentWebsite?.primaryDomain)
      ? currentWebsite?.primaryDomain[0]
      : currentWebsite?.primaryDomain;
    const localsub = typeof currentSubdomain === 'string' ? currentSubdomain.split('.')[0] : '';
    const isLocalHost = window.location.hostname.includes("localhost");
    if (isLocalHost) {

      const url = `http://${localsub}.localhost:55803/${row.slug}`;

      window.open(url, '_blank');
    } else {
      const url = `https://${currentSubdomain}/${row.slug}`;
      window.open(url, '_blank');
    }
  }

 
  return (
    <div>
      <DataTableExt
        title=""
        data={filteredPages}
       createHref="/admin/websites/pages/create"
       onDelete={handleDelete}
        initialColumns={initialColumns}
        onView={handleView}
        opentab={handleViewTab}
      />

      <DeleteConfirmationModal
              open={deleteModalOpen}
              onOpenChange={setDeleteModalOpen}
              onConfirm={handleConfirmDelete}
              title="Delete Website Page"
              itemName={deleteWebsitePageId?.title??""}
              description={`This will permanently delete the website page "${deleteWebsitePageId?.slug}". This action cannot be undone.`}
              isLoading={isDeleting}
            />
    </div>
  );
};

export default WebsitePageTable;