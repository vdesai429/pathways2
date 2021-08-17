import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatButtonToggleGroup } from '@angular/material';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {DocdialogComponent} from 'app/table-list/docdialog/docdialog.component';
import {SharedialogComponent} from 'app/table-list/sharedialog/sharedialog.component';
import {KinveyService} from '../../kinvey.service';
import {MatSnackBar} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from '../../../../src/assets/ckeditor/ckeditor';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as moment from 'moment'; // add this 1 of 4
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-protocolsfrontend',
  templateUrl: './protocolsfrontend.component.html',
  styleUrls: ['./protocolsfrontend.component.scss']
})
export class ProtocolsfrontendComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatButtonToggleGroup, {static: true}) toggleGroup: MatButtonToggleGroup;

  public Editor = ClassicEditor;
 
  dataSource: MatTableDataSource<any>;
  urlType = 'protocols'
  baseURL = 'http://docs.jeffrad.org/#/'
  resultCount = 0;
  
  fileArray = [];
  keywords = [];
  activeFile: any = {};
  activeFileNum = 0;
  activeFileURL;
  deleteElement;
  editElement;
  isAdmin;
  editorContent;
  modality = '';
  category = '';
  htmlcopies = [];
  templates = [];
  dialogActive = false;

  config: any = {
    toolbar: [
      'heading', '|', 'bold', 'italic', 'fontColor', '|', 'bulletedList', 'numberedList', 'insertTable', 'imageUpload', 'mediaEmbed', '|', 'lineheight', 'undo', 'redo'
    ],
    table: {
      contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties' ]
  },
  image: {
    // You need to configure the image toolbar, too, so it uses the new style buttons.
    toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight' ],

    styles: [
        // This option is equal to a situation where no style is applied.
        'full',

        // This represents an image aligned to the left.
        'alignLeft',

        // This represents an image aligned to the right.
        'alignRight'
    ]
}
  }

  addForm = this.fb.group({
    title: [null, Validators.required],
    category: [null, Validators.required],
    dateModify: [null, Validators.required],
    dateReview: [null, Validators.required],
    modality: [null, Validators.required],
    keywords: [null, this.keywords.length],
    file: [null, this.fileArray.length]
  });

  editForm = this.fb.group({
    title: [null, Validators.required],
    category: [null, Validators.required],
    modality: [null, Validators.required],
    keywords: [null, this.keywords.length],
    dateModify: [null, Validators.required],
    dateReview: [null, Validators.required],
    file: [null, this.fileArray.length]
  });

  editNameForm = this.fb.group({
    filename: [null, Validators.required]
  });

  editCKNameForm = this.fb.group({
    filename: [null, Validators.required]
  });

  displayedColumns: string[] = ['title', 'category', 'modality', 'dateModify', 'dateReview', 'tools'];
  data;
