import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import {KinveyService} from '../kinvey.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  userdata = [];
  dataSource;
  displayedColumns: string[] = ['name', 'username', 'email', 'status', 'tools'];
  loading = true;
  submitting = false;
  addusersub;

  addForm = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    username: [null, Validators.required],
    password: [null, Validators.required]
  });

  constructor(private kinvey: KinveyService, private zone: NgZone, private fb: FormBuilder) {

    this.addusersub = this.kinvey.userdash.subscribe((entities) => {
      if (entities) {
          this.zone.run(() => {
            if (entities.length) {
              $('#addUserModal').modal('hide')            }
          });
   }
  });

    function sortArray() {
      return function (a, b) {
        if (a && a.isPathwaysAdmin) {
          return -1
        }
        else {
          return 1
        }
      }
      }
    
    this.kinvey.getUsers();
    this.kinvey.userdash.subscribe((users) => {
      console.log(users);

      users.sort(sortArray());
      console.log(users)
     

        this.dataSource = new MatTableDataSource(users);
        this.dataSource.sort = this.sort;
        this.zone.run(() => {
            this.loading = false;
        })
      })
   }

  ngOnInit() {
  }

  makeAdmin(element) {
    this.kinvey.adminRole('upgrade', element._id)
  }

  removeAdmin(element) {
    this.kinvey.adminRole('downgrade', element._id)
  }

  addUser() {
    $('#addUserModal').modal({backdrop: 'static', keyboard: false});
  }

  onSubmit() {
    console.log(this.addForm.value);
    this.kinvey.addUser(this.addForm.value);
    this.submitting = true;
  }

}
