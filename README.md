# Angular Core Concepts (Beginner Friendly)

This guide explains the **10 main Angular core concepts**  
with **clear examples** so you can quickly understand how Angular works.  
This version uses **standalone components** (no NgModule) and the new @for / @if syntax.

---
## 1. Components

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

## 2. Standalone Application Setup

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

## 3. Templates

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

## 4. Data Binding

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

## 5. Directives (New Syntax)

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

## 6. Services & Dependency Injection

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
