import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Copy, Edit3, MoreHorizontal, Settings, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



// import {
//   deleteProject,
//   setCurrentProject,
//   setIsDeleteModalOpen,
// } from "@/redux/slices/projectSlice";

// import {
//   setIsAnalyseFinish,
//   setJobUrl,
// } from "@/redux/slices/projectAnalyseSlice";
import { BsIncognito } from "react-icons/bs";
import { CiSquareInfo } from "react-icons/ci";
import { ProjectModel } from "../projectModel";
import { AppDispatch } from "@/store/store";
import { deleteProject } from "@/hooks/slices/project/projectThunks";
import { setCurrentProject } from "@/hooks/slices/project/ProjectSlice";

type ProjectActionProps = {
  project: ProjectModel;
  openAnalysedData: (project: ProjectModel) => void;
  doHouseAnalysis: (project: ProjectModel) => void;
  /** Optional: if omitted, becomes a no-op (prevents runtime crashes). */
  onStartRename?: () => void;
  /** Optional: if omitted, becomes a no-op (prevents runtime crashes). */
  onOpenShare?: () => void;
  
openDeleteModal:()=>void
};

const ProjectAction: React.FC<ProjectActionProps> = ({
  project,
  openAnalysedData,
  doHouseAnalysis,
  onStartRename,
  onOpenShare,
  openDeleteModal
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Safe fallbacks if parent does not pass these
  const safeStartRename = onStartRename ?? (() => {});
  const safeOpenShare = onOpenShare ?? (() => {});

  const handleOpenDeleteModal = (p: ProjectModel) => {
    dispatch(setCurrentProject(p))
    openDeleteModal()
    // dispatch(setIsDeleteModalOpen(true));
    // dispatch(setCurrentProject(p));
  };

  // Keep this around in case you want to trigger a real delete immediately somewhere else.
  const handleDeleteProject = async (p: ProjectModel) => {
    if (!p._id) return;
    try {
      const result = await dispatch(deleteProject(typeof p._id==="string"?p._id:p._id.toString()));
      if (deleteProject.fulfilled.match(result)) {
        toast.success("Project deleted successfully");
      } else {
        toast.error((result.payload as string) || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Something went wrong while deleting the project.");
    }
  };

  const handleCopyLink = (p: ProjectModel) => {
    const projectUrl = `${window.location.origin}/app/studio/${p.id}`;
    navigator.clipboard.writeText(projectUrl);
    toast.success("Project link copied to clipboard!");
  };

  const handleHouseSegments = (projectData: ProjectModel) => {
    if (
      projectData?.jobData?.[0]?.full_image
    ) {
    //   dispatch(setIsAnalyseFinish(true));
    //   dispatch(setJobUrl(projectData.jobData[0].full_image));
      // console.log("House segments action triggered", projectData.jobData[0].full_image);
    }
  };

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="relative flex items-center space-x-2">
        {/* SHARE */}
        <Button
          key="share"
          variant="ghost"
          size="sm"
          aria-label="Share project"
          onClick={(e) => {
            e.stopPropagation();
            safeOpenShare();
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {/* EDIT / RENAME */}
        <Button
          key="edit"
          variant="ghost"
          size="sm"
          aria-label="Rename project"
          onClick={(e) => {
            e.stopPropagation();
            safeStartRename();
          }}
        >
          <Edit3 className="h-4 w-4" />
        </Button>

        {/* ANALYSED DATA / ANALYSE */}
        {project.analysed_data ? (
          <Button
            key="view_analysed_data"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openAnalysedData(project);
            }}
            className="group/info relative"
            aria-label="View analysed data"
          >
            <CiSquareInfo size={18} />
            <span
              className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap
              rounded-md bg-white px-3 py-1 text-xs text-black shadow-xl opacity-0 group-hover/info:opacity-100
              transition-opacity duration-200 z-50"
            >
              Click to view analysed data.
            </span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            key="analyse_project"
            onClick={(e) => {
              e.stopPropagation();
              doHouseAnalysis(project);
            }}
            className="group/info relative"
            aria-label="Analyse project"
          >
            <BsIncognito size={15} />
            <span
              className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap
              rounded-md bg-white px-3 py-1 text-xs text-black shadow-xl opacity-0 group-hover/info:opacity-100
              transition-opacity duration-200 z-50"
            >
              Click to Analyse the Project
            </span>
          </Button>
        )}

        {/* HOUSE SEGMENTS */}
        <Button
          key="house_segments"
          variant="ghost"
          size="sm"
          className="group/info relative"
          aria-label="Get house segments"
          // onClick={(e) => {
          //   e.stopPropagation();
          //   handleHouseSegments(project);
          // }}
        >
          <span
            className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap
            rounded-md bg-white px-3 py-1 text-xs text-black shadow-xl opacity-0 group-hover/info:opacity-100
            transition-opacity duration-200 z-50"
          >
            click to get house segment
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path
                strokeLinecap="round"
                d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2"
              />
              <path
                strokeLinecap="round"
                d="m2 12.5l1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 18.5"
              />
              <path d="m18.562 2.935l.417-.417a1.77 1.77 0 0 1 2.503 2.503l-.417.417m-2.503-2.503s.052.887.834 1.669s1.669.834 1.669.834m-2.503-2.503L14.727 6.77c-.26.26-.39.39-.5.533a3 3 0 0 0-.338.545c-.078.164-.136.338-.252.686l-.372 1.116m7.8-4.212L17.23 9.273c-.26.26-.39.39-.533.5a3 3 0 0 1-.545.338c-.164.078-.338.136-.686.252l-1.116.372m0 0l-.722.24a.477.477 0 0 1-.604-.603l.241-.722m1.085 1.085L13.265 9.65" />
            </g>
          </svg>
        </Button>
      </div>

      {/* Dots dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            key="more_actions"
            variant="ghost"
            size="sm"
            aria-label="More actions"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleCopyLink(project);
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDeleteModal(project);
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProjectAction;
  