type MaterialType = 1 | 2 | 3 | 4;
type TimeFormatType = 'DD/MM/YYYY' | 'DD' | 'MM' | 'YY';

export interface ComponentItem {
  id: Number;
  x: Number;
  y: Number;
  type: MaterialType;
  value: any;
  width: Number;
  height: Number;
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