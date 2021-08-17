import { Component, OnInit, AfterViewInit, Inject, ElementRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {KinveyService} from '../../kinvey.service';
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-docdialog',
  templateUrl: './docdialog.component.html',
  styleUrls: ['./docdialog.component.scss']
})
export class DocdialogComponent implements OnInit {
activeFile;
activeFileNum = 0;
viewer;


  constructor(private elem: ElementRef, private dialogRef: MatDialogRef<DocdialogComponent>, @Inject(MAT_DIALOG_DATA) data, private kinvey: KinveyService) {
    console.log(data);  
    this.activeFile = data.data;
      this.activeFileNum = data.num;
      console.log(this.activeFile)
      this.viewer = this.getViewer(this.activeFile.files[this.activeFileNum].type);
      
    }


  ngOnInit() {
  }

  ngAfterViewInit() {
    const elements = this.elem.nativeElement.querySelectorAll('.ql-editor');
    console.log(elements)
    if (elements.length) {
    elements[0].classList.remove('ql-editor');
    elements[0].classList.add('ck-content');
    }
  }

  cssFix() {
    const elements = this.elem.nativeElement.querySelectorAll('.ql-editor');
    console.log(elements)
    if (elements.length) {
    elements[0].classList.remove('ql-editor');
    elements[0].classList.add('ck-content');
    }
  }

  getViewer(extension) {
    console.log(extension)

    if (extension === 'pdf') {
      this.viewer = 'pdf'
    }

    else if (extension === 'doc' || extension === 'docx' || extension === 'xls' || extension === 'xlsx' || extension === 'ppt' || extension === 'pptx') {
      this.viewer = 'office';
    } 

    else if (extension === 'html') {
      this.viewer = 'html';
    }
    
    else {this.viewer = 'google'};
    console.log(this.viewer);
    this.cssFix();
    return this.viewer;
  }

  close() {
    this.activeFile = null;
    this.viewer = null;
    this.activeFileNum = null;
    this.dialogRef.close();
  }

  changeFile(k) {
    this.activeFileNum = k;
    this.getViewer(this.activeFile.files[k].type);
    setTimeout(() => {
      this.cssFix();      
    }, 100);
  }

  downloadFile(file) {
    
      if (file.type === 'html') {
      const htmlFile = "<html><head><script src='https://cdn.ckeditor.com/ckeditor5/26.0.0/classic/ckeditor.js'></script></head><body><div class='ck-content'>" + file.data + "</body></html>"
      const blob = new Blob([htmlFile], { type: 'text/html' });  
      console.log(blob);
      const url = window.URL.createObjectURL(blob);
      saveAs(blob, file.url);
      }
    
      else {
        saveAs(file.url, file.filename)
      }
    }


}
