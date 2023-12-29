//import { Component, OnInit, Optional, Input} from '@angular/core';

import { Component, OnInit} from '@angular/core';
//import { Router } from '@angular/router';
//import { ActivatedRoute, Params } from '@angular/router';

//const DEFAULT_FOLDER_TO_SHOW = '-my-';


@Component({
    selector: 'app-case-actions',
    templateUrl: './case-action.component.html',
    styleUrls: [`./case-action.component.css`]
})


export class CaseActionsComponent implements OnInit{

 //   @Input()
//    currentFolderId: string = DEFAULT_FOLDER_TO_SHOW;

 //   constructor( @Optional() private route: ActivatedRoute){};

    ngOnInit(): void {
 /*       if(this.route)
        {
            this.route.params.forEach((params: Params) => {
                if (params['id'] && this.currentFolderId !== params['id']) {
                    this.currentFolderId = params['id'];
                    console.log("params: " +  params + ", FolderID :" + this.currentFolderId )
                }
            });
        }*/
    }
}
