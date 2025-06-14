import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

export interface Route {
  uuid: number;
  address: string;
  mask: string;
  gateway: string;
  interface: string;
}

@Component({
  selector: 'app-table-sort',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, AsyncPipe],
  templateUrl: './table-sort.html',
  styleUrl: './table-sort.scss',
  standalone: true
})
export class TableSortComponent {
  private routesData = new BehaviorSubject<Route[]>([
    { uuid: 1, address: '192.168.1.1', mask: '255.255.255.0', gateway: '192.168.1.254', interface: 'Гостевая сеть' },
    { uuid: 2, address: '192.168.1.2', mask: '255.255.255.0', gateway: '192.168.1.253', interface: 'Подключение Ethernet' },
    { uuid: 3, address: '192.168.1.3', mask: '255.255.255.0', gateway: '192.168.1.252', interface: 'Локальная сеть' },
    { uuid: 4, address: '192.168.1.4', mask: '255.255.255.0', gateway: '192.168.1.251', interface: 'Подключение Wi-Fi' },
    { uuid: 5, address: '192.168.1.0', mask: '255.255.255.0', gateway: '192.168.1.250', interface: 'Мостовой интерфейс' },
    { uuid: 6, address: '192.168.1.6', mask: '255.255.255.0', gateway: '192.168.1.249', interface: 'Автономная сеть' },
    { uuid: 7, address: '192.168.1.7', mask: '255.255.255.0', gateway: '192.168.1.248', interface: 'Сетевой мост' },
    { uuid: 8, address: '192.168.1.8', mask: '255.255.255.0', gateway: '192.168.1.247', interface: 'Домашняя сеть' },
    { uuid: 9, address: '192.168.1.9', mask: '255.255.255.0', gateway: '192.168.1.255', interface: 'Подключение Ethernet' },
  ]);

  public readonly routes$ = this.routesData.asObservable();

  public sortByIp(name: 'address' | 'gateway') {
    const routes = this.routesData.getValue();
    routes.sort((a, b) => {
      const partA = a[name].split('.').map(Number);
      const partB = b[name].split('.').map(Number);
      for (let i = 0; i < 4; i++) {
        if (partA[i] !== partB[i]) {
          return partA[i] - partB[i];
        }
      }
      return 0;
    });
    this.routesData.next(routes);
  }

  public sortByAddress(adrIp: string) {
    if (adrIp === 'adr') {
      this.sortByIp('address');
      return;
    }
    if (adrIp === 'gate') {
      this.sortByIp('gateway');
      return;
    }
    const routes = this.routesData.getValue();
    this.routesData.next(routes.sort((a, b) => a['interface'].localeCompare(b['interface'])));
    return ;
  }
}
