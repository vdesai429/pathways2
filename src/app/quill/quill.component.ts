import { Component, OnInit, ViewChild, AfterViewInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {DocdialogComponent} from 'app/table-list/docdialog/docdialog.component';
import {KinveyService} from '../kinvey.service';
import {MatSnackBar} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from '../../../src/assets/ckeditor/ckeditor';

import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as moment from 'moment'; // add this 1 of 4
import {SharedialogComponent} from 'app/table-list/sharedialog/sharedialog.component';



@Component({
  selector: 'app-editor',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss']
})
export class QuillComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public Editor = ClassicEditor;
 
  dataSource: MatTableDataSource<any>;

  fileArray = [];
  urlType = 'pathways'
  baseURL = 'http://docs.jeffrad.org/#/'
  resultCount = 0;
  activeFile: any = {};
  activeFileNum = 0;
  activeFileURL;
  deleteElement;
  editElement;
  isAdmin;
  editorContent;

  config: any = {
    toolbar: [
      'heading', '|', 'bold', 'italic', 'fontColor', '|', 'bulletedList', 'numberedList', 'insertTable', 'mediaEmbed', '|', 'lineheight', 'undo', 'redo'
    ]
  }

  addForm = this.fb.group({
    title: [null, Validators.required],
    category: [null, Validators.required],
    dateModify: [null, Validators.required],
    file: [null, Validators.required]
  });

  editForm = this.fb.group({
    title: [null, Validators.required],
    category: [null, Validators.required],
    dateModify: [null, Validators.required],
    file: [null, this.fileArray.length]
  });

  editNameForm = this.fb.group({
    filename: [null, Validators.required]
  });

  editCKNameForm = this.fb.group({
    filename: [null, Validators.required]
  });

  displayedColumns: string[] = ['title', 'category', 'dateModify', 'dateAccessed', 'tools'];
  data;
catbackup = ['General', 'Professionalism', 'Contrast Administration', 'Results Communication']
  categories = [];
  categoriesElement; //contains ID for update
  dashsub;
  dashupdatesub;
  catsub;
  loading = true;

  tempForm;
  editor;
  editActive;
  editQuillActive;
  editCKActive;


  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog, private kinvey: KinveyService, private zone: NgZone, private snackbar: MatSnackBar) {
    this.isAdmin = this.kinvey.isAdmin();
    this.kinvey.adminStatus.subscribe((status) => {
      this.isAdmin = status;
  });
   }

  ngOnInit() {
    this.kinvey.getCategories('pathways');
    this.kinvey.getAdminDashboard('pathways');
    this.catsub = this.kinvey.admincategories.subscribe((entities) => {
      if (entities) {
          this.zone.run(() => {
            if (entities.length) {
              this.categoriesElement = entities[0];
              this.categories = entities[0].data;
              console.log(this.categories);
          }
        })
      }
    })
    this.dashsub = this.kinvey.admindash.subscribe((entities) => {
      if (entities) {
          this.zone.run(() => {
            if (entities.length) {
              console.log(entities);
              this.data = entities;
            this.dataSource = new MatTableDataSource(entities);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              console.log("admin:" + this.isAdmin)
              if (!this.isAdmin) {
                this.displayedColumns = ['title', 'category', 'dateModify', 'tools'];
              }
              this.loading = false;
          }
        })
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fileArray, event.previousIndex, event.currentIndex);
  }

  dropCategory(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }


  onFileSelected(event) {
    console.log(event);

    for (let i = 0; i < event.target.files.length; i++) {
        console.log(event.target.files[i]);
        const file = event.target.files[i];
        file['filename'] = file.name;
        const reader = new FileReader();
        reader.onload = e => {
          this.fileArray.push(file);
            console.log(this.fileArray);
          };
        reader.readAsDataURL(file);
      }
    }

    onFileSelectedEdit(event) {
      console.log(event);
  
      for (let i = 0; i < event.target.files.length; i++) {
          console.log(event.target.files[i]);
          const file = event.target.files[i];
          file['filename'] = file.name;
          const reader = new FileReader();
          reader.onload = e => {
            this.fileArray.push(file);
              console.log(this.fileArray);
            };
          reader.readAsDataURL(file);
        }
      }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

todaydate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  return yyyy + '-' + mm + '-' + dd;
}

addNew() {
  console.log(this.addForm.value);

  const newObj = {
    title: this.addForm.value.title,
    type: 'pathways',
    category: this.addForm.value.category,
    dateModify: moment(this.addForm.value.dateModify).format('YYYY-MM-DD'),
    dateAccessed: this.todaydate(),
    files: this.fileArray
  }

  this.kinvey.addNew(newObj);

  this.data.unshift(newObj);
  this.dataSource._updateChangeSubscription()

 // this.dataSource = new MatTableDataSource(this.data);
  //this.dataSource.sort = this.sort;
  //this.dataSource.paginator = this.paginator;
}

edit(element) {
  this.editElement = element;
  const todaydate = this.todaydate();
  this.editForm.controls['title'].setValue(element.title);
  this.editForm.controls['category'].setValue(element.category);
if (element.dateModify) {
  this.editForm.controls['dateModify'].setValue(element.dateModify);
}
else {
  this.editForm.controls['dateModify'].setValue(todaydate);
}
  this.fileArray = element.files;
  this.editActive = true;
  $('#editModal').modal({backdrop: 'static', keyboard: false});
}

addModal() {
  this.fileArray = [];
  const todaydate = this.todaydate();
  this.addForm.controls['dateModify'].setValue(todaydate);
  
  $('#exampleModal').modal({backdrop: 'static', keyboard: false});
}

removeFile(index) {
  console.log(index);
  console.log(this.fileArray);
  this.fileArray.splice(index, 1);
  console.log(this.fileArray);
}

editSubmit() {
  console.log(this.editElement)
  console.log(this.editForm.value);
  const date = moment(this.editForm.value.dateModify).format('YYYY-MM-DD');
  console.log(date);
  //add ID
  const editObj = {
    _id: this.editElement._id,
    title: this.editForm.value.title,
    type: 'pathways',
    category: this.editForm.value.category,
    dateModify: this.editForm.value.dateModify,
    dateAccessed: this.todaydate(),
    files: this.fileArray
  };

//save to kinvey and get data
this.kinvey.addNew(editObj);
this.dataSource._updateChangeSubscription()

}

launchFile(element, num) {
  console.log(element);
  this.activeFile = element;
  this.activeFileNum = num;
  this.activeFileURL = element.files[num].url
  //('#viewModal').modal('show');
  this.openDialog(element, num);
}

openDialog(dialogdata, num) {
  const dialogConfig = new MatDialogConfig();
  //dialogConfig.autoFocus = true;

  dialogConfig.height = "95%";
  dialogConfig.width = "85%"

  dialogConfig.data = {
    data: dialogdata,
    num: num
  }

  console.log(dialogConfig);

  this.dialog.open(DocdialogComponent, dialogConfig);
}



download(element) {
  const files = element.files;
  console.log(files);
  for (let i = 0; i < files.length; i++) {
    let link = document.createElement('a');
    link.download = files[i].filename;
    link.href = files[i].url;
    link.id = files[i].filename;
    link.click();
  }

}

confirmDelete(element) {
  this.deleteElement = element;
  $('#deleteModal').modal({backdrop: 'static', keyboard: false});

}

delete() {
  console.log("deleting")
  this.kinvey.delete(this.deleteElement, 'pathways');
}

public editorChanged( { editor }: ChangeEvent ) {
  const data = editor.getData();
  this.editor = data;
}

ckEditor(content) {
  this.editorContent = content;
  if (this.editCKActive) {
    this.editCKNameForm.controls['filename'].setValue(this.fileArray[this.activeFileNum].filename);
  }
  else {
    this.editCKNameForm.controls['filename'].setValue(null);
  }
  $('#ckModal').modal({backdrop: 'static', keyboard: false});
}

saveCK() {
  const randomID = Date.now();
  console.log(this.editorContent);

  if (this.editCKActive) {
    const index = this.fileArray.findIndex(x => x.id === (this.activeFile as any).id);
    console.log(index);
    this.fileArray[index].data = this.editor;
    this.fileArray[index].filename = this.editCKNameForm.value.filename;
    this.fileArray[index].url = this.editCKNameForm.value.filename + '.html';
    this.editCKActive = false;
  }
 
  else {
  this.fileArray.push({
    filename: this.editCKNameForm.value.filename,
    url: this.editCKNameForm.value.filename + '.html',
    type: 'html',
    data: this.editorContent
  })
}
  console.log(this.fileArray);
}

editCK(filenum) {
  console.log(filenum);
  this.editCKActive = true;
  this.editorContent = this.fileArray[filenum].data;
  this.activeFile = this.fileArray[filenum];
  this.activeFileNum = filenum;
  //this.editCKNameForm.controls['filename'].setValue(this.fileArray[filenum].filename);
  this.ckEditor(this.editorContent);
}




changeName() {
  console.log(this.editNameForm.value);
  this.fileArray[this.activeFileNum].filename = this.editNameForm.value.filename;
}

editName(filenum) {
  this.activeFile = this.fileArray[filenum];
  this.activeFileNum = filenum;
  this.editNameForm.controls['filename'].setValue(this.fileArray[filenum].filename);
  $('#editNameModal').modal({backdrop: 'static', keyboard: false});
}

ckNameChange(event) {
  console.log(event.target.innerHTML)
}

editCategoryModal() {
  $('#editCategoryModal').modal({backdrop: 'static', keyboard: false});
}

updateCategories() {
  this.categoriesElement.data = this.categories;
  console.log(this.categoriesElement)
  this.kinvey.updateCategories(this.categoriesElement);
}

//old code


quill(content) {
  this.editorContent = content;
  $('#quillModal').modal({backdrop: 'static', keyboard: false});
}

//editorChanged(data) {
  //this.editor = data.html;
//}



saveQuill() {
  const randomID = Date.now();
  //this.addForm.controls['file'].setValue('')

  if (this.editQuillActive) {
    const index = this.fileArray.findIndex(x => x.id === (this.activeFile as any).id);
    console.log(index);
    this.fileArray[index].data = this.editor;
    this.editQuillActive = false;
  }
 
  else {
  this.fileArray.push({
    filename: 'customFile.html',
    url: 'customFile.html',
    type: 'html',
    data: this.editor
  })
}
  console.log(this.fileArray);
}

editQuill(filenum) {
  console.log(filenum);
  this.editQuillActive = true;
  this.editorContent = this.fileArray[filenum].data;
  this.activeFile = this.fileArray[filenum];
  this.activeFileNum = filenum;
  console.log(this.editorContent)
  this.ckEditor(this.editorContent);
}

share(element) {
  const url = this.baseURL + this.urlType + '?id=' + element._id;
  console.log(url);

  const dataObj = {data: url};

  const dialogConfig = new MatDialogConfig();
  //dialogConfig.autoFocus = true;

  dialogConfig.data = {
    data: dataObj
  }

  this.dialog.open(SharedialogComponent, dialogConfig);
}

}


