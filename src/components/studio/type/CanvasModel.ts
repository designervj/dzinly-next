export interface CanvasModel {
  id: number;
  name: string;
  annotations: number[];
}

export interface CanvasImageSetting {
  id?: number;
  aitrainimagewidth?: number;
  aitrainimageheight?: number;
  apply?:boolean;
  created_at?: string;
}
    