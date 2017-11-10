import { AfterViewInit, Component, ElementRef } from '@angular/core';

declare const gapi: any;

const CLIENT_ID = '529258741380-bdvaq5l3bd3o1a60opija08s283dbpp4.apps.googleusercontent.com';

@Component({
  selector: 'google-signin',
  template: '<button id="googleBtn">Google Sign-In</button>',
})

export class GoogleSigninComponent implements AfterViewInit {

  auth2: any;

  private scope = 'profile email';

  constructor(private element: ElementRef) {}

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: CLIENT_ID,
        cookiepolicy: 'single_host_origin',
        scope: this.scope
      });
      this.attachSignin(this.element.nativeElement.firstChild);
    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE
      },  (error) => {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

  ngAfterViewInit() {
    this.googleInit();
  }
}
