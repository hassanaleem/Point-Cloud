export type TRANSFORMATION_MODES = 'scale' | 'rotate' | 'translate' | 'none';
export type TRANSFOMRATIONS = 'scale' | 'rotate' | 'translate'


export interface ISaveData { 
    position: number[],
    rotation: number[],
    scale: number[],
    label?: string,
    labelText?: string,
    id: string
    isMeasurement?: boolean
    measruementGroup?: [Dot, Dot]
}

export interface Dot { 
    id: string,
    position: number[],
}

export interface IHistory {
    updated_at: Date,
    update_type: 'Annotation' | 'Measurement',
}