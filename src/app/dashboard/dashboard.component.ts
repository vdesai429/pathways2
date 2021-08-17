import { Component, OnInit, NgZone } from '@angular/core';
import {KinveyService} from '../kinvey.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  data;
  loading = true;

  dashcountsub;

  constructor(private kinvey: KinveyService, private zone: NgZone) {
    this.kinvey.dashcounts.subscribe((data) => {
      console.log(data);
      this.data = data;
      this.zone.run(() => {
      this.loading = false;
      });
      })

   }
 
  ngOnInit() {
    this.kinvey.dashboardCounts();
  }

}
