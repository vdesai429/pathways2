import { Component, OnInit, AfterViewInit, Inject, ElementRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {KinveyService} from '../../kinvey.service';


@Component({
  selector: 'app-sharedialog',
  templateUrl: './sharedialog.component.html',
  styleUrls: ['./sharedialog.component.scss']
})
export class SharedialogComponent implements OnInit {
shareUrl;

    constructor(private elem: ElementRef, private dialogRef: MatDialogRef<SharedialogComponent>, @Inject(MAT_DIALOG_DATA) data, private kinvey: KinveyService) {
      console.log(data.data);
      this.shareUrl = data.data.data;
      }

    ngOnInit() {
    }

    copyMessage(val: string) {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }

  
  }
  
