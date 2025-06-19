import {Component} from '@angular/core';
import { signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../enviroments/enviroment';
import { MatDialog } from '@angular/material/dialog';
import { LibraryCardPopupComponent } from '../popup/library-card/library-card-popup.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

  type Library = {
    name: string;
    address: string;
  };

@Component({
  selector: 'app-table-sort',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './table-sort.component.html',
  styleUrl: './table-sort.component.scss',
  standalone: true
})
export class TableSortComponent {
  public searchTerm: WritableSignal<string> = signal('');
  public inputResult: WritableSignal<string> = signal('');
  public libraries: WritableSignal<Library[]> = signal([]);
  public isLoading: WritableSignal<boolean> = signal(false);
  public error: WritableSignal<string | null> = signal(null);

  constructor(private _http: HttpClient, private _dialog: MatDialog) {}

  public onSearchInput(event: Event): void {
    const input = event?.target as HTMLInputElement;
    const value = input.value;
    this.searchTerm.set(value);
  }

  public searchLibraries(): void {
    if(this.searchTerm() === ''){
      this.error.set('Ошибка загрузки данных');
      return;
    }
    this.libraries.set([]);
    this.error.set(null);
    this.inputResult.set(this.searchTerm().split(' ').join(''));
    this.isLoading.set(true); 
    this._http.get<any>('https://apidata.mos.ru/v1/datasets/526/rows', {
      params: {
        api_key: environment.apiKey
      }
    })
      .subscribe({
        next: (res) => {
          let libs: Library[];
          const resp: Library[] = Array.isArray(res)
            ? res.map((row: any) => ({
                name: row.Cells.FullName,
                address: row.Cells.OrgInfo[0].LegalAddress
              }))
            : [];
          const searchWords = this.searchTerm().toLowerCase().split(/\s+/);
          libs = resp.filter((lib: Library) => {
            const nameWords = lib.name.toLowerCase().split(/\s+/);
            return searchWords.some(word => nameWords.includes(word));
          });
          this.libraries.set(libs);
          this.isLoading.set(false); 
          if(libs.length === 0){
            this.error.set('Библиотеки не найдены');
          } else {
            this.error.set(null);
          }
        },
        error: (err) => {
          this.error.set('Ошибка загрузки данных');
          this.isLoading.set(false);
        }
      });
  }

  public openLibraryCard(lib: Library): void {
    this._dialog.open(LibraryCardPopupComponent, {
      data: lib
    });
  }
}