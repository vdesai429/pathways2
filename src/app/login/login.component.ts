import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from '../../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {KinveyService} from '../kinvey.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  forgot: boolean;
  reset: boolean;
  loginmessagesub;
  loginalerttext;
  loginalert: boolean;
  loading: boolean;
  userForm: FormGroup;
  resetForm: FormGroup;
  resetsub;
  resetmessage = false;
  resetmessagetext = "";
  resetcomplete;
  formErrors = {
    'email': '',
    'password': ''
  };


  loginForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required]
  });

  forgotForm = this.fb.group({
    email: [null, Validators.required],
  });

  validationMessages = {
    'email': {
      'required': 'Please enter your email',
      'email': 'please enter your vaild email'
    },
    'password': {
      'required': 'please enter your password',
      'pattern': 'The password must contain numbers and letters',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    }
  };

  constructor(private router: Router,
              private fb: FormBuilder, private kinveyservice: KinveyService, private zone: NgZone) {

                this.loginmessagesub = this.kinveyservice.loginmessage.subscribe((value) => {
                  if (value) {
                    console.log(value)
                      this.zone.run(() => {
                      setTimeout(() => {
                      if (value === 'success') {
                        this.router.navigate(['/admin']);
                      }

                      else {
                      this.loginalerttext = value.error;
                      this.loginalert = true;
                      this.loading = false
                      }
                      }, 50);
                      });
                  }

                  else { 
                  }
              });

              this.resetsub = this.kinveyservice.resetstatus.subscribe((value) => {
                if (value) {
                  console.log("resetting");
                  this.zone.run(() => {                    
                  setTimeout(() => {
                    this.resetcomplete = true; 
                  }, 500);
                  this.resetmessage = true;
                    })
                  }
                  });
  }

  ngOnInit() {
    this.kinveyservice.logout();
  }

  
  login() {
    this.loading = true;
    this.kinveyservice.adminLogin(this.loginForm.value.username, this.loginForm.value.password);
  }

  resetpass(email) {
    console.log(email)
    this.kinveyservice.resetpass(email);
  }

}
