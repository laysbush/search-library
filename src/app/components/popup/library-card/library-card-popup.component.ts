import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface LibraryCard {
    name: string;
    address: string;
}

@Component({
    selector: 'app-library-card-popup',
    templateUrl: './library-card-popup.component.html',
    styleUrls: ['./library-card-popup.component.scss'],
    standalone: true,
})
export class LibraryCardPopupComponent {
    public libraryCard: LibraryCard;
    constructor(@Inject(MAT_DIALOG_DATA) public data: LibraryCard) {
        this.libraryCard = this.data;
      }
}