catbackup = ['General', 'Professionalism', 'Contrast Administration', 'Results Communication']
  categories = [];
  categoriesElement; //contains ID for update
  dashsub;
  dashupdatesub;
  catsub;
  templatesub;
  htmlcopysub;
  loading = true;
  selectedFilter;

  tempForm;
  editor;
  editActive;
  editQuillActive;
  editCKActive;
  templateCKActive;
  templateName = '';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filterCol;
  launchFileSub;
  


  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private kinvey: KinveyService, private zone: NgZone, private snackbar: MatSnackBar) {
    this.isAdmin = this.kinvey.isAdmin();
    this.kinvey.adminStatus.subscribe((status) => {
      this.isAdmin = status;
  });
    this.kinvey.readystatus.subscribe((status) => {
      if (status) {
        console.log("ready:" + status)
        this.kinvey.getCategories('protocols');
        this.kinvey.getAdminDashboard('protocols');
      }
    })
   }

  ngOnInit() {

   
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
    this.templatesub = this.kinvey.templates.subscribe((entities) => {
      if (entities) {
          this.zone.run(() => {
            if (entities.length) {
              console.log(entities)
              this.templates = entities;
          }
        })
      }
    })
    this.htmlcopysub = this.kinvey.htmlcopies.subscribe((entities) => {
      if (entities) {
        const htmlArray = [];
          this.zone.run(() => {
            if (entities.length) {
              for (let i = 0; i < entities.length; i++) {
                if (entities[i].files && entities[i].files.length) {
                   for (let j = 0; j < entities[i].files.length; j++) {
                      if (entities[i].files[j].type === 'html') {
                        htmlArray.push(
                          {
                            title: entities[i].title + " - " + entities[i].files[j].filename,
                            data: entities[i].files[j].data,
                            
                          }
                        )
                      }
                  }

                }
            }
            this.htmlcopies = htmlArray;
      }
    })
  }
});
    this.dashsub = this.kinvey.admindash.subscribe((entities) => {
      if (entities) {
          this.zone.run(() => {
            if (entities.length) {             
              this.data = entities;
            this.dataSource = new MatTableDataSource(entities);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = (this as any).sort;
              
              console.log("admin:" + this.isAdmin)
              if (!this.isAdmin) {
                this.displayedColumns = ['title', 'category', 'dateModify', 'dateReview', 'tools'];
              }
              this.loading = false;

              if (this.route.snapshot.queryParamMap.get('id')) {
                const activeID = this.route.snapshot.queryParamMap.get('id');
                activeID.trim();
                console.log("route id")
                console.log(this.route.snapshot.queryParamMap.get('id'));
                
                const result = entities.filter(obj => {
                  return obj._id === activeID
                })
                if (result.length && this.resultCount < 1) {
                  this.resultCount++
                this.launchFile(result[0], 0);
                }
           }
          }
        })
      }
    })

    this.launchFileSub = this.kinvey.launchfile.subscribe((entity) => {
      if (entity && entity.files) {
        console.log(entity);
        this.activeFile = entity;
        this.activeFileURL = entity.files[this.activeFileNum].url
        //('#viewModal').modal('show');
        this.zone.run(() => {
          this.openDialog(entity, this.activeFileNum);
        })
      }
    })
  }

  ngOnDestroy() {
    this.launchFileSub.unsubscribe();
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

      this.setupFilter('reset',filterValue);
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    resetToggle() {
      this.toggleGroup.value = null;
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
    type: 'protocols',
    category: this.addForm.value.category,
    modality: this.addForm.value.modality,
    keywords: this.keywords,
    dateModify: moment(this.addForm.value.dateModify).format('YYYY-MM-DD'),
    dateReview: moment(this.addForm.value.dateReview).format('YYYY-MM-DD'),
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
  this.keywords = element.keywords || [];
  this.editForm.controls['title'].setValue(element.title);
  this.editForm.controls['category'].setValue(element.category);
  this.editForm.controls['modality'].setValue(element.modality);  
  this.editForm.controls['keywords'].setValue(element.keywords);  
  this.editForm.controls['dateReview'].setValue(element.dateReview);

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
  this.keywords = [];
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
    type: 'protocols',
    category: this.editForm.value.category,
    dateModify: this.editForm.value.dateModify,
    dateReview: this.editForm.value.dateReview,
    dateAccessed: this.todaydate(),
    modality: this.editForm.value.modality,
    keywords: this.keywords,
    files: this.fileArray
  };

//save to kinvey and get data
this.kinvey.addNew(editObj);
this.dataSource._updateChangeSubscription()

}

launchFile(element, num) {
  console.log(element);
  this.activeFileNum = num;
  this.kinvey.getOne(element._id);
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
  if (this.dialogActive === false) {
    const dialogRef = this.dialog.open(DocdialogComponent, dialogConfig);
    this.dialogActive = true;
    
     dialogRef.afterClosed()
     .subscribe(() => {
       console.log("closed");
       this.dialogActive = false;
     });
   }
}

