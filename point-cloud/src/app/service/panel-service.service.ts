import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  constructor() { }

  selectedMode: WritableSignal<string> = signal('None');
  enableTransformControls: WritableSignal<boolean> = signal(false);

  label: WritableSignal<string> = signal('');

}
