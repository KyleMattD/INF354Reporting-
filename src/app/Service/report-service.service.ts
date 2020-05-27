import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  apiURL: string ='https://localhost:44359/api/';

  constructor(private _http:HttpClient) { }

  generateReportData(selectedOption: number){
    return this._http.get(this.apiURL+"Reports/getReportingData?categorySelection="+selectedOption).pipe(map(result => result));
  }
  // downloadReports(selection, type){
  //   return this._http.get("http://localhost:4200/api/NWAPI/downloadReport?categorySelection"+selection+"&type"+type,{responseType:"blob"});
  // }

}
