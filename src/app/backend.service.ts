import { User, UserSubscription } from './Members/member/member.component';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public mainApi: string = "http://localhost:8080/api/";
  public validationAPIURL = `${this.mainApi}users/validateUser`;
  public createUserAPIURL = `${this.mainApi}users`;
  public updateUser = `${this.mainApi}users/updateUsers`;
  public getAllusersAPIURL = `${this.mainApi}users`;
  public deleteUserAPIURL = `${this.mainApi}users/deleteUser`;
  public deleteSubscriptionAPIURL = `${this.mainApi}subscription/deleteSubscription`
  public getSubscription = `${this.mainApi}subscription/`
  public User: User = null;
  constructor(private httpClient: HttpClient) {


  }


  public getAllUsers(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.get<any>(this.getAllusersAPIURL, httpOptions);
  }

  public getSubscriptionByID(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.get<any>(this.getSubscription + id, httpOptions);
  }

  public newSubscription(sub: UserSubscription): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<any>(this.getSubscription, sub, httpOptions);
  }
  public  deleteSubscription(subscriptionID: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
      var body = {
        subscription_id: subscriptionID
      }

      return this.httpClient.post<any>(this.deleteSubscriptionAPIURL, body, httpOptions);
  }
  public deleteUser(userID: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    var body = {
      user_id: userID
    }

    return this.httpClient.post<any>(this.deleteUserAPIURL, body, httpOptions);
  }

  public UpdateUser(user_id: string, username: string, password: string, joindate: any = Date.now(), totalExperience: number = 0, salary: number = 0, role: string = "member"): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var body = {
      user_id: user_id,
      user: {
        name: username,
        role: role,
        salary: salary,
        totalExperience: totalExperience,
        joinDate: joindate,
        password: password
      }
    }
    return this.httpClient.put<string>(this.updateUser, body, httpOptions);
  }

  public ValidateLogin(username: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var body = {
      name: username,
      password: password
    }
    return this.httpClient.post<any>(this.validationAPIURL, body, httpOptions);
  }


  public CreateUser(user: User): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.post<string>(this.createUserAPIURL, user, httpOptions);
  }
}
