import { Component, OnInit } from '@angular/core';
import {FileUploader} from 'ng2-file-upload'
import {ActivatedRoute} from '@angular/router'
import {Photo} from '../models/photo'

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {

  photos:Photo[]=[];
  uploader:FileUploader;
  hasBaseDropZoneOver: false;
  baseUrl='http://localhost:61061/api/';
  currentMain:Photo;
  currentCity:any;
  response: string;

  constructor(private activatedRoute:ActivatedRoute) {
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params=>{
      this.currentCity = params["cityId"]
      // let reallyNum = <string>this.currentCity;
      // alert(reallyNum);
    })

    this.uploader =new FileUploader({
      url:this.baseUrl +'cities/'+this.currentCity+'/photos',
      authToken: 'Bearer ' +localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType : ['image'],
      autoUpload:false,
      removeAfterUpload: true,
      maxFileSize:10*1024*1024
    });
    this.response = '';
    this.uploader.response.subscribe( res => this.response = res );

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) =>{
      if(response){
        const res :Photo = JSON.parse(response);
        const photo ={
          id:res.id,
          url:res.url,
          dateAdded:res.dateAdded,
          description:res.description,
          isMain:res.isMain,
          cityId:res.cityId
        }
        this.photos.push(photo)
      }
    }
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }




}
