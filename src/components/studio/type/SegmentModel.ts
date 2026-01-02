export interface SegmentModal {
  id?: number;
  job_id?: number;
  title?: string;
  short_title?: string;
  group_name_user?: string;
  group_desc?: string;
  segment_type?: string;
  annotation_points_float?: number[];
  segment_bb_float?: number[];
  annotation_type?: string;
  seg_perimeter?: number;
  seg_area_sqmt?: number;
  seg_skewx?: number;
  seg_skewy?: number;
  created_at?: string;
  updated_at?: string;
  seg_area_pixel?: number;
  group_label_system?: string;
  additionalArea?: number;
  centroid?: { x: number; y: number };
  segment_centroid?:number[];
  composite_url?:string;
  mask_url?:string;
}