import { NgClass } from '@angular/common';
import { Component, effect } from '@angular/core';
import { PanelService } from '../../service/panel-service.service';
import { PANEL_BUTTONS, PANEL_MODES } from '../../constants/panel.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [NgClass],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {

  constructor(private panelService: PanelService, private router: Router) {
    effect(() => {
      this.selectedButton = this.panelService.selectedMode();
      this.enableControls = this.panelService.enableTransformControls();
      this.value = this.panelService.label();
    })
   }
  
  enableControls = false;
  selectedButton = this.panelService.selectedMode();
  
  value = ''
  buttons = PANEL_BUTTONS;

  setSelectedButton(button: string) {
    if (this.panelService.selectedMode() === button) 
      {
        this.panelService.selectedMode.set(PANEL_MODES.none);
        return;
      }
    
    this.panelService.selectedMode.set(button);
    this.selectedButton = button;
  }

  onChangeInput(event: any) {
    this.value = event.target.value;
    this.panelService.label.set(this.value);
  }

  navigateToHistory() {
    this.router.navigate(['/table']);
  }
}
