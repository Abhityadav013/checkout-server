/* eslint-disable @typescript-eslint/no-explicit-any */
 export type Element = {
    type: 'way' | string;
    id: number;
    tags: {
      highway?: string;
      lane_markings?: string;
      maxspeed?: string;
      name?: string;
      priority_road?: string;
      ref?: string;
      surface?: string;
      [key: string]: any; // in case there are more optional tag fields
    };
  };
  
  export type RoadElementsResponse = {
    elements: Element[];
  };