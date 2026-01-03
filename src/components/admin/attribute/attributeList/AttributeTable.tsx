"use client";
import { AppDispatch, RootState } from '@/store/store';
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DataTableExt } from '@/components/admin/DataTableExt';
import { addAttribute, removeAttribute } from '@/hooks/slices/attribute/AttributeSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { MaterialAttributes } from '../types/attributeModel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AttributeForm from '../forms/AttributeForm';
import { addCategory } from '@/hooks/slices/category/CategorySlice';
import { useToast } from '@/hooks/use-toast';
import { formatDateDisplay } from '@/components/projects/FunctionDisplayDate';

const AttributeTable = () => {

  const { listAttribute, isAttributeLoading } = useSelector(
    (state: RootState) => state.attribute
  );
    const { listCategory,  } = useSelector(
    (state: RootState) => state.category
  );
      const { user } = useSelector(
    (state: RootState) => state.user
  );
   const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  // Edit modal state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<MaterialAttributes | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
 const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newAttribute, setNewAttribute] = useState<MaterialAttributes | null>(null);



  const product_attribute = useMemo(() => {
    if (
      listCategory &&
      listCategory.length &&
      listAttribute &&
      listAttribute.length > 0
    ) {
      return listAttribute.map(item => {
        const catId = item.category_id;
        const category = listCategory.find(cat => cat._id == catId)
        return {
          ...item,
          category: category
        };
      });
    }
    return [];
  }, [listCategory, listAttribute]);

   
   


    const handleAdd = () => {
       if(user?.role !== "superadmin" && !user?.permissions?.includes("attribute:create")){
              toast.error("You don't have permission to create attribute");
              return;
            }
            router.push(`/admin/attribute/create`);
    // setNewAttribute({ name: '', category_id: null, type: '', possible_values: [], data_type: undefined ,websiteId:currentWebsite?._id,tenantId:user?.tenantId, userId:user?.id as string | undefined});
    // setFieldErrors({});
    // setIsAddDialogOpen(true);
  };



  const handleDelete = async (row: any) => {
    if(user?.role !== "superadmin" && !user?.permissions?.includes("attribute:delete")){
      toast.error("You don't have permission to delete attribute");
      return;
    }
    const id = row?._id ?? row?.id;
    if (!id) {
      toast.error('Delete failed: Missing id');
      return;
    }

    const ok = confirm(`Delete attribute "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/attribute?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeAttribute(id));
      toast.success(`Attribute ${row?.name ?? id} removed`);
    } catch (err: any) {
      console.error('Failed to delete attribute', err);
      toast.error(`Delete failed: ${String(err?.message || err)}`);
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    setEditingAttribute(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if(user?.role !== "superadmin" && !user?.permissions?.includes("attribute:update")){
      toast.error("You don't have permission to update attribute");
      return;
    }
    if (!editingAttribute) return;
    const id = (editingAttribute as any)._id ?? editingAttribute.id;
    if (!id) {
      toast.error('Save failed: Missing ID');
      return;
    }

    setIsSaving(true);
    try {
      // Remove _id from the payload to avoid MongoDB immutable field error
      const { _id, ...updateData } = editingAttribute as any;
      const res = await fetch(`/api/admin/attribute`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updateData, id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.errors) {
          setFieldErrors(body.errors);
        }
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      const updated = await res.json();
      toast.success('Attribute updated successfully');
      setIsEditDialogOpen(false);
      setEditingAttribute(null);
      setFieldErrors({});
      
      // Reload the data
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to save attribute', err);
      toast.error(`Save failed: ${String(err?.message || err)}`);
    } finally {
      setIsSaving(false);
    }
  };

    const handleSaveAdd = async () => {
      console.log(" new Attribute ", newAttribute)
    if (!newAttribute) return;
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!newAttribute.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!newAttribute.category_id) {
      errors.category_id = 'Category is required';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/attribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAttribute),
      });
      const data = await res.json().catch(() => null);
 if (!res.ok) {
        const msg =
          data?.error ??
          data?.message ??
          (typeof data === "string" ? data : undefined) ??
          "Failed to create";
        throw new Error(msg);
      }
         const created = data?.item ?? data;
      toast.success(`Attribute ${newAttribute.name} created successfully`);
      setIsAddDialogOpen(false);
      setNewAttribute(null);
       dispatch(addAttribute(created));
      // window.location.reload();
    } catch (err: any) {
      console.error('Failed to create attribute', err);
      toast.error(`Create failed: ${String(err?.message || err)}`);
    } finally {
      setIsSaving(false);
    }
  };


  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: any, row: any) => value?.name || '-'
    },
   {
             key: 'createdAt',
             label: 'Created At',
             render: (value: any) => formatDateDisplay(value),
           },
           {
             key: 'updatedAt',
             label: 'Updated At',
             render: (value: any) => formatDateDisplay(value),
           },
  ];

  return (
    <div>
      <DataTableExt
        title="Attributes"
        data={product_attribute ?? []}
            onCreate={handleAdd}
        // createHref="/admin/attribute/create"
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
      />

        {/* Add Attribute Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Attribute</DialogTitle>
          </DialogHeader>
          {newAttribute && (
            <div className="space-y-4">
              <AttributeForm
                attribute={newAttribute}
                setAttribute={value => {
                  if (typeof value === 'function') {
                    setNewAttribute(prev => prev ? value(prev) : prev);
                  } else {
                    setNewAttribute(value);
                  }
                }}
                fieldErrors={fieldErrors}
                filterCategory={listCategory}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewAttribute(null);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAdd}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Add Attribute'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Attribute</DialogTitle>
          </DialogHeader>
          
          {editingAttribute && (
            <div className="space-y-4 py-4">
              <AttributeForm
                attribute={editingAttribute}
                setAttribute={(value) => {
                  if (typeof value === 'function') {
                    setEditingAttribute((prev) => (prev ? value(prev) : null));
                  } else {
                    setEditingAttribute(value);
                  }
                }}
                fieldErrors={fieldErrors}
                filterCategory={listCategory ?? []}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingAttribute(null);
                setFieldErrors({});
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AttributeTable