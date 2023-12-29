import { Component, OnInit, Optional, Input, ViewChild, ElementRef} from '@angular/core';
//import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

const DEFAULT_FOLDER_TO_SHOW = '-my-';

import { DocumentListComponent } from '@alfresco/adf-content-services';

@Component({
    selector: 'app-case-page',
    templateUrl: './case-page.component.html',
    styleUrls: [`./case-page.component.css`]
})


export class CasePageComponent implements OnInit{

    @Input()
    currentFolderId: string = DEFAULT_FOLDER_TO_SHOW;

    @Input()
    showViewer = false;

    @ViewChild('documentList', {static: true})
    documentList: DocumentListComponent;

    nodeId: string;
    isOverlay = false;



    constructor( @Optional() private route: ActivatedRoute, private elref: ElementRef){};

    ngOnInit(): void {
        if(this.route)
        {
            this.route.params.forEach((params: Params) => {
                if (params['id'] && this.currentFolderId !== params['id']) {
                    this.currentFolderId = params['id'];
                    this.documentList.currentFolderId = params['id'];
                    console.log("params: " +  params + ", FolderID :" + this.currentFolderId )
                }
            });
        }
    }

    toggleOverlay() {
        this.isOverlay = !this.isOverlay;
    }

    showPreview(event) {
        if (event.value.entry.isFile) {
            this.nodeId = event.value.entry.id;
            this.showViewer = true;
        }

        console.log('element ' + this.elref.nativeElement);
//        var cases = this.elref.nativeElement.querySelector('casefiles');
          var cases = document.getElementById('casefiles');
        console.log('element ' + cases);
        cases.classList.remove("col-md-12");
        cases.classList.add("col-md-6");
        var docview = document.getElementById('docviewer');
        docview.classList.remove("col-md-0");
        docview.classList.add("col-md-4");
       // var docview = document.getElementById('docviewer');

    }
}
