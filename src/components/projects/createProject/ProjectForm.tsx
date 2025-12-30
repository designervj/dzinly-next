"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Home,
  ImageIcon,
  Lightbulb,
  QrCode,
  Ruler,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import ImageUploader from "./ImageUploader";
import { convertToWebP } from "./WebpCoversion";
import { useRouter } from "next/navigation";
import { AnalyseImageModel, ProjectModel } from "../projectModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createProject, fetchAnnotationApiResponse, ProjectResponse, updateProject, updateProjectAnalysis } from "@/hooks/slices/project/projectThunks";
import { UploadService } from "@/components/admin/uploadImage/utilies/uploadService";
import { UploadProgress, UploadResult } from "@/components/admin/uploadImage/utilies/DirectS3UploadService";
import UploadImage from "@/components/admin/uploadImage/utilies/UploadImage";
import { toast } from "sonner";
import { setCurrentProject, updateProjectList } from "@/hooks/slices/project/ProjectSlice";
export type ViewType = "front" | "rear" | "left" | "right";


type ViewKey = "front" | "rear" | "left" | "right";

const PorjectForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
    const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [projectName, setProjectName] = React.useState<string>("New Project");
  const [viewFiles, setViewFiles] = React.useState<File | null>(null);
  const [uploadWebp, setUploadWeb] = React.useState<File | null>(null);

  const { user } = useSelector((state: RootState) => state.user);
  const [isProjectUpload, setIsProjectUpload] = React.useState(true);

  // Upload a file for a given view
  const handleFileUpload = async (file: File, view: ViewKey) => {
    const data: any = await convertToWebP(file);
    setViewFiles(file);
    setUploadWeb(data);
  };

  const removeViewFile = (view: ViewKey) => {
    setViewFiles(null);
  };

  const handleFileRemove = (view: ViewKey) => {
    removeViewFile(view);
    setUploadWeb(null);
  };



  const handleGoBack = () => {
    router.push("/admin/projects");
  };


   const {currentProject }= useSelector((state:RootState)=>state.projects)
  
  const [folderPath, setFolderPath] = useState<string>("");

 
  const handleContinue = async () => {

     if(user && !user.id)
      return

    setIsProjectUpload(false);
   
    const projectData: ProjectModel = {
      name: projectName ?? `New Project`,
      description: "This is a demo project",
      status: "active",
      created_at: new Date,
      updated_at: new Date,
      user_id: typeof user?.id === 'string' ? user.id : ""
    };
    console.log("projectData",projectData)
    const response = await dispatch(createProject(projectData)).unwrap();
    if(response && response.success){
      console.log("response", response);
        setFolderPath(`${user?.id}/pojects/${response.data._id}`);
      dispatch(setCurrentProject(response.data))
      // You can add navigation or toast here
    }
}



  const CheckJobImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return false;
    }
    setImageLoading(true);
    return true;
  };


  const handleUpdateProject=async(data:string)=>{
  
    const projectId = typeof currentProject?._id === 'string' ? currentProject._id : '';
    if (!projectId) return;
    const projectUpdate: ProjectModel = {
      _id: projectId,
      thumbnail: data
    };
    const response = await dispatch(updateProject(projectUpdate)).unwrap();
    if (response && response.success) {
      dispatch(updateProjectList(response.data));
      setCurrentProject(null);
      // router.push("/admin/projects")
      getAnalaysis(projectId, data);
    }
   }
  

    const [isDetectingAnnotation, setIsDetectingAnnotation] =
    useState<boolean>(false);

  const getAnalaysis=async(projectId:string,imageUrl:string )=>{
  setIsDetectingAnnotation(true);
  try{
    const response= await dispatch(updateProjectAnalysis({ url: imageUrl, id: projectId })).unwrap();
    if(response){
      const responseData = response.data as ProjectResponse;
      console.log("resposne Analysys---", responseData)
      if(responseData.success && responseData.data) {
        console.log("Image analysis successful:", responseData.data);
        // dispatch(setIsAnalyseFinish(true));
        if (responseData.data.analysed_data) {
          getAnnotationPoint(imageUrl, responseData.data.analysed_data,projectId);
        }
      }
    }
  }catch(err){
    if(err instanceof Error)
      console.log("Error on Analysiis")
  } finally {
    setIsDetectingAnnotation(false);
  }
}

  const getAnnotationPoint= async(imageUrl:string,analysed_data:AnalyseImageModel, projectId:string)=>{

    try {
  
      const responce = await dispatch(
        fetchAnnotationApiResponse({ imageUrl, project_id: projectId, analysis_summary:analysed_data})
      ).unwrap();
  
      if (responce.status === "success") {
          console.log("get all annotation-----", responce)
        // dispatch(addJobId(jobId))
        
      }
    } catch (error) {
      if (error instanceof Error)
        toast.error("Error in getting Annotation point");
    }
  }


  return (
    <>
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 w-full bg-gray-50 backdrop-blur-md border-b border-border shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4 py-5 md:py-6">
            {/* Back Button */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Button
                onClick={handleGoBack}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-white hover:text-white hover:bg-blue-500 bg-primary border border-gray-100 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Back
                </span>
              </Button>
            </div>

            {/* Title & Subtext */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl md:text-2xl font-semibold tracking-tight text-foreground">
                Work Space View
              </h1>

              <p className="text-sm md:text-base text-muted-foreground">
                Select the initial view you want to work on
              </p>

              {/* <p className="text-xs md:text-sm text-muted-foreground/70">
            (Additional views available after delivery of initial project)
          </p> */}
            </div>
          </div>

          {/* Subtle Separator Line */}
          {/* <Separator className="bg-border" /> */}
        </header>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Photo Guidelines
                </h2>
              </div>

              <div className="bg-white rounded-xl pt-4 shadow- border-none">
                <ul className="space-y-3 text-[15px] text-gray-700 leading-relaxed">
                  <li className="flex gap-2 items-center">
                    <ImageIcon className="text-black-500 w-4 h-4" /> Upload
                    multiple room angles for better visualization.
                  </li>
                  <li className="flex gap-2 items-center ">
                    <Home className="text-black-500 w-4 h-4" /> Make sure your
                    room is well-lit and clean.
                  </li>
                  <li className="flex gap-2 items-center">
                    <Ruler className="text-black-500 w-4 h-4" /> Capture clear
                    wall and floor visibility.
                  </li>
                  <li className="flex gap-2 items-center ">
                    <Lightbulb className="text-black-500 w-4 h-4" /> You can
                    test multiple products per view.
                  </li>
                </ul>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-8 w-80 gap-2 border-gray-300 hover:bg-gray-100"
                >
                  <QrCode className="h-4 w-4" /> Upload via QR Code
                </Button>

                <div className="pt-4 text-[15px] text-gray-600 flex items-center gap-2">
                  <IoHomeOutline /> Try have an image? Try our
                  <span className="font-semibold text-blue-600 cursor-pointer hover:underline">
                    demo rooms
                  </span>
                  .
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Upload Images
                </h2>
              </div>

              <div className=" rounded-xl p-3 shadow-sm border-none bg-blue-50">
                <div className="grid grid-cols-1 gap-4">
                 <UploadImage
                  createdProjectId={folderPath}
                  jobImageUpload={CheckJobImageUpload}
                  onUploadSuccess={(data) => {
                    setImageLoading(false);
                    handleUpdateProject(data)
                  }}
                  onUploadError={() => setImageLoading(false)}
                />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleContinue}
              disabled={!isProjectUpload || !projectName.trim()}
              className={`py-4 text-sm font-semibold rounded-md transition-all ${
                projectName.trim()
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {!projectName.trim()
                ? "Please enter a project name"
                : isProjectUpload
                ? `Submit`
                : "Uploading..."}
            </Button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Supported formats: JPG, PNG • Maximum file size: 10MB per image
            </p>
            <p className="mt-1">
              You can upload additional views after the initial project delivery
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PorjectForm;
