import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="spinner-overlay">
      <div class="text-center">
        <div class="spinner-border text-brown" style="color:var(--cc-brown)" role="status"></div>
        <p class="mt-2 text-muted-cc small">Loading...</p>
      </div>
    </div>
  `
})
export class SpinnerComponent {}
