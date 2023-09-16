import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'web-app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    public router: Router,
  ) { }

  targetGallery(){
    this.router.navigate(['/web/gallery'])
    .then(() => {
      window.location.reload();
    });
  }

  targetAbout(){
    this.router.navigate(['/web/about-us'])
    .then(() => {
      window.location.reload();
    });
  }
}
