"use client"
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, ImageIcon, Lightbulb, QrCode, Ruler } from 'lucide-react'
import React from 'react'
import { IoHomeOutline } from "react-icons/io5";
const PorjectForm = () => {
      const [projectName, setProjectName] = React.useState<string>("New Project");
  return (
   <>
     <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 w-full bg-gray-50 backdrop-blur-md border-b border-border shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center px-4 py-5 md:py-6">
            {/* Back Button */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Button
              //  onClick={handleGoBack}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-white hover:text-white hover:bg-blue-500 bg-primary border border-gray-100 shadow-sm">
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
                  className="mt-8 w-80 gap-2 border-gray-300 hover:bg-gray-100">
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
                  {/* {viewTypes.map((viewType) => (
                    <ViewUploader
                      key={viewType.key}
                      viewType={viewType.label}
                      uploadedFile={viewFiles[viewType.key]}
                      onFileUpload={(file) =>
                        handleFileUpload(file, viewType.key)
                      }
                      onFileRemove={() => handleFileRemove(viewType.key)}
                      disabled={hasAnyFiles && !viewFiles[viewType.key]}
                    />
                  ))} */}
                </div>

              
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
            //   onClick={handleContinue}
            //   disabled={!hasAnyFiles || !projectName.trim()}
              className={`py-4 text-sm font-semibold rounded-md transition-all ${
               projectName.trim()
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}>
              {!projectName.trim()
                ? "Please enter a project name"
                : true
                ? `Submit`
                : "Upload"}
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
  )
}

export default PorjectForm