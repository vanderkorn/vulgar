import { Component } from '@angular/core';

@Component({
  selector: 'index',
  template: `<h1>Hello from Index</h1>`
})

export class Index {
  constuctor() {

  }

  ngOnInit() {
    console.log('hello `Index` component');
  }
}
