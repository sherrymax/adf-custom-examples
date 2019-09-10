#### Develop a Digital Process Workspace solution for uploading content directly to ACS without storing the uploaded content in APS.

### Use-Case / Requirement
The documents uploaded as part of process instances should not be stored as part of APS process data. These documents should directly be uploaded to ACS.


### Prerequisites to run this demo end-2-end

* Alfresco Process Services (powered by Activiti) (Version 1.9 and above) - If you don't have it already, you can download a 30 day trial from [Alfresco Process Services (APS)](https://www.alfresco.com/products/business-process-management/alfresco-activiti).Instructions & help available at [Activiti Docs](http://docs.alfresco.com/activiti/docs/), [Alfresco BPM Community](https://community.alfresco.com/community/bpm)
* Alfresco Content Services (Version 6.1 or above)
* Application Development Framework (Version 2.6 or above)


## Configuration Steps

### Deploy APS Process
1. Import the [Standard-Chartered-Demo.zip](Standard-Chartered-Demo.zip) app into APS.
2. Process Flow. ![Process-Flow-1](Process-Flow-1.png) ![Process-Flow-2](Process-Flow-2.png)
3. Publish/Deploy the APS App.

### Create ACS Folder Template (Space Template)
1. Login to ACS.
2. Navigate to Repository > Data Dictionary > Space Templates (Follow steps in https://docs.alfresco.com/4.2/tasks/space-nodes-create.html)
3. Note the node id of the Space Template.

### Customize the ADF code
1. Add Custom code in `create-process.component.ts` to invoke the Space Template
```
createFolderFromTemplate(folderName: string, processId: string) {
    const url = 'slingshot/doclib/folder-templates';
    const localthis = this;
    this.alfrescoJsApi.getInstance().webScript.
            executeWebScript('POST', url, null, 'alfresco', 's', this.getRequestBody(folderName)).then(function (data) {
              const localData: any = data;
              localthis.updateProcessDetails(localData.persistedObject.split('Store/')[1], processId);
    }, function (error) {
        console.log('Error' + error);
    });
}
```

2. Update callback function `backFromProcessCreation()` to invoke `createFolderFromTemplate()`
```
backFromProcessCreation(event: any): void {
    console.log(event);
    this.createFolderFromTemplate(event.name, event.id);
}
```
3. Add custom HTML code to `task-details-container.component.html`

```
<div class="dw-template-container">
    <apw-task-toolbar id="apw-task-toolbar-id"
        [appName]="appName"
        [id]="taskDetails?.id"
        [name]="taskDetails?.name"
        [fileName]="'Task Audit -' + taskDetails?.id"
        (onBackClick)="onBackButtonClick()"
        (infoClick)="toggleInfoDrawer()"
        [selectedAction]="getToolBarActionName()"
        (onCloseClick)="oncloseIconClick()">
    </apw-task-toolbar>
    <div class="dw-template-content-container">
        <div class="dw-template-content">
            <div class="dw-template-fixed-content" fxHide.xs="{{showInfoDrawer}}">
                <ng-container *ngIf="isDetailsTabActive(); else task_activity">


                    <div style="padding-top:0px;" class="dw-template-fixed-content" fxHide.xs="{{showInfoDrawer}}">

                            <adf-info-drawer title="">

                                    <!-- Task Details -->
                                    <adf-info-drawer-tab label="Task Details">
                                            <apw-task-form id="apw-task-form-id"
                                                [taskDetails]="taskDetails"
                                                (taskFormName)="onTaskFormName($event)"
                                                [readOnlyForm]="readOnlyForm"
                                                (cancel)="onCancelForm($event)"
                                                (contentClicked)="onContentClick($event)"
                                                (formChange)="onFormChanged($event)"
                                                (formAttached)="onFormAttach()"
                                                (complete)="onCompleteTaskForm($event)"
                                                (executeNoFormOutcome)="onNoFormOutCome($event)"
                                                (formOutcomeExecute)="onFormOutcomeExecute($event)"
                                                (navigate)=onNavigate($event)>
                                            </apw-task-form>
                                    </adf-info-drawer-tab>

                                    <!-- Case Overview -->
                                    <adf-info-drawer-tab label="Case Overview" class="adf-tabs-drawer">
                                            <adf-process-instance-details   
                                                [processInstanceId]="processInstanceDetails.id">
                                            </adf-process-instance-details>
                                    </adf-info-drawer-tab>

                                    <!-- Documents -->
                                    <adf-info-drawer-tab label="Documents">
                                        <div align="right" >
                                                <adf-upload-button
                                                    [rootFolderId]="nodeId"
                                                    [multipleFiles]="true"
                                                    [versioning]="true"
                                                    (success)="refreshDocList($event)"
                                                    >
                                                </adf-upload-button>
                                        </div>
                                        <adf-dropdown-breadcrumb
                                            [target]="documentList"
                                            [folderNode]="documentList.folderNode"
                                            [rootId]="folderId">
                                        </adf-dropdown-breadcrumb>
                                        <div style="display: flex">
                                            <div style="flex: 0 0 70% ">
                                                <adf-upload-drag-area
                                                [parentId]="nodeId" (success)="refreshDocList($event)" >
                                                    <adf-document-list
                                                        #documentList
                                                        [currentFolderId]="folderId"
                                                        [contextMenuActions]="true"
                                                        [contentActions]="true"
                                                        (nodeClick)="setNodeId($event)"
                                                        (nodeDblClick)="setNodeId($event)"
                                                        (preview)="showPreview($event)" >
                                                        <content-actions>
                                                                <content-action
                                                                    target="document"
                                                                    title="Copy"
                                                                    permission="update"
                                                                    [disableWithNoPermission]="true"
                                                                    handler="copy">
                                                                </content-action>
                                                                <content-action
                                                                    target="document"
                                                                    title="Move"
                                                                    permission="update"
                                                                    [disableWithNoPermission]="true"
                                                                    handler="move">
                                                                </content-action>
                                                                <content-action
                                                                    target="document"
                                                                    title="Delete"
                                                                    handler="delete"
                                                                    permission="delete"
                                                                    >
                                                                </content-action>
                                                                <content-action
                                                                    target="document"
                                                                    title="Download"
                                                                    handler="download">
                                                                </content-action>
                                                                <content-action
                                                                    target="document"
                                                                    title="Lock"
                                                                    handler="lock">
                                                                </content-action>
                                                        </content-actions>
                                                    </adf-document-list>
                                                </adf-upload-drag-area>
                                            </div>
                                            <div style="height:100vh; padding-left: 10px;padding-right: 10px; flex: 0 0 20%" >

                                                <div style="padding-top:10px" >
                                                    <adf-info-drawer [title]="'Comments'">
                                                            <adf-info-drawer-tab [label]="'Comments'">
                                                                        <adf-comments
                                                                        [nodeId]="nodeId"
                                                                        [readOnly]="false">
                                                                        </adf-comments>
                                                            </adf-info-drawer-tab>
                                                    </adf-info-drawer>
                                                </div>
                                                <!--
                                                    <adf-info-drawer [title]="'Details'">
                                                            <adf-info-drawer-tab [label]="'Comments'">
                                                                        <adf-comments
                                                                        [nodeId]="nodeId"
                                                                        [readOnly]="false">
                                                                        </adf-comments>
                                                            </adf-info-drawer-tab>
                                                    </adf-info-drawer>
                                                -->
                                            </div>
                                        </div>
                                    </adf-info-drawer-tab>

                                    <!-- Case Notes -->
                                    <adf-info-drawer-tab label="Case Notes">
                                            <adf-process-instance-comments
                                                [processInstanceId]="processInstanceDetails.id"
                                                [readOnly]="false">
                                            </adf-process-instance-comments>
                                    </adf-info-drawer-tab>
                            </adf-info-drawer>
                    </div>


                </ng-container>
                <ng-template #task_activity>
                    <apw-task-attachment id="apw-task-attachment-id"
                        [taskDetails]="taskDetails"
                        (contentClicked)="onContentClick($event)">
                    </apw-task-attachment>
                </ng-template>
            </div>
            <ng-container *ngIf="showInfoDrawer && hasTaskDetails()">
                <div class="dw-template__sidebar">
                    <div class="dw-template-fixed-content">
                        <apw-task-sidebar id="apw-task-sidebar-id"
                            [appId]="appId"
                            [taskDetails]="taskDetails"
                            [taskFormName]="taskFormName"
                            [selectedTab]="selectedTab"
                            [readOnlyForm]="readOnlyForm"
                            (currentTab)="onSelectedTab($event)"
                            (updated)="onUpdatedTask()"
                            (formEdit)="onFormEdit()"
                            (claim)=onClaim($event)
                            (changeAssignee)=assignTaskToUser($event)>
                        </apw-task-sidebar>
                    </div>
                </div>
            </ng-container>
        </div>
    </div>
</div>
<adf-viewer #quickPreview
[(showViewer)]="showViewer"
[overlayMode]="true"
[fileNodeId]="nodeId">
</adf-viewer>
```

The updated ADF code is available [Standard-Chartered-Demo.zip](Standard-Chartered-Demo.zip).

### Run the DEMO

### References
1. https://docs.alfresco.com/4.2/tasks/tgs-spacetemplates.html
2. https://docs.alfresco.com/5.0/concepts/templated-nodes-intro.html
