/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, ViewEncapsulation, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { LogService, StorageService } from '@alfresco/adf-core';
// import { AppConfigService, LogService, StorageService } from '@alfresco/adf-core';
// import { GlobalVariables } from '../global-values/globals';
// import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { StyleManager } from '../theme-picker/style-manager/style-manager';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

    @ViewChild('alfrescologin', { read: true, static: false })

    customSuccessRouteURI = '/home';
    customLogoImageURL = './assets/images/alfresco-logo.svg';
    copyrightText = '\u00A9 2022 Alfresco Software, Inc. All Rights Reserved.';
    alfrescoJsApi: any = null;

    providers = 'ALL';
    customValidation: any;
    customMinLength = 2;

    disableCsrf = false;
    showFooter = true;
    showRememberMe = true;
    customSuccessRoute = false;
    customLogoImage = false;

    // constructor(private router: Router,
    //     private logService: LogService) {
    // }

    constructor(private router: Router,
        private logService: LogService,
        private storageService: StorageService,
        private styleManager: StyleManager
        // private appConfigService: AppConfigService,
        // private globalValues: GlobalVariables
        ) {
        // this.alfrescoJsApi = new AlfrescoApi({ provider: 'BPM', hostBpm: this.appConfigService.get('bpmHost') });
        this.customValidation = {
            username: ['', Validators.compose([
                Validators.required,
                Validators.minLength(this.customMinLength)
            ])],
            password: ['', Validators.required]
        };
    }

    onLogin() {
        // this.getUserRoles();
        // this.router.navigate(['/home']);
        this.router.navigate(['/files']);
        this.setDefaultTheme();
        // this.router.navigate(['/files']);
        console.dir(this);
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

    validateForm($event: any) {
        console.dir($event);
    }

    // getUserRoles() {
    //     const groupsMap = new Map();
    //     this.alfrescoJsApi = new AlfrescoApi({ provider: 'BPM', hostBpm: this.appConfigService.get('bpmHost') });

    //     var userId = this.storageService.getItem('USER_PROFILE');
    //     console.log('Logged In User == ' + userId);

    //     this.alfrescoJsApi.bpmClient.callApi('/api/enterprise/profile', 'GET',
    //         {}, {}, {}, {}, {}, ['application/json', 'Authorization: Basic ZGVtbzpkZW1v'], ['application/json']).then((res: any) => {
    //             this.globalValues.loggedInUserFullName = res.fullname;
    //             console.log('User Full Name = ' + res.fullname);
    //             console.dir(res.groups);

    //             res.groups.forEach(element => {
    //                 groupsMap.set(element.name, element.name);
    //             });

    //             console.dir(groupsMap);
    //         });

    //     this.globalValues.userGroupMap = groupsMap;
    // }

    setDefaultTheme(){
        var theme = '{"primary":"#2196f3","accent":"#ff9800","name":"ECM Blue Orange","href":"adf-blue-orange.css","isDark":false}';
        this.storageService.setItem("docs-theme-storage-current", theme);
        this.styleManager.setStyle('theme',JSON.parse(theme).href);

        console.log('*** THEME SET ***');
    }


    // setStyle(key: string, href: string) {
    //     const linkEl = document.head.querySelector(`link[rel="stylesheet"].${this.getClassNameForKey(key)}`);
    //     if(linkEl == null){
    //         document.createElement('link');
    //     }
    //     linkEl.setAttribute('rel', 'stylesheet');
    //     linkEl.setAttribute('type', 'text/css');
    //     linkEl.setAttribute('href', href);

    //     linkEl.classList.add(this.getClassNameForKey(key));
    //     document.head.appendChild(linkEl);
    //     return linkEl;
    // }

    // getClassNameForKey(key: string) {
    //     return `style-manager-${key}`;
    // }
}
