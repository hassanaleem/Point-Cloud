import { Component } from '@angular/core';
import { SaveService } from '../../service/save.service';
import { IHistory } from '../../interfaces/viewer.interface';
import { Router } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { provideAnimations} from '@angular/platform-browser/animations';


 
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [PaginationComponent, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter(), provideAnimations()],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  animations: []
})
export class TableComponent {

  constructor(private saveService: SaveService, private router: Router) { }

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  data: IHistory[] = [];
  filteredData: IHistory[] = [];
  page = 0;
  pageSize = 15;
  dataToDisplay: IHistory[] = [];

  async ngOnInit() {
    this.data = await this.saveService.loadHistory();
    this.filteredData = [...this.data];
    this.pageChange(1);
  }

  navigateToCanvas() {
    this.router.navigate(['/']);
  }

  pageChange(page: number) {
    this.page = page;
    this.dataToDisplay = this.filteredData.slice( (this.page -1 ) * this.pageSize, (this.page  * this.pageSize));
  }

  onDateSet() {
    if (this.range.controls.start.value && this.range.controls.end.value) {
      const startDate = new Date(this.range.controls.start.value);
      const endDate = new Date(this.range.controls.end.value);
      this.dataToDisplay = this.data.filter((item) => {
        const itemDate = new Date(item.updated_at);
        return itemDate >= startDate && itemDate <= endDate;
      });
      this.filteredData = [...this.dataToDisplay];
    }
    else {
      this.filteredData = [...this.data];
    }
    this.pageChange(1);
  }

  setUpdateTypeFilter(type: string) {
    if (type === 'Measurement' || type === 'Annotation') this.filteredData = this.data.filter((item) => item.update_type === type);
    else this.filteredData = [...this.data];
    this.pageChange(1);
  }

}
