import { Component } from '@angular/core';
import { MainLayoutComponent } from './presentation/layouts/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
  template: `<app-main-layout></app-main-layout>`
})
export class AppComponent {
  title = 'Cat Breeds App';
}