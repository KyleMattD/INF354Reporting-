import { Component} from '@angular/core';
import {Chart} from 'chart.js';
import {ReportServiceService} from './Service/report-service.service';
import { mergeMap, groupBy, map, reduce } from 'rxjs/operators';

import * as jsPDF  from 'jspdf'
import 'jspdf-autotable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularReporting';
  selectedOption:any;
  showErrorMessage: boolean =false;
  TableData: Object;
  chart: Chart;
  totalUnits: any;


  category :object = null;
  options =[
    {id:1 , data: "Beverages"},
    {id:2 , data: "Condiments"},
    {id:3 , data: "Confections"},
    {id:4 , data: "Dairy Products"},
    {id:5 , data: "Grains/Cereals"},
    {id:6 , data: "Meat/Poultry"},
    {id:7 , data: "Produce"},
    {id:8 , data: "Seafood"}
  ]
  selection:Number=8;

  constructor(private reporting:ReportServiceService){}

  random_rgba(){
    var a = Math.round, r = Math.random, s =255;
    return 'rgba(' + a(r()*s) + ',' + a(r()*s) + ',' + a(r()*s) + ', 0.7)';
  }

  downloadRequest(){
    this.reporting.generateReportData(this.selectedOption).subscribe((res) =>{
      var doc = new jsPDF();

      var pageHeight = doc.internal.pageSize.height || doc.internal.getHeight();
      var pageWidth = doc.internal.pageSize.width || doc.internal.getWidth();


      let length = res['TableData'].length;
      let names = res['TableData'].map(a => a.Name);
      let amount = res['TableData'].map(a=> a.Amount);

      let finalY=160;
      var newCanvas = <HTMLCanvasElement>document.querySelector('#canvas');
      var newCanvasImg = newCanvas.toDataURL("image/png",1.0);

      doc.setFontSize(40);

      doc.text("Product Report",(pageWidth/2)-15,15);
      doc.addImage(newCanvasImg,'PNG',25,25,160,150);
      doc.setFontSize(14)
      for(let i=0; i< length; i++)
      {
        doc.text(names[i]+"(Amounts:"+ amount[i]+"%)",(pageWidth/2)-25, finalY+23)
        doc.autotable({startY:finalY+25, html:'#testing'+i, useCss:true,head:[
          ['Product', 'Amount']
        ]})
        finalY=doc.autotable.previous.finalY;
      }
      doc.save('table.pdf');
    })
  }

submitRequest(){
  if(this.chart) this.chart.destroy();

  if(this.selectedOption ==undefined)
  {
    this.showErrorMessage=true;
  }
  else
  {
    this.showErrorMessage=false;
    this.reporting.generateReportData(this.selectedOption).subscribe(response =>{
      console.log(response);
    this.TableData=response['TableData']

      let keys = response['ChartData'].map(p=>p.Name);
      let values = response['ChartData'].map(p=> p.Amount);

      let totUnits = response['TableData'].map(p=>p.Amount);
      const sum = totUnits.Amount((a,b)=> a+b,0)
      this.totalUnits = sum;


      this.chart = new Chart('canvas',{
        type: 'bar',
        data:{
          labels:keys,
          datasets:[
            {
              label: "Units in stock per product",
              data:values,
              bordercolor: "grey",
              fill: false,
              backgroundColor:[
                this.random_rgba(),
                this.random_rgba(),
                this.random_rgba(),
                this.random_rgba()
              ]
            }
          ]
        },
        options:{
          legend:{
            display:false,
          },
          title: {
            display:true,
            text:"Number of units per product in each category"
          },
          scales:{
            xAxes:[{
              display:true,
              barPercentage:0.75
            }],
            yAxes: [{
              display: true,
              ticks:{
                min:0,
                max:500
              }
            }]
          }
        }
      })
    });
  }
}

}

