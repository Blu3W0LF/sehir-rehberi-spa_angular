import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { City } from "../models/city";
import { Photo } from "../models/photo";
import { tap, catchError } from 'rxjs/operators';       //---> Ekleniyor
import { AlertifyService } from "./alertify.service";

@Injectable({
  providedIn: "root"
})
export class CityService {

  city: City;

  constructor(
    private httpClient: HttpClient,    
    // private alertifyService:AlertifyService,
    // private activatedRoute:ActivatedRoute,
    // private cityService:CityService,
    ) {}
  path = "http://localhost:61061/api/";

  getCities(): Observable<City[]> {
    return this.httpClient.get<City[]>(this.path + "cities");
  }
  getCityById(cityId):Observable<City>{
    return this.httpClient.get<City>(this.path+"cities/detail/?id="+cityId)
  }

  getPhotosByCity(cityId):Observable<Photo[]>{
    return this.httpClient.get<Photo[]>(this.path + "cities/photos/?cityId="+cityId);
  }

 add(city: City): Observable<City>{
  return this.httpClient.post<City>(this.path + 'cities/add',city).pipe(
    tap(data => console.log(JSON.stringify(data))), //---> Loglama
    
    catchError(this.handleError)
      // this.router.navigateByUrl('/cityDetail/'+data["id"])
    );
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
