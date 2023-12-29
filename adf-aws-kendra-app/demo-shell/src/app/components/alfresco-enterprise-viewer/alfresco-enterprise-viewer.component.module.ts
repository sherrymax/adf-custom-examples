// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Routes } from '@angular/router';
// import { CoreModule } from '@alfresco/adf-core';
// import { ContentDirectiveModule } from '@alfresco/adf-content-services';
// import { DirectivesModule } from '../../directives/directives.module';
// import { AppInfoDrawerModule } from '../info-drawer/info.drawer.module';
// import { CoreExtensionsModule } from '../../extensions/core.extensions.module';
// import { AppToolbarModule } from '../toolbar/toolbar.module';
// import { AlfrescoEnterpriseViewerComponent } from './alfresco-enterprise-viewer.component';
// import { AevViewerComponent } from './aev-viewer.component';

// const routes: Routes = [
//   {
//     path: '',
//     data: {
//       title: 'APP.PREVIEW.TITLE',
//       navigateMultiple: true
//     },
//     component: AlfrescoEnterpriseViewerComponent
//   }
// ];

// @NgModule({
//   imports: [
//     CommonModule,
//     RouterModule.forChild(routes),
//     CoreModule.forChild(),
//     ContentDirectiveModule,
//     DirectivesModule,
//     AppInfoDrawerModule,
//     CoreExtensionsModule.forChild(),
//     AppToolbarModule
//   ],
//   declarations: [AlfrescoEnterpriseViewerComponent],
//   exports: [AlfrescoEnterpriseViewerComponent]
// })
// export class AlfrescoEnterpriseViewerModule {}

// @NgModule({
//   imports: [],
//   exports: [AevViewerComponent],
//   declarations: [AevViewerComponent],
//   providers: [],
// })

// export class AevViewerComponentModule {
// }


import { ExtensionService } from '@alfresco/adf-extensions';
import { AlfrescoEnterpriseViewerComponent } from './alfresco-enterprise-viewer.component';

export class AlfrescoEnterpriseViewerModule {
  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'alfresco-enterprise-viewer.component': AlfrescoEnterpriseViewerComponent
    });
  }
}
