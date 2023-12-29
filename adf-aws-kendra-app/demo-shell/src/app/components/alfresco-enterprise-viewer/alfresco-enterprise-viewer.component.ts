import { Component, Input, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { ViewerExtensionInterface } from '@alfresco/adf-extensions';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConfigService } from '@alfresco/adf-core';
import { ActivatedRoute } from '@angular/router';
import { NodesApiService } from '@alfresco/adf-content-services';

// import { NodesApiService } from '@alfresco/adf-core';
// import { AlfrescoApiService } from '@alfresco/adf-core';
import { Location } from '@angular/common';

@Component({
  selector: 'alfresco-enterprise-viewer',
  templateUrl: './alfresco-enterprise-viewer.component.html',
  styleUrls: ['./alfresco-enterprise-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlfrescoEnterpriseViewerComponent implements ViewerExtensionInterface, OnInit {


  /* Required for Viewer Extension Interface */
  @Input() nodeId: string;

  url: string;
  nameFile: string;
  node: Node;
  isPreset: false;
  isCommentEnabled: false;
  multi = false;
  customPreset: string = null;
  isReadOnly = false;
  displayDefaultProperties = true;
  showAspect: string = null;
  displayEmptyMetadata = false;


  /* Alfresco Enterprise Viewer Code Below */
  AEV_APP_CONFIG_KEY: string = 'alfresco-enterprise-viewer';

  sanitizedAevUrl: SafeResourceUrl;
  documentIdPrefix: string;
  aevConfig: any;
  folderId: any;
  versionId: any;

  // ================ CUSTOM CODE ================
  @Input()
  showViewer = true;
  @Output()
  showViewerChange = new EventEmitter<boolean>();

  constructor(
    private sanitizer: DomSanitizer,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    // private router: Router,
    private location: Location,
    // private nodesApi: NodesApi,
    private nodesApiService: NodesApiService
    // private apiService: AlfrescoApiService
  ) { }

  ngOnInit() {
    this.aevConfig = this.appConfigService.config[this.AEV_APP_CONFIG_KEY];

    

    
    this.route.params.subscribe((params) => {
      this.folderId = params.folderId;
      const { nodeId } = params;

      if (nodeId) {
        console.log("Node ID = " + nodeId);

        this.nodesApiService.getNode(nodeId).subscribe((node) => {
          setTimeout(() => {
            this.node = node;

            console.log("Node Name = " + this.node.name);
            console.log("Node Mime Type = " + this.node.content.mimeType);

            this.setViewerUrl();
          }, 500);
        });
      }
    });

  
    console.log("NODE ID >>> ", this.nodeId);
    console.dir(this.route);

    // this.nodesApiService.getNode(this.nodeId, {}).subscribe((node) => {
    //   setTimeout(() => {
    //     this.node = node;

    //     console.log("Node Name = " + this.node.name);
    //     console.log("Node Mime Type = " + this.node.content.mimeType);

    //     this.setViewerUrl();
    //   }, 500);
    // });

  }


  setViewerUrl(): void {

    console.log(">>>> START OF setViewerUrl() <<<<<");

    let supportedDocTypes = this.aevConfig.properties.supportedMimetypes.documents;
    let supportedVideoTypes = this.aevConfig.properties.supportedMimetypes.videos;

    if (supportedVideoTypes.indexOf(this.node.content.mimeType) !== -1) {
      this.sanitizedAevUrl = this.getAEVUrlForVideo();
    }
    else if (supportedDocTypes.indexOf('*') !== -1 || supportedDocTypes.indexOf(this.node.content.mimeType) !== -1) {
      this.sanitizedAevUrl = this.getAEVUrl();
    }
    else {
      console.log("Cannot find a matched MIME TYPE >>>")
    }

    console.log("this.sanitizedAevUrl = " + this.sanitizedAevUrl);

  }

  getAEVUrl(): SafeResourceUrl {

    console.log("*** START OF getAEVUrl() ***");

    // update the src of the iframe to AEV's external authorization passing
    // the user login, ticket, and the id of the selected document

    //console.log("this.aevConfig.properties.endpoints.aev >> "+this.aevConfig.properties.endpoints.aev);


    let aevDocumentUrl =
      this.aevConfig.properties.endpoints.aev + // assuming AEV is on same server as ADF
      '/login/external.htm?' +
      'docId=' +
      this.aevConfig.properties.alfrescoDocumentStorePrefix +
      this.node.id +
      '&username=' +
      localStorage.getItem('ACS_USERNAME') +
      '&ticket=' +
      localStorage.getItem('ticket-ECM');

      console.log(">>> aevDocumentUrl >>>", aevDocumentUrl);
      console.log(this.sanitizer.bypassSecurityTrustResourceUrl(aevDocumentUrl));



    return this.sanitizer.bypassSecurityTrustResourceUrl(aevDocumentUrl);
  }

  getAEVUrlForVideo(): SafeResourceUrl {

    console.log("*** START OF getAEVUrlForVideo() ***");

    // update the src of the iframe to AEV's external authorization passing
    // the user login, ticket, and the id of the selected document
    let aevDocumentUrl =
      this.aevConfig.properties.endpoints.aevVideo + // assuming AEV is on same server as ADF
      '/#/login?' +
      'docName=' +
      encodeURIComponent(this.node.name) +
      '&docId=' +
      this.aevConfig.properties.alfrescoDocumentStorePrefix +
      this.node.id +
      '&username=' +
      localStorage.getItem('ACS_USERNAME');

    // for auth we need to set the cookie before we return
    document.cookie =
      'ticket' + '=' + localStorage.getItem('ticket-ECM') + ';' + 'path=/';

    console.log(">>> aevDocumentUrl >>>", aevDocumentUrl);

    return this.sanitizer.bypassSecurityTrustResourceUrl(aevDocumentUrl);
  }


  onBackButtonClick() {
    console.log('>>> CLOSE BUTTON CLICKED..');

    this.close();
  }

  close() {
    this.showViewer = false;
    this.showViewerChange.emit(this.showViewer);
    console.log('CLOSE BUTTON CLICKED..');
    this.location.back();
    //this.router.navigate(['/favorite/libraries/', this.node.parentId]);
  }

  /*
  getAEVUrlByNodeId(nodeId): SafeResourceUrl{
    this.aevConfig = this.appConfigService.config[this.AEV_APP_CONFIG_KEY];

    if (nodeId) {
      console.log("Node ID = " + nodeId);

      this.nodeService.getNode(nodeId).subscribe((node) => {
        setTimeout(() => {
          this.node = node;

          console.log("Node Name=" + this.node.name);
          console.log("Node Mime Type=" + this.node.content.mimeType);

          this.setViewerUrl();
        }, 1000);

      });

    }

    return this.sanitizedAevUrl;
  }
  */

}


