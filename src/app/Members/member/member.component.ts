import { BackendService } from './../../backend.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


export interface IUser {
  _id: string
  name: string;
  password: string;
  salary: number
  role: string;
  totalExperience: Number,
  joinDate: Date,
}

export class User implements IUser {
  _id: string;
  name: string;
  password: string;
  salary: number;
  role: string;
  totalExperience: Number;
  joinDate: Date;

}

export class UserSubscription implements IUserSubscription {
  subscriptionAmount: number
  subscriptionEndDate: Date
  subscriptionStartDate: Date
  userID: string
}

export interface IUserSubscription {
  subscriptionAmount: number
  subscriptionEndDate: Date
  subscriptionStartDate: Date
  userID: string
}

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {


  public memberList: Array<User>;

  constructor(private backendService: BackendService, private router: Router) {

    backendService.getAllUsers().subscribe(res => {
      this.memberList = res.data;
      console.log(res);
    })
  }
  public logout() {
    localStorage.clear()
    this.backendService.User = null;
    this.router.navigateByUrl("/")
  }
  public viewSubscription(user: User) {
    console.log(user._id);
    this.backendService.getSubscriptionByID(user._id).subscribe((res) => {
      console.log(res)
      if (!res.data) {
        Swal.fire("No Subscription", "User has no subscription", "info");
        return;
      }
      var sub: UserSubscription = res.data;
      var sdt = this.convertDate(sub.subscriptionStartDate);
      var edt = this.convertDate(sub.subscriptionEndDate);
      Swal.fire({
        title: '<strong>Subscription Status</strong>',
        icon: 'info',
        html:
          `<div>
          <div>Name : ${user.name}</div>
          <div>Amount Paid : ${sub.subscriptionAmount}</div>
          <div>Subscription Start : ${sdt}</div>
          <div>Subscription End : ${edt}</div>
          </div>`
      })
    },
      err => {
        console.log(err)
      })
  }

  ngOnInit(): void {
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  }

  public async adduser() {
    var newUser: IUser = new User();
    const { value: formValues } = await Swal.fire({
      title: 'Multiple inputs',
      html:
        'Name : <input id="swal-input1" class="swal2-input"><br>' +
        'Salary : <input id="swal-input2" class="swal2-input" type="number"><br>' +
        `Role : <select id="swal-input3" name="cars">
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select><br>` +
        'Total Experience : <input id="swal-input4" class="swal2-input" type="number"><br>' +
        'Password : <input id="swal-input5" class="swal2-input" type="password" placeholder="Only for admin users" autocomplete="off"><br>' +
        'Join Date : <input id="swal-input6" class="swal2-input" type="date">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById('swal-input1')).value,
          (<HTMLInputElement>document.getElementById('swal-input6')).value,
          (<HTMLInputElement>document.getElementById('swal-input2')).value,
          (<HTMLInputElement>document.getElementById('swal-input3')).value,
          (<HTMLInputElement>document.getElementById('swal-input4')).value,
          (<HTMLInputElement>document.getElementById('swal-input5')).value
        ]
      }
    });

    newUser.name = formValues[0];
    newUser.joinDate = new Date(formValues[1]);
    try {
      newUser.salary = parseInt(formValues[2]);
    } catch (error) {

    }
    newUser.role = formValues[3];
    try {
      newUser.totalExperience = parseInt(formValues[4]);
    } catch (error) {

    }
    newUser.password = formValues[5];
    if(newUser.role=="admin"&&!newUser.password)
    {
      Swal.fire("Error","Admin users need an initial password","info")
      return;
    }
    console.log(newUser);
    this.backendService.CreateUser(newUser).subscribe(res => {
      console.log(res);
      Swal.fire("User Created", newUser.name + " user has been added", "info").then(() => {
        this.backendService.getAllUsers().subscribe(res => {
          this.memberList = res.data;
          console.log(res);
        })
      });
    },
      err => {
        console.log(err);
      })
  }

  public removeUser(user: User) {
    this.backendService.deleteUser(user._id).subscribe(res => {
      console.log(res)
      Swal.fire("User removed", user.name + " has been removed", "info").then(() => {
        this.backendService.getAllUsers().subscribe(res => {
          this.memberList = res.data;
          console.log(res);
        })
      });
    }, (err) => {
      console.log(err);
    })
  }
  public async addSubscription(user: User) {
    const { value: formValues } = await Swal.fire({
      title: 'Multiple inputs',
      html:
        'Subscription Start Date : <input id="swal-input1" class="swal2-input" type="date"><br>' +
        'Subscription End Date : <input id="swal-input2" class="swal2-input" type="date"><br>' +
        'Subscription Amount : <input id="swal-input3" class="swal2-input" type="number">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById('swal-input1')).value,
          (<HTMLInputElement>document.getElementById('swal-input2')).value,
          (<HTMLInputElement>document.getElementById('swal-input3')).value
        ]
      }
    });
    const sub: IUserSubscription = new UserSubscription();
    sub.subscriptionStartDate = new Date(formValues[0]);
    sub.subscriptionEndDate = new Date(formValues[1]);
    sub.subscriptionAmount = parseInt(formValues[2]);

    sub.userID = user._id;
    this.backendService.newSubscription(sub).subscribe((res) => {
      console.log(res);
      Swal.fire("Added", "Subscription successfully added", "info");
    }, err => {
      console.log(err);
      Swal.fire("Failed", "Subscription addition failed!", "error");
    });
  }
  public async deleteSubscription(user: User) {
    this.backendService.getSubscriptionByID(user._id).subscribe(res => {

      var subID = res.data._id;
      this.backendService.deleteSubscription(subID).subscribe(resInner => {

        Swal.fire("Subscription Removed", "Successfully removed " + user.name + "'s subscription", "info");
      }, errInner => { });
    }, err => { });

  }
}
