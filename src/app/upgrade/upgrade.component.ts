import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {
@Input() fileID;
viewer = "google";
doc = "https://files.fm/down.php?i=sdymh2y6";


  constructor() { }

  ngOnInit() {
    console.log(this.fileID);
  }

}
