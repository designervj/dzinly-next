
import { PiPolygonDuotone } from "react-icons/pi";
import { AiOutlineBorder } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateMarkingMode } from "@/hooks/slices/canvas/canvasSlice";
import { Button } from "@/components/ui/button";


const DrawHeader = () => {

  const dispatch= useDispatch();
  const activeCanvas = useSelector(
    (state: RootState) => state.canvas.activeCanvas
  );

  const { markingMode,canvasType } = useSelector((state: RootState) => state.canvas);

  const handleMarkingMode = (mode: "polygon" | "rectangle") => {
    // Dispatch action to set marking mode
     dispatch(updateMarkingMode(mode));
  }
  return (
    <>
     {(canvasType === "draw"|| canvasType === "reannotation")

     && <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className={`group relative flex items-center justify-start w-9 hover:w-28 transition-all duration-300 overflow-hidden px-2
                ${
                  markingMode === "polygon"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : ""
                }`}
            onClick={() => handleMarkingMode("polygon")}
        >
          {/* Icon stays visible */}
          <PiPolygonDuotone
            className={`h-5 w-5 shrink-0 ${
              markingMode === "polygon" ? "fill-blue-600" : ""
            }`}
          />

          {/* Text appears on hover */}
          <span className="ml-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Polygon
          </span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={`group relative flex items-center justify-start w-9 hover:w-28 transition-all duration-300 overflow-hidden px-2
                ${
                  markingMode === "rectangle"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : ""
                }`}
          onClick={() => handleMarkingMode("rectangle")}
        >


          
          {/* Icon stays visible */}
          <AiOutlineBorder
            className={`h-5 w-5 shrink-0 ${
              markingMode === "rectangle" ? "fill-blue-600" : ""
            }`}
          />

          {/* Text appears on hover */}
          <span className="ml-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100 whitespace-nowrap">
            Rectangle
          </span>
        </Button>
      </div>}
    </>
  );
};

export default DrawHeader;
