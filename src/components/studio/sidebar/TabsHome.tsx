"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import InspirationContentHome from './tabContent/inspirationContent/InspirationContentHome'
import MeasurementContentHome from './tabContent/measurementContent/MeasurementContentHome'
import LayerContentHome from './tabContent/layerContent/LayerContentHome'
import CommentContentHome from './tabContent/commentContent/CommentContentHome'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'

import DesignHubContentHome from './tabContent/designHubContent/DesignHubContentHome'
import { setActiveTab } from '@/hooks/slices/canvas/tabSlice'
import { setCanvasType } from '@/hooks/slices/canvas/canvasSlice'

const TabsHome = () => {
     const dispatch = useDispatch<AppDispatch>();
     const {activeTab} = useSelector((state: RootState) => state.tabContent);
   
  const handleChangeTab = (value: string) => {
    console.log(value)
    dispatch(setActiveTab(value));
    
  };

    const handleInspirationClick = () => {

    dispatch(setActiveTab("inspiration"));
    dispatch(setCanvasType("hover")) // Set canvas type to hover when Inspiration tab is clicked
  };

      const handleMeasurementClick = () => {

    dispatch(setActiveTab("measurement"));
    dispatch(setCanvasType("hover")) // Set canvas type to hover when Inspiration tab is clicked
  };

        const handleLayerClick = () => {

    dispatch(setActiveTab("layers"));
    dispatch(setCanvasType("hover")) // Set canvas type to hover when Inspiration tab is clicked
  };

     const handleDesignHubClick = () => {

    dispatch(setActiveTab("design-hub"  ));
    dispatch(setCanvasType("hover")) // Set canvas type to hover when Inspiration tab is clicked
  };

     const handleCommentClick = () => {

    dispatch(setActiveTab("comments"  ));
    dispatch(setCanvasType("hover")) // Set canvas type to hover when Inspiration tab is clicked
  };

     return (
    <>
    
    <TooltipProvider>
      <Tabs
        value={activeTab ?? "inspiration"}
        onValueChange={handleChangeTab}
        className="flex flex-col w-full h-full"
        >
          <TabsList className="grid w-full grid-cols-5 gap-2 px-3 py-2 bg-white border border-gray-200 shadow-sm rounded-0 ">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="inspiration"
                 onClick={handleInspirationClick}
                  className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none hover:border-blue-400 bg-white  ${activeTab === 'inspiration' ? ' text-blue-700  shadow font-semibold border-blue-600 border bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700 border-gray-200 border'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-house-icon lucide-house"
                  >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Inspiration</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="design-hub"
                  onClick={handleDesignHubClick}
                  className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none hover:border-blue-400 bg-white ${activeTab === 'design-hub' ? ' text-blue-700 shadow font-semibold border-blue-600 border bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700 border-gray-200 border'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-waypoints-icon lucide-waypoints"
                  >
                    <circle cx="12" cy="4.5" r="2.5" />
                    <path d="m10.2 6.3-3.9 3.9" />
                    <circle cx="4.5" cy="12" r="2.5" />
                    <path d="M7 12h10" />
                    <circle cx="19.5" cy="12" r="2.5" />
                    <path d="m13.8 17.7 3.9-3.9" />
                    <circle cx="12" cy="19.5" r="2.5" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Design Hub</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="measurement"
                  onClick={handleMeasurementClick}
                  className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none hover:border-blue-400 bg-white ${activeTab === 'measurement' ? ' text-blue-700 shadow font-semibold border-blue-600 border bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700 border-gray-200 border'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-calculator-icon lucide-calculator"
                  >
                    <rect width="16" height="20" x="4" y="2" rx="2" />
                    <line x1="8" x2="16" y1="6" y2="6" />
                    <line x1="16" x2="16" y1="14" y2="18" />
                    <path d="M16 10h.01" />
                    <path d="M12 10h.01" />
                    <path d="M8 10h.01" />
                    <path d="M12 14h.01" />
                    <path d="M8 14h.01" />
                    <path d="M12 18h.01" />
                    <path d="M8 18h.01" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Measurement</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="layers"
                  onClick={handleLayerClick}
                 className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none hover:border-blue-400 bg-white ${activeTab === 'layers' ? ' text-blue-700 shadow font-semibold border-blue-600 border bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700 border-gray-200 border'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-rows3-icon lucide-rows-3"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M21 9H3" />
                    <path d="M21 15H3" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Layers</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="comments"
                  onClick={handleCommentClick}
                  className={`flex flex-col items-center justify-center h-8 w-16 transition-all px-2 rounded-lg font-medium focus:outline-none hover:border-blue-400 bg-white ${activeTab === 'comments' ? ' text-blue-700 shadow font-semibold border-blue-600 border bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700 border-gray-200 border'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-message-square-plus-icon lucide-message-square-plus"
                  >
                    <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
                    <path d="M12 8v6" />
                    <path d="M9 11h6" />
                  </svg>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Comment</TooltipContent>
            </Tooltip>
          </TabsList>

          <TabsContent value="design-hub">
            <DesignHubContentHome  />
          </TabsContent>

          <TabsContent value="inspiration" className="flex-grow">
            <InspirationContentHome/>
        
          </TabsContent>

          <TabsContent value="measurement" className="flex-grow">
            {/* Measurement Content */}
            <MeasurementContentHome />


            
          </TabsContent>
          <TabsContent value="layers" className="flex-grow">
            <LayerContentHome />
          </TabsContent>

          <TabsContent value="comments" className="flex-grow">
            <CommentContentHome />
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </>
  )
}

export default TabsHome