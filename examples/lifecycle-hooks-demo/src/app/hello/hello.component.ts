import {
  Component,
  Input,
  OnChanges,
  OnInit,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-hello',
  standalone: true,
  template: ` <p #msg>Hello {{ name }}!</p> `,
})
export class HelloComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  @Input() name = '';

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges → Input changed:', changes);
  }

  ngOnInit() {
    console.log('ngOnInit → Component is ready!');
  }

  ngDoCheck() {
    console.log('ngDoCheck → Change detection running');
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit → Content projected');
  }

  ngAfterContentChecked() {
    console.log('ngAfterContentChecked → Content checked');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit → View initialized');
  }

  ngAfterViewChecked() {
    console.log('ngAfterViewChecked → View checked');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy → Component is destroyed!');
  }
}
