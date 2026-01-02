import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { listProducts } from '@/lib/material/product';
import { AppDispatch, RootState } from '@/store/store';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Calendar, Globe, Lock, FolderOpen, Users, Loader } from "lucide-react";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

import React, { useMemo, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ProjectModel } from '../projectModel';
import ProjectAction from './ProjectAction';
import { formatDateDisplay } from '../FunctionDisplayDate';
import DeleteModal from '../deleteProject/DeleteProjectModal';
import { deleteProject } from '@/hooks/slices/project/projectThunks';
import { setCurrentProject } from '@/hooks/slices/project/ProjectSlice';

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
const GridHome = () => {

    const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();

    const {projects}= useSelector((state:RootState)=>state.projects)
    const listProjects=useMemo(()=>{
        if(projects && projects.length>0)
            return projects
    },[projects])

      const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareProject, setShareProject] = useState<ProjectModel | null>(null);
const [userProjects, setUserProjects] = useState<ProjectModel[]>([]);
    const saveProjectName = async (project: ProjectModel, nextName: string) => {
    setUserProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, name: nextName } : p))
    );
    setRenamingId(null);
    // TODO: dispatch your real update thunk here
  };

    const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

    const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "paused":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const handleOpenAnalysedData=()=>{

  }

  const handleHouseAnalysis=()=>{

  }
    const startRename = (p: ProjectModel) => {
    if (!p.id) return;
    setRenamingId(p.id);
    setRenameValue(p.name ?? "");
  };

const [isDeleteModalOpen, setIsDeleteModalOpen]= useState<boolean>(false)
  const handleOpenDeleteModal=()=>{
setIsDeleteModalOpen(true)
  }

  const handleCancelProjectDelete=()=>{
setIsDeleteModalOpen(false)
  }
  const handleDeleteProject = async (data: ProjectModel) => {
    if (data && data._id) {
      const response = await dispatch(deleteProject(typeof data._id === 'string' ? data._id : data._id.toString())).unwrap();
      if (response) {
        toast({
          title: 'Project deleted',
          description: 'The project was deleted successfully.',
          
        });
        setIsDeleteModalOpen(false);
      }
    }
  }

  const handleProjectClick=(data:ProjectModel)=>{
    dispatch(setCurrentProject(data))
  router.push("/studio")
  }
  return (
   <>
       {(



        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 space-y-6 pe-10 ps-8"
        >
          {/* Modal */}
          {/* {isOpen.visible && (
            <AnalyzedDataModal
              projectId={isOpen.projectId}
              isOpen={isOpen.visible}
              onClose={handleClose}
            />
          )} */}

          {/* <ProjectHeader createProject={handleCreateProject} />
          <ProjectStaticCard /> */}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {listProjects
              &&listProjects.map((project, index) => {
                const progress =
                  typeof project.progress === "number" ? project.progress : 0;

                return (
                  <motion.div
                    key={project.id ?? `proj-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    layout
                  >
                    <Card className="overflow-hidden transition-all duration-300 rounded-lg cursor-pointer group hover:shadow-lg">
                      <div
                        className="relative"
                        onClick={() => handleProjectClick(project)}
                      >
                        {project.thumbnail? (
                          <div className="relative overflow-hidden rounded-lg rounded-b-none">
                            <LazyLoadImage
                              src={
                                project.thumbnail||
                                "/placeholder-image.png"
                              }
                              alt={project.name ?? "Project image"}
                              className="object-cover w-full transition-transform duration-300 h-52 group-hover:scale-105"
                              // effect="blur"
                              placeholderSrc="/placeholder-image.png"
                              threshold={200}
                              wrapperClassName="w-full h-52"
                            />
                            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full h-52 bg-gradient-to-br from-primary/10 to-primary/5">
                            <FolderOpen className="w-8 h-8 text-primary/50" />
                          </div>
                        )}

                        {/* Visibility */}
                        <div className="absolute flex items-center space-x-1 top-2 right-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              project.visibility === "public"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                            )}
                          >
                            {project.visibility === "public" ? (
                              <Globe className="w-3 h-3 mr-1" />
                            ) : (
                              <Lock className="w-3 h-3 mr-1" />
                            )}
                            {project.visibility ?? "private"}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg truncate">
                            {renamingId === project.id ? (
                              <input
                                autoFocus
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    saveProjectName(
                                      project,
                                      renameValue.trim()
                                    );
                                  if (e.key === "Escape") cancelRename();
                                }}
                                onBlur={() =>
                                  saveProjectName(project, renameValue.trim())
                                }
                                className="w-full px-2 py-1 text-base bg-transparent border rounded outline-none border-input focus:ring-0 focus:ring-ring"
                                placeholder="Project name"
                              />
                            ) : (
                              project.name ?? "Untitled project"
                            )}
                          </CardTitle>

                          <Badge className={getStatusColor(project?.status)}>
                            {project?.status ?? "active"}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {project.description || "No description provided"}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                     Updated {formatDateDisplay(project.created_at ? project.created_at.toString() : "")}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {/* {isUpdating && updatingProjectId.includes(project.id!) && (
                          <Loader />
                        )} */}

                        <ProjectAction
                          project={project}
                          openAnalysedData={handleOpenAnalysedData}
                          doHouseAnalysis={handleHouseAnalysis}
                          onStartRename={() => startRename(project)}
                         openDeleteModal={handleOpenDeleteModal}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* <ShareProjectDialog
            open={shareOpen}
            onOpenChange={setShareOpen}
            project={shareProject}
          /> */}

          {/* {userProjects.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
              <p className="mb-4 text-muted-foreground">
                Create your first project to get started
              </p>
              <Button onClick={handleCreateProject}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </motion.div>
          )} */}
        </motion.div>
      )}

        {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onCancel={handleCancelProjectDelete}
          type="project"
          onDeleteProject={handleDeleteProject}
        />
      )}
   </>
  )
}

export default GridHome