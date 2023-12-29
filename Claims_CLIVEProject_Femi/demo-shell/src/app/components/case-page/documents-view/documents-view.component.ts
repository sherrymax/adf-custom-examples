import { Component, Input, OnInit, Optional, EventEmitter, ViewChild,  Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MinimalNodeEntity, NodePaging, Pagination } from '@alfresco/js-api';
import {
    AlfrescoApiService, AuthenticationService, AppConfigService, AppConfigValues, NotificationService,
    DataRow, UserPreferencesService,
    PaginationComponent,  DisplayMode, ShowHeaderMode, InfinitePaginationComponent

} from '@alfresco/adf-core';


import {
    DocumentListComponent,
    PermissionStyleModel,
    FilterSearch
} from '@alfresco/adf-content-services';


import { Subject } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
import { PreviewService } from 'demo-shell/src/app/services/preview.service';

const DEFAULT_FOLDER_TO_SHOW = '-favorites-';


@Component({
    selector: 'app-documents-view',
    templateUrl: './documents-view.component.html',
    styleUrls: [`./documents-view.component.scss`]
})

export class DocumentsViewComponent implements OnInit{

    protected onDestroy$ = new Subject<boolean>();

    errorMessage: string = null;
//    nodeId: any;
    //showViewer = true;
 //   showViewer1 = true;
    //showVersions = false;
    allowDropFiles = true;
    displayMode = DisplayMode.List;
    offerLetter = false;
    includeFields = ['isFavorite', 'isLocked', 'aspectNames', 'definition','isLink','association'];

    baseShareUrl = (
        this.appConfig.get<string>(AppConfigValues.BASESHAREURL) ||
        this.appConfig.get<string>(AppConfigValues.ECMHOST)) + '/preview/s/';

    toolbarColor: ThemePalette;

    selectionModes = [
        { value: 'none', viewValue: 'None' },
        { value: 'single', viewValue: 'Single' },
        { value: 'multiple', viewValue: 'Multiple' }
    ];

    // The identifier of a node. You can also use one of these well-known aliases: -my- | -shared- | -root-
    @Input()
    currentFolderId: string = DEFAULT_FOLDER_TO_SHOW;
    defaultNodeId: string = null;
    currentFolderName: string = null;

    @Input()
    showViewer = true;

    @Input()
    sorting = ['name', 'ASC'];

    @Input()
    sortingMode: 'server' | 'client' = 'server';


    @Input()
    maxSizeShow = false;

    @Input()
    showVersionComments = true;


    @Input()
    pagination: Pagination;

    @Input()
    disableDragArea = false;

    @Input()
    showNameColumn = true;

    @Input()
    searchTerm = '';

    @Input()
    navigationRoute = '/files';

    @Input()
    headerFilters = true;

    @Input()
    paramValues: Map<any, any> = null;

    @Input()
    filterSorting: string = null;

    @Output()
    documentListReady: EventEmitter<any> = new EventEmitter();

    @Output()
    changedPageSize: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    changedPageNumber: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    turnedNextPage: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    turnedPreviousPage: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    loadNext: EventEmitter<Pagination> = new EventEmitter();

    @Output()
    deleteElementSuccess: EventEmitter<any> = new EventEmitter();
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();


    @ViewChild('documentList', { static: true })
    documentList: DocumentListComponent;

    @ViewChild('standardPagination')
    standardPagination: PaginationComponent;

    @ViewChild(InfinitePaginationComponent, { static: true })
    infinitePaginationComponent: InfinitePaginationComponent;

    permissionsStyle: PermissionStyleModel[] = [];
    infiniteScrolling: boolean;
    stickyHeader: boolean;
    preselectNodes: boolean;
    warnOnMultipleUploads = false;
    thumbnails = false;
    noHeaderMode = ShowHeaderMode.Never;
    enableCustomPermissionMessage = false;
    enableMediumTimeFormat = false;
    displayEmptyMetadata = false;
    hyperlinkNavigation = false;

    selectedNodes = [];
    nodeId: string;
    isOverlay = false;

    constructor(private notificationService: NotificationService,
                private router: Router,
                private appConfig: AppConfigService,
                private preference: UserPreferencesService,
                @Optional() private route: ActivatedRoute,
                public authenticationService: AuthenticationService,
                public alfrescoApiService: AlfrescoApiService,
                private preview: PreviewService) {
    }



