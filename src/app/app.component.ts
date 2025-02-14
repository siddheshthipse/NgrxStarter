import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home'
    },
    {
      label: 'Users',
      icon: 'pi pi-users'
    }
  ];
}
