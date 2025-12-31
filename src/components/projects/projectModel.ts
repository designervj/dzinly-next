import { ObjectId } from "mongodb";

export interface DistanceRefModal {
  distance_pixel?: number;
  distance_meter?: number;

}
export interface JobModel {
  id?: number;
  title?: string;
  jobType?: string;
  full_image?: string;
  thumbnail?: string;
  project_id?: number;
  created_at?: string;
  updated_at?: string;
  distance_ref?: DistanceRefModal;
}


interface SegmentDetail<T> {
  types_detected: number;
  variants: T[];
}

interface WallVariant {
  material: string;
  color: string;
  texture: string;
  position: string;
  units_count: number;
}

interface WindowVariant {
  type: string;
  frame_color: string;
  shutter_color: string;
  position: string;
  units_count: number;
}

interface RoofVariant {
  type: string;
  material: string;
  color: string;
  position: string;
  units_count: number;
}

interface GutterVariant {
  type: string;
  material: string;
  color: string;
  placement: string;
  units_count: number;
}

interface TrimVariant {
  category: string;
  material: string;
  color: string;
  units_count: number;
}

interface ShutterVariant {
  material: string;
  color: string;
  position: string;
  style: string;
  units_count: number;
}

export interface StyleSuggestions {
  title: string;
  prompt: string;
  target_region: string[];
}

export interface AnalyseImageModel {
  Wall?: string[];
  Door?: string[];
  Garage?: string[];
  Roof?: string[];
  Trim?: string[];
  Column?: string[];
  Railing?: string[];
  Landscape?: string[];
}

export interface ProjectModel {
    _id?:string |ObjectId
  id?: number;
  name?: string;
  description?: string;
  visibility?: "public" | "private";
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  user_id?: string|ObjectId;
  progress?: number;
  thumbnail?: string;
  jobData?: JobModel[];
  analysed_data?: AnalyseImageModel;
  house_segments?: string ;
}
