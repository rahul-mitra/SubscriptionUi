import { BackendService } from './backend.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SubscriptionUi';

  username: string;
  password: string;



  public get router(): Router {
    return this._router
  }


  constructor(private backendService: BackendService, private _router: Router) {

    if (localStorage.getItem("user")) {
      this.backendService.User = JSON.parse(localStorage.getItem("user"));
      this._router.navigateByUrl("/members");
    }
  }
  public validateUser() {
    this.backendService.ValidateLogin(this.username, this.password).subscribe(res => {
      console.log("login response", res);
      if (res.allowLogin) {
        this.backendService.User = res.data;
        localStorage.setItem("user", JSON.stringify(res.data));
        this._router.navigateByUrl("/members");
      }
      else
        alert("User not found or incorrect password")
    },
      err => {
        console.log("error ", err)
      });
  }
}
