type MaterialType = 1 | 2 | 3 | 4;
type TimeFormatType = 'DD/MM/YYYY' | 'DD' | 'MM' | 'YY';

export interface ComponentItem {
  id: number;
  x: number;
  y: number;
  type: MaterialType;
  value: any;
  width: number;
  height: number;
  resizing?: Boolean;
  componentName?: string;
  placeholderTxt?: string;
  relationKey?: string;
  fontSize?: number;
  letterSpace?: number;
  timeFormatType?: TimeFormatType;
}

export interface PageItem {
  componentList: ComponentItem[];
  backgroundUrl: string;
}

export interface MaterialItem {
  type: MaterialType;
  name: string;
  icon: string;
}