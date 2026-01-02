
"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import CanvasHeaderHome from '../canvasHeader/CanvasHeaderHome';
import CanavasImage from './CanvasImage';
import * as fabric from "fabric";
const StudioCanvasHome = () => {
    const {canvasType} = useSelector((state: RootState) => state.canvas);
 
    const [canvasWidth, setCanvasWidth] = useState(1400);
  const [canvasHeight, setCanvasHeight] = useState(750);
  const {currentProject} = useSelector((state: RootState) => state.projects);
     // // update the canvas image
     const canvasMode= useMemo(() => canvasType, [canvasType]);
     const canvasImage= useMemo(() => currentProject?.thumbnail, [currentProject]);
  const canavasImageRef = React.useRef<any>(null);
       const handleImageLoad = useCallback(() => {
   // setImageLoading(false);
  }, []);

    const handleMouseMove = (event: fabric.TEvent) => {
   // setCanvasEvent(event);
  };
     return (
   <>
    <div className="w-full h-full object-cover">
      <AnimatePresence mode="wait">
        {canvasImage ? (
          <>
            {canvasMode == "hover" && (
              <>
           
                  <>
                    {/* <CanvasHeaderHome /> */}
                  
                    <CanavasImage
                        imageUrl={canvasImage}
                        width={canvasWidth}
                        height={canvasHeight}
                        onImageLoad={handleImageLoad}
                        ref={canavasImageRef}
                        onMouseMove={handleMouseMove}
                      />

                  </>
               
                {/* {canavasImageRef && canvasWidth && canvasHeight && (
                  <Hovertemplate
                    canvas={canavasImageRef}
                    width={canvasWidth}
                    height={canvasHeight}
                  />
                )} */}
              </>
            )}

            {/* {(canvasMode == "draw" ||
              canvasMode == "reannotation" ||
              canvasMode == "dimension") && (
              <>
                <CanvasEditor
                  key={`canvas-editor-${canvasImage}`}
                  imageUrl={canvasImage}
                  width={canvasWidth}
                  height={canvasHeight}
                />
              </>
            )} */}

            {/* {canvasMode == "comment" && (
              <CommentCanvas
                key={`canvas-comment-${canvasImage}`}
                imageUrl={canvasImage}
                width={canvasWidth}
                height={canvasHeight}
                className="mb-6"
                onImageLoad={handleImageLoad}
              />
            )} */}
            {/* show genAi Image on modal */}
            {/* <ShowGenAiOutPut /> */}
          </>
        ) : null}
      </AnimatePresence>
    </div>
   </>
  )
}

export default StudioCanvasHome