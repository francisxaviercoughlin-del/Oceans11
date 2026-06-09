
export interface Hole {
  hole:number;
  par:number;
  strokeIndex:string;
}

export interface Course {
  name:string;
  holes:Hole[];
}
