import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgClass],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  @Input() progress!: number;
  loading = true;
  
  ngOnChanges() {
    if (this.progress === 100) {
      this.loading = false;
    }
  }
}
