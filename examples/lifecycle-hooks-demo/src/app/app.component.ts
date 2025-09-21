import { Component } from '@angular/core';
import { HelloComponent } from './hello/hello.component';

@Component({
  selector: 'app-root',
  imports: [HelloComponent],
  template: `<app-hello name="Angular"></app-hello>`,
})
export class AppComponent {
  title = 'lifecycle-hooks-demo';
}
