import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

declare var particlesJS: any;
@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  public isCollapsed = true;
  message = "Loading..."

  constructor(private router: Router) { }

  ngOnInit() {

    particlesJS.load('particles-js', 'assets/particles1.json', function(){
      let el = document.querySelector(".particles-js-canvas-el"); 
      el.setAttribute("background", "#191181");
    });

    var html = document.getElementsByTagName("html")[0];
    html.classList.add("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  ngOnDestroy() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.remove("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-default");
  }
}
