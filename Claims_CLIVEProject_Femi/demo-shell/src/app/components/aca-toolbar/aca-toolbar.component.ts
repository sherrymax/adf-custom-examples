import { Component, OnInit, Output } from "@angular/core";
import { EventEmitter } from "node_modules_backup/@angular/core";


@Component({
    selector: 'aca-toolbar',
    templateUrl: './aca-toolbar.component.html',
    styleUrls: ['./aca-toolbar.component.scss'],
})

export class AcaToolbarComponent implements OnInit
{
        collapsed = true;

        @Output() featureSelected = new EventEmitter<string>();

        constructor(){};

        ngOnInit(){

        }

        onSelect(feature: string){
            this.featureSelected.emit(feature);
        }

}
