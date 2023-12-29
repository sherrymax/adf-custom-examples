import { Component, OnInit, AfterViewInit } from '@angular/core';
//import { Router } from '@angular/router';
//import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
//import { AppConfigService, StorageService } from '@alfresco/adf-core';
//import { FormControl, FormGroup } from '@angular/forms';
//import { GlobalVariables } from '../global-values/globals';
//import { SearchBarComponent } from '../search/search-bar.component';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { ThumbnailService } from '@alfresco/adf-core';
//import { SearchService } from '@alfresco/adf-content-services';
//import { AcaToolbarComponent } from '../aca-toolbar/aca-toolbar.component';
//import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls:['./landing-page.component.scss']
})

export class LandingPageComponent implements OnInit, AfterViewInit {

    loadedFeature = 'landing-page';

    searchedWord="";

    constructor(public thumbnailService: ThumbnailService ){
    }

    ngOnInit() {
//        this.getCustomerAppConfValues();
//        this.getProcessDefinitionIdsByAppId();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            //   this.welcomeMessage = "Welcome " + this.globalValues.loggedInUserFullName + " !";
//            this.welcomeMessage = 'Welcome !';
        }, 500);
    }

    onItemClicked($event)
    {
        console.log($event);
    }
    onSearchSubmit($event)
    {
        console.log($event);
    }

    getMimeTypeIcon(node: MinimalNodeEntity): string {
        let mimeType;

        if (node.entry.content && node.entry.content.mimeType) {
            mimeType = node.entry.content.mimeType;
        }
        if (node.entry.isFolder) {
            mimeType = 'folder';
        }

        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    onNavigate(feature: string)
    {
        console.log(feature);
        this.loadedFeature = feature;
//        this.router2.navigate(["/"+feature]);



    }
}