toolTip(files) {
  const nameArray = [];
  for (let i = 0; i < files.length; i++) {
    nameArray.push(files[i].filename);
}
  return nameArray;
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

confirmDelete(element) {
  this.deleteElement = element;
  $('#deleteModal').modal({backdrop: 'static', keyboard: false});

}

delete() {
  console.log("deleting")
  this.kinvey.delete(this.deleteElement, 'protocols');
}

public editorChanged( { editor }: ChangeEvent ) {
  const data = editor.getData();
  this.editor = data;
}

ckEditor(content) {
  this.editorContent = content;
  this.kinvey.getHTMLforCopy();
  this.kinvey.getTemplates();
  if (this.editCKActive) {
    this.editCKNameForm.controls['filename'].setValue(this.fileArray[this.activeFileNum].filename);
  }
  if (this.templateCKActive) {
    this.editCKNameForm.controls['filename'].setValue(this.templateName);
  }
  if (!this.editCKActive && !this.templateCKActive) {
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
    console.log(this.fileArray[index])
    this.fileArray[index].data = this.editor;
    this.fileArray[index].filename = this.editCKNameForm.value.filename;
    this.fileArray[index].url = this.editCKNameForm.value.filename + '.html';
    this.editCKActive = false;
  }

  else if (this.templateCKActive) {
    const index = this.templates.findIndex((e) => e.title === this.templateName);
    
        if (index === -1) {
            const newTemplateObj = {
              title: this.editCKNameForm.value.filename,
              data: this.editorContent,
              type: 'template'
            }
            this.templates.push(newTemplateObj);
            this.kinvey.addTemplate(newTemplateObj)
        } else {
            this.templates[index]['title'] = this.editCKNameForm.value.filename;
            this.templates[index]['data'] = this.editorContent;
            this.kinvey.addTemplate(this.templates[index]);
            };

    //this.templateCKActive = false;
    this.templateName = '';
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

copyHTML(value) {
  console.log(value);
  this.editorContent = value.data;
  this.ckEditor(this.editorContent);
}

insertTemplate(value) {
  console.log(value);
  this.editorContent = value.data;
  this.ckEditor(this.editorContent);
}

editTemplate() {
  //open modal
  this.templateCKActive = true;
  this.kinvey.getTemplates();
  $('#editTemplateModal').modal({backdrop: 'static', keyboard: false});
}

editTemplateCK(index) {
  this.editorContent = this.templates[index].data;
  this.templateName = this.templates[index].title;
  console.log(this.templateName)
  this.ckEditor(this.editorContent);
}

addTemplate() {
  this.editorContent = '';
  this.templateName = ''
  this.ckEditor(this.editorContent);
}

deleteTemplate(id) {
  console.log(id);
  this.kinvey.deleteTemplate(id);
}


changeName() {
  console.log(this.editNameForm.value);
  this.fileArray[this.activeFileNum].filename = this.editNameForm.value.filename;
  this.editSubmit();
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

filterModality(modality) {
  modality = modality.trim();
  modality = modality.toLowerCase();
  this.modality = modality;
  this.setupFilter('modality', modality);
  this.dataSource.filter = modality;
  //this.selectedFilter = undefined;
  

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

filterCategory(category) {
  category = category.trim();
  category = category.toLowerCase();
  this.category = category;
  this.setupFilter('category', category);
  this.dataSource.filter = category;

        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }

     //   this.resetToggle();
}

setupFilter(column, filterValue) {

  if (column === 'reset') {
    this.dataSource.filterPredicate = (d, filter: string) => {
     // return d.title.toLowerCase().includes(filter) || d.category.toLowerCase().includes(filter) || d.keywords.toString().includes(filter);
     const dataStr = JSON.stringify(d).toLowerCase();
     return dataStr.includes(filter);
    };
  }

  else {
  this.dataSource.filterPredicate = (d, filter: string) => {
    //const textToSearch = d[column] && d[column].toLowerCase() || '';
    return d.modality.toLowerCase().includes(this.modality) && d.category.toLowerCase().includes(this.category);
  };
}

}



addChip(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;

  if ((value || '').trim()) {
  
    this.keywords.push(value);
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }
}
removeChip(keyword): void {
  const index = this.keywords.indexOf(keyword);

  if (index >= 0) {
    this.keywords.splice(index, 1);
  }
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


}
