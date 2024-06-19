export const PANEL_MODES = { 
    Measurement: 'Measurement',
    createAnnotation: 'create-annotation',
    scale: 'scale',
    rotate: 'rotate',
    translate: 'translate',
    delete: 'delete',
    clearSelection: 'clear-selection',
    label: 'label',
    save: 'save',
    none: 'none'

};


export const PANEL_BUTTONS = [
    { mode: PANEL_MODES.Measurement, label: 'Measurement' },
    { mode: PANEL_MODES.createAnnotation, label: 'Create Annotation' },
    { mode: PANEL_MODES.scale, label: 'Resize', conditional: true},
    { mode: PANEL_MODES.rotate, label: 'Rotate', conditional: true},
    { mode: PANEL_MODES.translate, label: 'Translate', conditional: true},
    { mode: PANEL_MODES.delete, label: 'Delete' },
    { mode: PANEL_MODES.clearSelection, label: 'Clear Selection' },
  ];

