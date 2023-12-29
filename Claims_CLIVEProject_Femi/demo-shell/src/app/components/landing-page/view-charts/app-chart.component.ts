import { Component, OnInit, ElementRef } from '@angular/core';
//import { Chart } from 'node_modules/@types/chart.js';
import { Chart } from 'chart.js';
//import { ProcessService, ProcessInstance, ProcessInstanceVariable,
//    ProcessDefinitionRepresentation, ProcessFilterParamRepresentationModel, TaskDetailsModel } from '@alfresco/adf-process-services';

 //   import { ProcessService, ProcessFilterParamRepresentationModel} from '@alfresco/adf-process-services';


@Component({
    selector: 'app-chart',
    templateUrl: './app-chart.component.html',
    styleUrls: [`./app-chart.component.scss`]
})


export class ChartComponent implements OnInit {

    constructor(private elementRef: ElementRef,
//        private processService: ProcessService,
//        private processFilter: ProcessFilterParamRepresentationModel
    ){};
    myChart:any;


//    Chart.register(...registerables);


    ngOnInit(){

        new Chart(this.elementRef.nativeElement.querySelector('#myChart'), {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
//               scales: {
 //                   y: {
 //                       beginAtZero: true
   //                 }
//               }
            }
        });

//        this.processFilter.appDefinitionId = 51;
//        this.processFilter.processDefinitionId = "Process_poolPersonalAutoIns:3:7834";

//        console.log(this.processService.getProcessInstances(this.processFilter));

    }


}
