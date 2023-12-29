/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {  AppConfigService, LogService } from '@alfresco/adf-core';
import { AlfrescoApi } from '@alfresco/js-api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

    customSuccessRouteURI = '/home';
    customLogoImageURL = './assets/images/logo.png';

//Added variables
    alfrescoJsApi: any = null;
    contextRoot = '';


    disableCsrf = false;
    showFooter = true;
    showRememberMe = true;
    customSuccessRoute = false;
    customLogoImage = false;

    constructor(private router: Router,
                private appConfigService: AppConfigService,
                private logService: LogService) {

        this.alfrescoJsApi = new AlfrescoApi({ contextRoot: this.contextRoot, provider: 'ECM', hostEcm: this.appConfigService.get('ecmHost') });
    }

    onLogin() {
    //    this.userAuth();
    //    this.router.navigate(['/home']);
        this.router.navigate(['/landing-page']);
    }

    onError(err: any) {
        this.logService.error(err);
    }

    toggleCSRF() {
        this.disableCsrf = !this.disableCsrf;
    }

    toggleFooter() {
        this.showFooter = !this.showFooter;
    }

    toggleRememberMe() {
        this.showRememberMe = !this.showRememberMe;
    }

    toggleSuccessRoute() {
        this.customSuccessRoute = !this.customSuccessRoute;
        if (!this.customSuccessRoute) {
            this.customSuccessRouteURI = null;
        }
    }

    toggleLogo() {
        this.customLogoImage = !this.customLogoImage;
        if (!this.customLogoImage) {
            this.customLogoImageURL = null;
        }
    }

  /*  userAuth()
    {
        this.alfrescoJsApi.ecmClient.callApi();
        console.log("here");

    } */
}
