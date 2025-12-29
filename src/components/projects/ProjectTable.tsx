"use client"
import { AppDispatch, RootState } from '@/store/store'
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { DataTableExt } from '../admin/DataTableExt';
import { ProjectModel } from './projectModel';

const ProjectTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();

    const {projects}= useSelector((state:RootState)=>state.projects)
    const listPojects=useMemo(()=>{
        if(projects && projects.length>0)
            return projects
    },[projects])

    const handleAdd=()=>{
        router.push("/admin/projects/create")
    }

    const handleDelete=(data:ProjectModel)=>{

    }

    const handleView=(data:ProjectModel)=>{
        
    }

  // Define columns for DataTableExt based on ProjectModel
  const initialColumns = [
    {
      key: 'name',
      accessorKey: 'name',
      header: 'Name',
      cell: (info: any) => info.getValue(),
    },
    {
      key: 'description',
      accessorKey: 'description',
      header: 'Description',
      cell: (info: any) => info.getValue(),
    },
    {
      key: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: (info: any) => info.getValue(),
    },
    {
      key: 'visibility',
      accessorKey: 'visibility',
      header: 'Visibility',
      cell: (info: any) => info.getValue(),
    },
    {
      key: 'created_at',
      accessorKey: 'created_at',
      header: 'Created At',
      cell: (info: any) => info.getValue(),
    },
    {
      key: 'updated_at',
      accessorKey: 'updated_at',
      header: 'Updated At',
      cell: (info: any) => info.getValue(),
    },
    {
      key: 'progress',
      accessorKey: 'progress',
      header: 'Progress',
      cell: (info: any) => info.getValue(),
    },
    {
      key: 'thumbnail',
      accessorKey: 'thumbnail',
      header: 'Thumbnail',
      cell: (info: any) => info.getValue() ? <img src={info.getValue()} alt="thumbnail" style={{width: 40, height: 40, objectFit: 'cover'}} /> : null,
    },
  ];

  return (
    <>
      <div>
            <DataTableExt
              title="Categories"
              data={listPojects ?? []}
              onCreate={handleAdd}
              initialColumns={initialColumns}
              onDelete={(row) => handleDelete(row)}
              onView={(row) => handleView(row)}
            />
          </div>
    </>
  )
}

export default ProjectTable