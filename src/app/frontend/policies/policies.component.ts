import { Component, OnInit, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {DocdialogComponent} from 'app/table-list/docdialog/docdialog.component';
import {KinveyService} from '../../kinvey.service';
import {MatSnackBar} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {SharedialogComponent} from 'app/table-list/sharedialog/sharedialog.component';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
 
  dataSource: MatTableDataSource<any>;

  activeFile: any = {};
  activeFileNum = 0;
  resultCount = 0;
  
  activeFileURL;
  isAdmin;
  urlType = 'policies'
  baseURL = 'http://docs.jeffrad.org/#/'
  displayedColumns: string[] = ['title', 'category', 'dateModify', 'dateAccessed', 'tools'];
  data;

  dashsub;
  loading = true;


  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private kinvey: KinveyService, private zone: NgZone, private snackbar: MatSnackBar) {
   
    this.isAdmin = this.kinvey.isAdmin();
    this.kinvey.adminStatus.subscribe((status) => {
      this.isAdmin = status;
  });
   }

  ngOnInit() {
    this.kinvey.getAdminDashboard('policies');
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
  }

  

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
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


