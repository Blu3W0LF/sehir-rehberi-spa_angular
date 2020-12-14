import { Injectable } from "@angular/core";
import { LoginUser } from "../models/loginUser";
import { HttpHeaders, HttpClient, HttpErrorResponse } from "@angular/common/http";
// import { JwtHelper, tokenNotExpired } from "angular2-jwt";
import { Router } from "@angular/router";
import { AlertifyService } from "./alertify.service";
import { RegisterUser } from "../models/registerUser";
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private alertifyService: AlertifyService
  ) {}
  path = "http://localhost:61061/api/auth/";
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY="token"

  login(loginUser: LoginUser){
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    this.httpClient.post<LoginUser>(this.path + "login", loginUser, { headers: headers }).pipe(
      tap(data => console.log(JSON.stringify(data))), //---> Loglama
      catchError(this.handleError)                    //---> Hata Yakalama
    
    ).subscribe(data => {
      this.saveToken(data);
      this.userToken = data;
      this.decodedToken = this.jwtHelper.decodeToken(data.toString());
      this.alertifyService.success("Sisteme giriş yapıldı");
      //this.router.navigateByUrl("/city");
    });
  }

  register(registerUser: RegisterUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    this.httpClient
      .post(this.path + "register", registerUser, { headers: headers })
      .subscribe(data=>{
        
      });
  }

  saveToken(token) {
    
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logOut(){
    localStorage.removeItem(this.TOKEN_KEY)
    this.alertifyService.error("Sistemden çıkış yapıldı");
  }

  loggedIn(){
    //return tokenNotExpired(this.TOKEN_KEY)
    //return this.jwtHelper.getTokenExpirationDate(this.TOKEN_KEY);
    return localStorage.getItem(this.TOKEN_KEY);
    
  }

  get token(){
    return localStorage.getItem(this.TOKEN_KEY);
  }

 
  getCurrentUserId(){
    return this.jwtHelper.decodeToken(this.token).nameid
  }

  // Hata Mesajı Yakalama ve yakalanın hatanın Event'dan kaynaklanan ve ta sistemsel olup olmadığının Kontrolu
  handleError(err: HttpErrorResponse) {
    let errMsg = ''
    if (err.error instanceof ErrorEvent) {
        errMsg = 'Bir Hata Oluştu' + err.error.message
    } else {
        errMsg = 'Sisyemsel bir hata'
    }
    return throwError(errMsg);
  }

}
