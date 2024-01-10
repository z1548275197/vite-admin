// 1: 单行文本  6: 多行文本    4: 复选框   3: 填写日期   7: 选择框
export const MaterialTypeMap = {
  SINGLE_LINE: 1,
  MORE_LINE: 6,
  CHECKBOX: 4,
  DATE: 3,
  SELECT: 7
}
type MaterialType = 1 | 6 | 4 | 3 | 7;


type TimeFormatType = 'DD/MM/YYYY' | 'DD' | 'MM' | 'YYYY';

export interface OptionItem {
  id: number;
  name: string;
}

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
  lineHeight?: number;
  timeFormatType?: TimeFormatType;
  options?: OptionItem[];
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