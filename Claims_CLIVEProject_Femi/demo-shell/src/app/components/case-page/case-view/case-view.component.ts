import { Component, OnInit} from '@angular/core';
import {
    CardViewTextItemModel,
    CardViewDateItemModel
        } from '@alfresco/adf-core'
//import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-case',
    templateUrl: './case-view.component.html',
    styleUrls: [`./case-view.component.scss`]
})

export class CaseComponent implements OnInit{

    properties: any;
    displayedColumns: string[] = ['item', 'cost'];


    constructor(){
        this.createCard();
    };

    ngOnInit(): void {
/*
        if(this.route)
        {
            this.route.params.forEach((params: Params) => {
                if (params['id'] && this.currentFolderId !== params['id']) {
                    this.currentFolderId = params['id'];
                    console.log("params: " +  params + ", FolderID :" + this.currentFolderId )
                }
            });
        }
*/
    }

    createCard() {

        console.log();


        this.properties = [
            new CardViewTextItemModel({
                label: 'Claim Number',
                value: '12345',
                key: 'name',
                default: 'default bar',
                multiline: false,
                icon: 'icon',
                editable: false
            }),
            new CardViewTextItemModel({
                label: 'Policy Number',
                value: '54321',
                key: 'name',
                default: 'default bar',
                multiline: false,
                icon: 'icon',
                editable: false
            }),
            new CardViewTextItemModel({
                label: 'Insured Name',
                value: 'Johnny Quest',
                key: 'name',
                default: 'default bar',
                multiline: false,
                icon: 'icon',
                editable: false
            }),
            new CardViewTextItemModel({
                label: 'Acccount Name',
                value: 'Quest Family',
                key: 'name',
                default: 'default bar',
                multiline: false,
                icon: 'icon',
                editable: false
            }),
            new CardViewDateItemModel({
                label: 'Date of Loss',
                value: new Date(1983, 11, 24, 10, 0, 30),
                key: 'date',
                default: new Date(1983, 11, 24, 10, 0, 30),
                format: 'shortDate',
                editable: false
            })





        ];
    }

}