    ngOnInit() {
        if (!this.pagination) {
            this.pagination = {
                maxItems: this.preference.paginationSize,
                skipCount: 0
            } as Pagination;
        }

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.defaultNodeId = params['id'];
                console.log("FolderId:"+this.defaultNodeId)
                //console.log("this.currentFolderName"+this.defaultNodeId);
                if (params['id'] && this.currentFolderId !== params['id']) {
                    this.currentFolderId = params['id'];
                }
            });
        }

    }


    giveDefaultPaginationWhenNotDefined() {
        this.pagination = {
            maxItems: this.preference.paginationSize,
            skipCount: 0,
            totalItems: 0,
            hasMoreItems: false
        } as Pagination;
    }

    getCurrentDocumentListNode(): MinimalNodeEntity[] {
        if (this.documentList.folderNode) {
            return [{ entry: this.documentList.folderNode }];
        } else {
            return [];
        }
    }

    onNavigationError(error: any) {
        if (error) {
            this.router.navigate(['/error', error.status]);
        }
    }

    resetError() {
        this.errorMessage = null;
    }


    handlePermissionError(event: any) {
        this.notificationService.showError('PERMISSION.LACKOF', null, {
            permission: event.permission,
            action: event.action,
            type: event.type
        });
    }

    openSnackMessageError(error: any) {
        this.notificationService.showError(error.value || error);
    }

    openSnackMessageInfo(message: string) {
        this.notificationService.showInfo(message);
    }

    emitReadyEvent(event: NodePaging) {
        this.documentListReady.emit(event);
    }

    pageIsEmpty(node: NodePaging) {
        return node && node.list && node.list.entries.length === 0;
    }


    onPermissionRequested(node: any) {
        this.router.navigate(['/permissions', node.value.entry.id]);
    }


    getNodeNameTooltip(row: DataRow): string {
        if (row) {
            return row.getValue('name');
        }
        return null;
    }

    onChangePageSize(event: Pagination): void {
        this.preference.paginationSize = event.maxItems;
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.changedPageSize.emit(event);
    }

    onChangePageNumber(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.changedPageNumber.emit(event);
    }

    onNextPage(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.turnedNextPage.emit(event);
    }

    loadNextBatch(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.loadNext.emit(event);
    }

    onPrevPage(event: Pagination): void {
        this.pagination.maxItems = event.maxItems;
        this.pagination.skipCount = event.skipCount;
        this.turnedPreviousPage.emit(event);
    }


    onInfiniteScrolling(): void {
        this.infiniteScrolling = !this.infiniteScrolling;
        this.infinitePaginationComponent.reset();
    }




    navigateToFilter(activeFilters: FilterSearch[]) {
        const objectFromMap = {};
        activeFilters.forEach((filter: FilterSearch) => {
            let paramValue = null;
            if (filter.value && filter.value.from && filter.value.to) {
                paramValue = `${filter.value.from}||${filter.value.to}`;
            } else {
                paramValue = filter.value;
            }
            objectFromMap[filter.key] = paramValue;
        });

        this.router.navigate([], { relativeTo: this.route, queryParams: objectFromMap });
    }

    clearFilterNavigation() {
        this.documentList.node = null;
        if (this.currentFolderId === '-my-') {
            this.router.navigate([this.navigationRoute, '']);
        } else {
            this.router.navigate([this.navigationRoute, this.currentFolderId, 'display', this.displayMode]);
        }
        this.documentList.reload();
    }

    onFolderChange($event) {
        this.router.navigate([this.navigationRoute, $event.value.id, 'display', this.displayMode]);
    }

    onFilterSelected(activeFilters: FilterSearch[]) {
        if (activeFilters.length) {
           this.navigateToFilter(activeFilters);
        } else {
           this.clearFilterNavigation();
        }
    }
    showFile(event) {
        const entry = event.value.entry;
        if (entry && entry.isFile) {
            this.preview.showResource(entry.id);
        }
    }
    showPreview(event) {
        if (event.value.entry.isFile) {
            this.nodeId = event.value.entry.id;
            this.showViewer = true;
        }
    }
}
