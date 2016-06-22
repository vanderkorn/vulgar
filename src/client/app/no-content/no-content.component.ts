import { Component } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <div class="card-container">
      <md-card x-large>
        <md-card-title>404: page missing</md-card-title>
      </md-card>
    </div>
  `
})
export class NoContent {

}
