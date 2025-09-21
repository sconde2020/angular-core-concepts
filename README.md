# Angular Core Concepts (Beginner Friendly)

This guide explains the **10 main Angular core concepts**  
with **clear examples** so you can quickly understand how Angular works.  
This version uses **standalone components** (no NgModule) and the new @for / @if syntax.

## Table of Contents

1. 👉 **[Components](#components)**
2. 👉 **[Templates & Data Binding](#templates--data-binding)**
3. 👉 **[Directives](#directives)**
4. 👉 **[Pipes](#pipes)**
5. 👉 **[Dependency Injection & Services](#dependency-injection--services)**
6. 👉 **[Routing](#routing-with-standalone-components)**
7. 👉 **[Lifecycle Hooks](#lifecycle-hooks)**
8. 👉 **[Observables & HTTP](#observables--http)**
9. 👉 **[Change Detection](#change-detection)**
10. 👉 **[Forms (Template-driven & Reactive)](#forms-template-driven--reactive)**

---
## Components

A **component** is a small piece of a web page.
It combines **HTML** (what you see), **CSS** (how it looks), and **TypeScript** (how it behaves).
Every Angular app is built from components.

Example

```javascript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',       // Name used in HTML <app-hello>
  standalone: true,            // Standalone component, no module needed
  template: `<h1>Hello Angular!</h1>`,
  styles: [`h1 { color: blue; }`]
})
export class HelloComponent {}
```


Use it inside another template:

```html
<app-hello></app-hello>
```

---

## Standalone Application Setup

With **standalone components**, you don’t need NgModule.
You bootstrap the root component directly.

Example

```javascript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
```


Root component:

```javascript
import { Component } from '@angular/core';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HelloComponent],
  template: `<app-hello />`
})
export class AppComponent {}
```

## Templates

A **template** is the HTML that belongs to a component.
It displays data and reacts to user actions using Angular syntax.

Example


```html
<!-- hello.component.html -->
<h1>{{ title }}</h1>
<button (click)="sayHi()">Say Hi</button>
```

```javascript
export class HelloComponent {
  title = 'Welcome!';
  sayHi() {
    alert('Hi from Angular!');
  }
}
```

---

## Data Binding

Data binding connects the **TypeScript code** and the **HTML**.
It keeps the view and the code in sync.

Types of binding:

- Interpolation: `{{ value }}`

- Property Binding: `[property]="value"`

- Event Binding: `(event)="function()"`

- Two-way Binding: `[(ngModel)]="value"`

Example

```html
<!-- app.component.html -->

    <h2>Welcome {{ username }}!</h2>  <!-- Interpolation: show a value -->

    <!-- Property Binding: disable button if username is empty -->
    <button [disabled]="username.length === 0">Submit</button>

    <!-- Event Binding: call a function when button is clicked -->
    <button (click)="resetName()">Reset</button>

    <!-- Two-way Binding: update the variable and the input together -->
    <input [(ngModel)]="username" placeholder="Type your name" />

    <!-- Another example of property binding: dynamic image source -->
    <img [src]="avatarUrl" [alt]="username" width="100" />

    <!-- Style Binding: change color when name is empty -->
    <p [style.color]="username.length === 0 ? 'red' : 'green'">
    Status: {{ username.length === 0 ? 'Please enter a name' : 'Name OK' }}
    </p>
```

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  username = 'Angular';                  // Used in interpolation & two-way binding
  avatarUrl = 'https://via.placeholder.com/100'; // Used in property binding

  resetName() {                           // Used in event binding
    this.username = '';
  }
}
```
---

## Directives (New Syntax)

Directives change the **look** or **behavior** of HTML elements in dynamic way.

There are **two main types**:

---

### 1. Structural Directives

Structural directives add, remove, or repeat elements in the DOM.

- `@if` → show or hide elements.

- `@else` → optional branch for @if.

- `@for` → repeat elements for each item in a collection.

- `@switch` / `@case` / `@default` → handle multiple conditional cases.

Example

```typescript
@if (isLoggedIn) {
  <p>Welcome back, {{ username }}!</p>
} @else {
  <p>Please log in</p>
}

@for (item of items; track item) {
  <li>{{ item }}</li>
}

@switch (role) {
  @case('admin') { <p>Admin privileges 🔑</p> }
  @case('user') { <p>Regular user 👤</p> }
  @default { <p>Guest 🚪</p> }
}
```
---

### 2. Attribute Directives

Attribute directives **change the appearance or behavior** of existing elements **without adding/removing them**.

- **Built-in examples:**

    - [hidden] → hide/show element.

    - [style.property] → dynamically change style.

    - [class.className] → dynamically add/remove CSS class.

    - [disabled] → disable form elements.

    **Examples**

    ```html
    <p [hidden]="!isLoggedIn">You can see this only if logged in</p>
    <p [style.color]="items.length > 3 ? 'green' : 'red'">Item list status</p>
    <p [class.selected]="selectedItem === 'Banana'">Banana is selected</p>
    <button [disabled]="username.length === 0" (click)="addItem()">Add Item</button>
    ```

    **Equivalent with** ngStyle (**multiple styles**):

    ```html
    <p [ngStyle]="{
    'color': items.length > 3 ? 'green' : 'red',
    'font-weight': isImportant ? 'bold' : 'normal',
    'background-color': isHighlighted ? 'yellow' : 'white'
    }">
    Item list status
    </p>
    ```

    **Example with ngClass (equivalent for multiple classes):**

    ```html
    <p [ngClass]="{
    'selected': selectedItem === 'Banana',
    'highlight': isHighlighted
    }">
    Banana is selected
    </p>
    ```

- **Custom attribute directives:**  
Custom attribute directives let you **create reusable behaviors**.
For example, a directive to change background on hover:

```typescript
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[appHoverHighlight]', standalone: true })
export class HoverHighlightDirective {
  constructor(private el: ElementRef) {}
  
  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = 'lightblue';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
```

Usage:

```html
<p appHoverHighlight>Hover over me!</p>
```

---

## Services & Dependency Injection

A **service** holds shared logic or data, like fetching data from an API.
Angular’s **Dependency Injection (DI)** system provides services to components automatically.  

You can provide services in different scopes:

---  

### 1. Root-Level Service (Global Singleton)

Declared with providedIn: 'root' or via bootstrapApplication.

```javascript
// One instance shared across the app
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  getMessage() {
    return 'Hello root from Service!';
  }
}
```

```javascript
// Use it in a component
import { Component } from '@angular/core';
import { MessageService } from './message.service';

@Component({
  selector: 'app-hello-service',
  standalone: true,
  template: `<p>{{ message }}</p>`
})
export class HelloServiceComponent {
  message: string;
  constructor(private msgService: MessageService) {
    this.message = msgService.getMessage();
  }
}
```

**Alternative bootstrap-level provider:**
```javascript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MessageService } from './message.service';

bootstrapApplication(AppComponent, {
  providers: [MessageService] // global singleton
});
```

---

### 2. Component-Level Service (Local Instance)

- Provide service **directly in a standalone component** using providers.

- **Each component instance gets its own service instance.**

```javascript
// serrvice
import { Injectable } from '@angular/core';

@Injectable()
export class CounterService {
  count = 0;
  increment() { this.count++; }
}
```

```javascript
// use it in component
import { Component } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  providers: [CounterService], // service scoped to this component
  template: `
    <p>Count: {{ counter.count }}</p>
    <button (click)="counter.increment()">Increment</button>
  `
})
export class CounterComponent {
  constructor(public counter: CounterService) {} // must be public to use in template
}
```
---
### 3. Route-Level Service (Scoped to Route)

- Provide service **directly in a route configuration.**

- **A new instance is created each time the route is activated.**

```javascript
// service
import { Injectable } from '@angular/core';

@Injectable()
export class FeatureService {
  message = 'Hello from FeatureService';
}

import { Component } from '@angular/core';
import { FeatureService } from './feature.service';
```

```javascript
// use it in component
@Component({
  selector: 'app-feature',
  standalone: true,
  template: `
    <p>{{ featureService.message }}</p>
    <button (click)="featureService.message='Updated!'">Update</button>
  `
})
export class FeatureComponent {
  constructor(public featureService: FeatureService) {}
}
```

```javascript
// inject through routes
import { Routes } from '@angular/router';
import { FeatureComponent } from './feature.component';
import { FeatureService } from './feature.service';

export const featureRoutes: Routes = [
  {
    path: 'feature',
    component: FeatureComponent,
    providers: [FeatureService] // route-scoped
  }
];
```
---
### 4. Manual Instantiation (Without DI)

Create an instance **manually** with new.

**Independent** of Angular DI system.

```javascript
@Component({
  selector: 'app-manual',
  standalone: true,
  template: `
    <p>Count: {{ counter.count }}</p>
    <button (click)="counter.increment()">Increment</button>
  `
})
export class ManualComponent {
  counter = new CounterService(); // manual instance
}
```

**Note**: You lose DI features like hierarchical injection or singleton behavior.

---
✅ **Key Points**

- Use **root-level** for app-wide singletons.

- Use **component-level** for isolated state per component.

- Use **route-level** for feature/lazy-loaded services.

- Manual instantiation is **rare**, usually for utilities or testing.

- Remember: `public` is needed in constructor if you want **to use service in template**, otherwise `private` is enough for **inside-class logic only**.

## Routing (with Standalone Components)

Routing lets users **move between pages** without reloading the browser.
You define **routes** that map a **URL path** to a **component**.

---

### 1. Static Routing

- All components are loaded when the app starts.

- Simple and good for small apps.


```javascript
import { provideRouter, RouterOutlet, RouterLink } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';
import { AppComponent } from './app.component';

const routes = [
  { path: '', component: HomeComponent },  // default route
  { path: 'about', component: AboutComponent } // static route
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)] // register routes in app
});
```

App template:


```html
<a routerLink="/">Home</a>
<a routerLink="/about">About</a>  

<router-outlet></router-outlet>
```

✅ **Key Points**

- All route components are compiled and loaded as soos as app starts.

- Best for **small apps** where bundle size is not an issue.

---

### 2. Lazy Loading

- Feature code is loaded only when the user visits the route.

- Reduces initial bundle size, improving startup performance.

Instead of importing the component directly, use loadComponent:

```javascript
import { provideRouter, RouterOutlet, RouterLink } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { AppComponent } from './app.component';

const routes = [
  { path: '', component: HomeComponent },
  {
    path: 'about',
    loadComponent: () =>
      import('./about.component').then(m => m.AboutComponent)
  }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
```


App template:

```html
<a routerLink="/">Home</a>
<a routerLink="/about">About</a>

<router-outlet></router-outlet>
```


✅ **Key Points**

- The **AboutComponent** code is loaded **only when** `/about` **is visited**.

- Ideal for `large applications` to speed up initial load.

---

## Lifecycle Hooks

Angular provides **special methods (hooks)** that let you run code at specific moments in a component’s life.
These hooks help you **initialize data, react to changes, manage resources, or clean up.**

---

### Common Lifecycle Hooks

| Hook | When It Runs | Typical Use |
|------|--------------|-------------|
| **ngOnChanges** | Every time an `@Input()` property changes (before ngOnInit for the first time) | React to input changes, validate or transform data |
| **ngOnInit** | Once, right after the component is created and inputs are set | Initialize data, start HTTP calls, set up subscriptions |
| **ngDoCheck** | During every change detection cycle | Perform custom change detection or performance checks |
| **ngAfterContentInit** | After Angular projects external content (`<ng-content>`) into the component | Work with projected content |
| **ngAfterContentChecked** | After every check of projected content | Respond to content updates |
| **ngAfterViewInit** | After component’s view (and child views) are fully initialized | Access `@ViewChild` elements safely |
| **ngAfterViewChecked** | After every check of the component’s view | Trigger post-view logic (use carefully to avoid loops) |
| **ngOnDestroy** | Just before the component is removed from the DOM | Clean up: unsubscribe, stop timers, release resources |

---

### Full Example with Multiple Hooks

👉 **[Lifecycle Hooks Demo](./examples/lifecycle-hooks-demo/)**

---

## Pipes

A **pipe** transforms data in templates without changing the original value.
Angular provides built-in pipes (like `date`, `currency`) and lets you create custom ones.

Example

```javascript
<p>Today is {{ today | date: 'fullDate' }}</p>
<p>Price: {{ price | currency: 'EUR' }}</p>
```


Custom pipe:

```javascript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exclaim', standalone: true })
export class ExclaimPipe implements PipeTransform {
  transform(value: string): string {
    return value + '!!!';
  }
}
```

---

## Observables & RxJS

Angular uses Observables (from RxJS) to handle async data, like HTTP calls or user events.
An Observable is like a **stream of values** over time.

Example

```javascript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul>
      @for (user of users; track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>
  `
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  // Observable that will emit the user array when data is received
  users$: Observable<any[]>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // HttpClient.get() returns an Observable → this is the "observable"
    this.users$ = this.http.get<any[]>('https://jsonplaceholder.typicode.com/users');

    // Subscribe acts as the "observer", receiving data from the Observable
    this.users$.subscribe({
      next: data => {
        this.users = data; // update the component state
        console.log('Users received:', data);
      },
      error: err => console.error('Error fetching users', err),
      complete: () => console.log('User fetch complete')
    });
  }
}
```

**Explanation**

- **Observable**: `this.http.get<any[]>('...')`

    - Produces data asynchronously.

    - Represents a** stream of values** that will arrive in the future.

- **Observer**: the object passed to `.subscribe({ next, error, complete })`

    - Receives the data, errors, and completion signals from the Observable.

    - Here, `next` updates `this.users` to display in the template.

- **Flow**:

    1. Component initializes (`ngOnInit`).

    2. `HttpClient.get()` returns an **Observable**.

    3. `.subscribe()` registers an **Observer** that will handle the emitted user data.

    4. Once data arrives, `this.users` is updated and Angular renders the `<li>` elements via `@for`.