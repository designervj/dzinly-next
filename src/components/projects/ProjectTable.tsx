"use client"
import { AppDispatch, RootState } from '@/store/store'
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { DataTableExt } from '../admin/DataTableExt';
import { ProjectModel } from './projectModel';
import { deleteProject } from '@/hooks/slices/project/projectThunks';
import { formatDateDisplay } from './FunctionDisplayDate';
import GridHome from './gridProjects/GridHome';

const ProjectTable = () => {
    // Helper to format date as 'today', 'yesterday', or '12 Dec 2025'
   
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

    const handleDelete=async(data:ProjectModel)=>{
      if(data && data._id ){
     const response= await  dispatch(deleteProject(typeof data._id === 'string' ? data._id : data._id.toString())).unwrap()
       
      if(response){
        alert("project delete")
      }
    }
  }
    const handleView=(data:ProjectModel)=>{
        
    }

  // Define columns for DataTableExt based on ProductTable style
  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    {
      key: 'thumbnail',
      label: 'Thumbnail',
      render: (value: any) =>
        value ? (
          <img
            src={value}
            alt="Project Thumbnail"
            className="w-12 h-12 object-cover rounded border border-gray-200"
          />
        ) : (
          <span className="text-gray-400 text-xs">No image</span>
        ),
    },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
    { key: 'visibility', label: 'Visibility' },
    { key: 'progress', label: 'Progress' },
    {
      key: 'created_at',
      label: 'Created At',
      render: (value: any) => formatDateDisplay(value),
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      render: (value: any) => formatDateDisplay(value),
    },
  ];

  return (
    <>
      <div>
            {/* <DataTableExt
              title=""
              data={listPojects ?? []}
              onCreate={handleAdd}
              initialColumns={initialColumns}
              onDelete={(row) => handleDelete(row)}
              onView={(row) => handleView(row)}
            /> */}
           < GridHome/>
          </div>
    </>
  )
}

export default ProjectTable