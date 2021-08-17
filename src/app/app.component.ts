import { Component, OnInit} from '@angular/core';
import {KinveyService} from './kinvey.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private kinveyservice: KinveyService) {
    this.kinveyservice.logout();
  }

  ngOnInit() {

  }

}
