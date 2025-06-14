import {Component} from '@angular/core';
import {TableSortComponent} from './components/table-sort/table-sort';

@Component({
  selector: 'app-root',
  imports: [TableSortComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {

}