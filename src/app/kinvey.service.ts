import { Injectable, NgZone } from '@angular/core';
import { Kinvey } from 'kinvey-angular2-sdk';
import {Router, ActivatedRoute} from '@angular/router';
import {Subject, BehaviorSubject, Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class KinveyService {
  adminStatus: BehaviorSubject<any> = new BehaviorSubject(false);
  currentUser: Subject<any> = new Subject<any>();
  readystatus: BehaviorSubject<any> = new BehaviorSubject(false);
  resetstatus: BehaviorSubject<any> = new BehaviorSubject(false);
  activeUser;
  dataStore = Kinvey.DataStore.collection('pathways');
  admindash: Subject<any> = new Subject<any>();
  previousVersions: Subject<any> = new Subject<any>();
  dashupdate: Subject<any> = new Subject<any>();
  dashcounts: Subject<any> = new Subject<any>();
  templates: Subject<any> = new Subject<any>();
  htmlcopies: Subject<any> = new Subject<any>();
  admincategories: Subject<any> = new Subject<any>();
  userdash: Subject<any> = new Subject<any>();
  adduser: Subject<any> = new Subject<any>();
  fileStream: Subject<any> = new Subject<any>();
  saveStatus: BehaviorSubject<any> = new BehaviorSubject(0);
  fileArray = [];
  loginmessage: Subject<any> = new Subject<any>();
  launchfile: Subject<any> = new Subject<any>();
  editfile: Subject<any> = new Subject<any>();
  

  constructor(private router: Router, private route: ActivatedRoute, private snackbar: MatSnackBar, private zone: NgZone) {
    Kinvey.User.login('jeffrad', 'rad')
    .then((user: Kinvey.User) => {
      this.readystatus.next(true);
      console.log(user);
    })
    .catch((error: Kinvey.BaseError) => {
    });
   }

  loginGeneric() {
      Kinvey.User.login('jeffrad', 'rad')
      .then((user) => {
        this.zone.run(() => {
          this.adminStatus.next(false); 
          this.readystatus.next(true);
          
        })
      });
  }

  logout() {
    Kinvey.User.logout().then(() => {
      this.loginGeneric();
    })
  }



   isAdmin(): Observable<boolean> {
    const user = Kinvey.User.getActiveUser();

    
    console.log(user);
    console.log(this.route.snapshot);
    
    this.currentUser.next(user);
    this.activeUser = user;
    let isAdmin;
    if (user && user.data) {
      if (user && user.data && user.data['isPathwaysAdmin']) {
        console.log('isAdmin');
        isAdmin = true;
        this.adminStatus.next(true);
      }
    }
    else {
      isAdmin = false;
     // this.router.navigate(['/login']);
    }
    return isAdmin;
  }

  isAdminAuth(): Observable<boolean> {
    const user = Kinvey.User.getActiveUser();
    console.log(user);
    console.log(this.route.snapshot);
    
    this.currentUser.next(user); 
    let isAdmin;
    if (user && user.data) {
      if (user && user.data && user.data['isPathwaysAdmin']) {
        console.log('isAdmin');
        isAdmin = true;
        this.adminStatus.next(true);
      }
    }
    else {
      isAdmin = false;
     this.router.navigate(['/login']);
    }
    return isAdmin;
  }

  getDashboard(type) {
    //pathways vs policies
  }
    
  getAdminDashboard(type) {
    console.log(type);
    const query = new Kinvey.Query();
    query.equalTo('type', type).and().notEqualTo('disabled', true);
    query.ascending('category');
    query.ascending('title');
    query.fields = [ 'category', 'dateAccessed', 'dateModify', 'dateReview', 'keywords', 'modality', 'fileCount', 'title', 'type', '_acl', '_id']

    if (Kinvey.User.getActiveUser()) {
    this.dataStore.find(query)
    .subscribe((entities: {}[]) => {
      console.log(entities);
      console.log(Kinvey.User.getActiveUser())
      if (entities.length) {
        this.admindash.next(entities);
      }
    }, (error: Kinvey.BaseError) => {
      console.log(error)
    }, () => {
      // ...
    });
  }
      else {
        setTimeout(() => {
         this.getAdminDashboard(type);
        }, 2000);
      }
  }

  getOne(id) {
    console.log(id)
    this.dataStore.findById(id)
    .subscribe((entity: any) => {
      if (entity && entity.files) {
        console.log(entity)
        this.launchfile.next(entity);
      }
    }, (error: Kinvey.BaseError) => {
      console.log(error)
    }, () => {
      // ...
    });
  }

  getOneEdit(id) {
    console.log(id)
    this.dataStore.findById(id)
    .subscribe((entity: any) => {
      if (entity && entity.files) {
        console.log(entity)
        this.editfile.next(entity);
      }
    }, (error: Kinvey.BaseError) => {
      console.log(error)
    }, () => {
      // ...
    });
  }

  getCategories(type) {
    const query = new Kinvey.Query();
    query.equalTo('type', type);
    const dataStore = Kinvey.DataStore.collection('pathwaysData');
    if (Kinvey.User.getActiveUser()) {
      
    dataStore.find(query)
    .subscribe((entities: {}[]) => {
      console.log(entities);

      if (entities.length) {
      this.admincategories.next(entities);
      }

      else {
        setTimeout(() => {
          this.getCategories(type);
        }, 2000);
      }
    }, (error: Kinvey.BaseError) => {
      console.log(error)
    }, () => {
      // ...
    });
  }
  }

  updateCategories(data) {
    const dataStore = Kinvey.DataStore.collection('pathwaysData');
    dataStore.save(data)
    .then((entity) => {
      console.log(entity);
      this.admincategories.next(entity);
      this.zone.run(() => {
      this.snackbar.open('Categories Updated', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
    }).catch((error: Kinvey.BaseError) => {

    });
  }

  addTemplate(data) {
    this.dataStore.save(data)
    .then((entity) => {
      console.log(entity);
      this.getTemplates();
      this.zone.run(() => {
      this.snackbar.open('Template Added', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
    }).catch((error: Kinvey.BaseError) => {

    });
  }

  deleteTemplate(id) {
    this.dataStore.removeById(id)
    .then((result) => {
      console.log(result);
          this.snackbar.open('Deleted', '', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.getTemplates();
    })
    .catch((error: Kinvey.BaseError) => {
      // ...
    });
  }

  addNew(element) {
    let requests = element.files.length;
    this.fileArray = [];

    for (let i = 0; i < element.files.length; i++) {
      console.log(element.files)
      console.log(requests)
      const metadata = {
        public: true,
        filename: element.files[i].filename
      }
    if (element.files[i].url) {
      console.log(element.files[i])
      this.fileArray.push({
        filename: element.files[i].filename,
        type: element.files[i].type,
        data: element.files[i].data,
        url: element.files[i].url,
        modifyBy: element.files[i].modifyBy || '',
        modifyDate: element.files[i].modifyDate || ''
      })
      requests--
      if (requests === 0) {
        this.uploadNew(element);
      }
    }
    else {
      console.log(element.files[i]);
      const extension = element.files[i].name.split('.').pop();
      Kinvey.Files.upload(element.files[i], metadata)
      .then((value) => {
        console.log(value);
        Kinvey.Files.stream(value._id)
        .then((file) => {
          console.log(file);
          requests--;
          this.fileArray.push({
            filename: element.files[i].filename,
            id: file._id,
            url: file._downloadURL,
            mime: file.mimeType,
            type: extension,
            modifyBy: element.files[i].modifyBy || '',
            modifyDate: element.files[i].modifyDate || ''
          });
          if (requests === 0) {
            this.uploadNew(element);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
    console.log(this.fileArray);
  }

  uploadNew(element) {
    console.log(element)
    console.log(this.fileArray);

    element.files = this.fileArray;
    element['fileCount'] = this.fileArray.length;

    this.dataStore.save(element)
    .then((entity) => {
      console.log(entity);
      this.getAdminDashboard(element.type);
      this.zone.run(() => {
      this.snackbar.open('Document Added', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
    }).catch((error: Kinvey.BaseError) => {

    });
}


  update(element) {

  }

  delete(element,type) {
    element['disabled'] = true;
    this.dataStore.save(element)
    .then((result) => {
      console.log(result);
          this.snackbar.open('Deleted', '', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.getAdminDashboard(type);
    })
    .catch((error: Kinvey.BaseError) => {
      // ...
    });
  }


  makeAdmin() {
    
  }

  getPrev(id) {
    const query = new Kinvey.Query();
    query.equalTo('parentID', id);
    query.limit = 20;
    query.descending('_kmd.ect');
    const dataStore = Kinvey.DataStore.collection('pathwaysVersions');
    dataStore.find(query)
    .subscribe((entities: {}[]) => {
      console.log(entities);

      if (entities.length) {
      this.previousVersions.next(entities);
      }

      else {
        this.previousVersions.next(null);
      }
    }, (error: Kinvey.BaseError) => {
      console.log(error)
    }, () => {
      // ...
    });
  }

  saveVersion(id, date, data) {
    const saveObj = data;
    saveObj['backupDate'] = date;
    saveObj['parentID'] = id;
    const dataStore = Kinvey.DataStore.collection('pathwaysVersions');
    dataStore.save(saveObj).then((entity) => {
      console.log(entity);
    })
  }

  dashboardCounts() {
    const query = new Kinvey.Query();
    query.notEqualTo('disabled', true);
    const aggregation = Kinvey.Aggregation.count('type');
    aggregation['query'] = query;
    this.dataStore.group(aggregation)
        .subscribe((entities: {}[]) => {
      console.log(entities);
      let countObj = {};

      for (let i = 0; i < entities.length; i++) {
        console.log(entities[i])
        const type = (entities[i] as any).type;
        const count = (entities[i] as any).count;
        countObj[type] = count;
        }

      this.dashcounts.next(countObj);
  })
}

getTemplates() {
  const query = new Kinvey.Query();
  query.equalTo('type', 'template');
  this.dataStore.find(query)
      .subscribe((entities: {}[]) => {
        if (entities.length) {
    console.log(entities);
    this.templates.next(entities);
        }
})
}

getHTMLforCopy() {
  const query = new Kinvey.Query();
  query.equalTo('type', 'protocols');
  const secondQuery = new Kinvey.Query();
  secondQuery.equalTo('files.type', 'html')
  query.and(secondQuery);
  query.ascending('category');
  this.dataStore.find(query)
      .subscribe((entities: {}[]) => {
    if (entities.length) {
    this.htmlcopies.next(entities);
    }

})
}

  getUsers() {
    Kinvey.CustomEndpoint.execute('getUsers', {
      }).then((response) => {
        console.log(response);
        this.userdash.next(response['users']);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  addUser(form) {
    
    Kinvey.CustomEndpoint.execute('addUserPathways', {
      username: form.username,
      password: form.password,
      first_name: form.firstName || '',
      last_name: form.lastName || '',
      email: form.email
    }).then((response) => {
      console.log(response);
      this.adminRole('upgrade', (response as any)._id);
    })
    .catch((error) => {
      console.log(error);
    });
    //add user
    //close dialog via sub
    //reload accounts
    //send verification email
  }

adminRole(type, id) {
    Kinvey.CustomEndpoint.execute('pathwaysAdmin', {
      type: type,
      id: id
    })
    .then((response) => {
      console.log(response);
      this.getUsers();
      this.adduser.next(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

adminLogin(username, pass) {
  console.log('logging in')
  Kinvey.User.logout()
  .then(() => {
    Kinvey.User.login(username, pass)
    .then((user) => {
      console.log(user);
      if (user && user.data && user.data['isPathwaysAdmin']) {
            this.adminStatus.next(true);
           this.loginmessage.next('success')
          }
      else {
        this.loginmessage.next({'error': 'Administrator access required'});
      }

    }).catch((err) => {
      console.log(err);
        if (err.code === 401) {
        this.loginmessage.next({'error': 'Incorrect username or password. Please try again'});
        }
        else {
         this.loginmessage.next({'error': 'Request Failed. Please check your internet connection'});
        };
      });
  });

  }

  resetpass(email) {
    Kinvey.User.resetPassword(email)
    .then(() => {
      this.resetstatus.next(true)
      console.log('reset')
    })
    .catch((error) => {
      console.log(error)
    });
  }

}

