import { Component, ViewChild, ViewEncapsulation, NgZone } from '@angular/core';
import { QueryBody, MinimalNodeEntity } from '@alfresco/js-api';
import { ThumbnailService } from '@alfresco/adf-core';
import { SearchService, SearchConfigurationService, SearchComponent } from '@alfresco/adf-content-services';
import { TestSearchConfigurationService } from './search-config-test.service';
import { SearchKendraService } from './search-kendra.service';
import { MatTableDataSource } from '@angular/material/table';
import { SearchKendraResponse, searchKendraModel } from './search-kendra.model';
import { DomSanitizer } from '@angular/platform-browser';

import { FormControl } from '@angular/forms';
import { SwiperComponent } from "swiper/angular";
// import Swiper core and required components
import SwiperCore, {
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    Virtual,
    Zoom,
    Autoplay,
    Thumbs,
    Controller,
} from 'swiper';
import { BehaviorSubject } from "rxjs";

SwiperCore.use([
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    Virtual,
    Zoom,
    Autoplay,
    Thumbs,
    Controller
]);

@Component({
    selector: 'app-search-kendra-component',
    templateUrl: './search-kendra.component.html',
    styleUrls: ['./search-kendra.component.scss'],
    // standalone: true,
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: SearchConfigurationService, useClass: TestSearchConfigurationService },
        SearchService
    ]
})
export class SearchKendraComponent {

    @ViewChild('swiperRef', { static: false }) swiperRef?: SwiperComponent;

    show: boolean;
    thumbs: any;
    slides$ = new BehaviorSubject<string[]>(['']);


    @ViewChild('search')
    search: SearchComponent;

    queryParamName = 'q';
    searchedWord = '';
    queryBodyString = '';
    errorMessage = '';
    maxItems: number;
    skipCount = 0;
    // pagination: Pagination;
    queryBody: QueryBody;
    dataSource: MatTableDataSource<SearchKendraResponse>;
    recommendedDataSource: MatTableDataSource<SearchKendraResponse>;

    displayedColumns = [];
    hasSearchResults = false;
    showSpinner = false;
    showMoreResults = false;
    showMoreResultsButton = false;
    rows = [];
    recRows = [];
    queryResponse = {};
    queryText = "";

    dataSourceList = <any>[];

    // Multi-select-initiliations - START //
    dataSources = new FormControl('');
    // Multi-select-initiliations - END //



    constructor(private sanitizer: DomSanitizer,
        public thumbnailService: ThumbnailService,
        public kendraService: SearchKendraService,
        private ngZone: NgZone
    ) {
    }

    ngOnInit() {
        // this.displayedColumns = ['id', 'type', 'status', 'urgent', 'memberid', 'membername', 'createddate', 'actions'];
        this.displayedColumns = ['id'];
        this.getDataSources();
        this.showMoreResultsButton = false;
        this.showMoreResults = false;
    }

    getDataSources() {
        setTimeout(() => {
            this.kendraService.listDataSources().then(response => {
                var items = response['SummaryItems'];
                items.forEach(item => {
                    item['logoURL'] = this.getSourceLogoForDropDown(item['Type']);
                    this.dataSourceList.push(item);
                });
                console.log("---|||---")
                console.dir(this.dataSourceList);
                console.log("---|||---")
            });
        }, 500);
    }

    transform(value) {
        console.log(this.sanitizer.bypassSecurityTrustHtml(value))
        return this.sanitizer.bypassSecurityTrustHtml(value);
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


    fetchData() {
        this.hasSearchResults = false;
        this.showSpinner = true;
        this.showMoreResults = false;
        this.showMoreResultsButton = true;

        console.log(">>> START OF FETCH DATA <<<");
        this.rows = [];
        this.recRows = [];

        this.kendraService.searchForQueryResults(this.queryText).then(data => {
            console.log('*** *** *** ');
            console.log('>>> <<<', data);
            console.log('*** *** *** ' + data['ResultItems'].length);

                data['ResultItems'].forEach(element => {
                    var elementToInsert = new searchKendraModel();
                    elementToInsert.id = element['Id'];
                    elementToInsert.type = element['Type'];
                    elementToInsert.name = element['Name'];
                    elementToInsert.format = element['Format'];
                    elementToInsert.documentURI = element['DocumentURI'];
                    elementToInsert.documentTitle = element['DocumentTitle']['Text'];
                    elementToInsert.documentExcerpt = "";
                    console.log(">>> >>> >>>");
                    console.dir(element['AdditionalAttributes']);
                    console.log("<<< <<< <<<");

                    elementToInsert.documentExcerpt = element['DocumentExcerpt']['Text'];
                    if(element['AdditionalAttributes'].length > 0){
                        elementToInsert.documentExcerpt = element['AdditionalAttributes'][0]['Value']['TextWithHighlightsValue']['Text'];
                    }
                    elementToInsert.highlightList = element['DocumentExcerpt']['Highlights'];
                    elementToInsert.feedbackToken = element['FeedbackToken'];
                    elementToInsert.scoreConfidence = element['ScoreAttributes']['ScoreConfidence'];
                    elementToInsert.pageCount = this.getPageCount(element['DocumentAttributes']);
                    elementToInsert.excerptPageNumber = "-1";
                    elementToInsert.documentExcerptHTMLString = this.highlightSearchResults(elementToInsert.documentExcerpt, elementToInsert.highlightList); 
                    elementToInsert.sourceRepo = this.getSourceSystem(element['DocumentAttributes']);
                    elementToInsert.sourceLogoURL = this.getSourceLogo(elementToInsert.sourceRepo);
                    if (elementToInsert.type == "ANSWER") {
                        this.recRows.push(elementToInsert);
                    } else {
                        this.rows.push(elementToInsert);
                    }
                });

                this.dataSource = new MatTableDataSource(this.rows);
                this.recommendedDataSource = new MatTableDataSource(this.recRows);
                this.showMoreResultsButton = true;

                console.dir(this.dataSource);
                console.dir(this.recommendedDataSource);


                this.hasSearchResults = true;
                this.showSpinner = false;
            
            console.log("RECOMMENDED RESULT COUNT ", (this.recRows?this.recRows.length:"OBJECT IS NULL") );
            console.log('*** $$$ *** ');
        });

    }

    getSourceSystem(docAttributesList) {
        var sourceRepo = "-";
        docAttributesList.forEach(attributeMapObject => {
            // console.log(">>><<<>>><<<>>><<<>>>");
            // console.log("attributeMapObject[key]"+attributeMapObject);
            // console.dir(attributeMapObject)
            if (attributeMapObject["Key"] == "_data_source_id") {
                var sourceRepoId = attributeMapObject["Value"]["StringValue"];
                this.dataSourceList.forEach(dataSource => {
                    if (dataSource["Id"] == sourceRepoId) {
                        sourceRepo = dataSource["Type"] + " - " + dataSource["Name"];
                        // console.log("SOURCE SYSTEM ID : ", sourceRepoId);
                        // console.log("SOURCE SYSTEM NAME: ", sourceRepo);

                    }
                });
            }
        });
        return sourceRepo;
    }

    getPageCount(docAttributesList) {
        var pageCount = "-";
        docAttributesList.forEach(attributeMapObject => {
            if (attributeMapObject["Key"] == "number_of_pages") {
                pageCount = attributeMapObject["Value"]["LongValue"];
            }
        });
        return pageCount;
    }

    highlightSearchResults(text, highlightList) {
        // var search = this.queryText;
        var snippetList = [];
        var highlightSnippetList = [];
        var beginIndex = 0;
        var endIndex = -1;
        var finalResult = "";

        for(var i=0; i<highlightList.length; i++){
            var beginOffset = highlightList[i]["BeginOffset"];
            var endOffset = highlightList[i]["EndOffset"];
            highlightSnippetList[highlightSnippetList.length] = '<span style="background-color: yellow">' + text.substring(beginOffset, endOffset) + '</span>';

            endIndex = highlightList[i]["BeginOffset"];
            snippetList[snippetList.length]=text.substring(beginIndex, endIndex);
            beginIndex = highlightList[i]["EndOffset"];
        }

        snippetList[snippetList.length]=text.substring(beginIndex, (text.length));

        for(var i=0; i<snippetList.length; i++){
            finalResult += snippetList[i];
            if(highlightSnippetList[i] != null){
                finalResult += highlightSnippetList[i];
            }
        }

        return finalResult;
        // return text.replace(new RegExp(search, 'gi'), '<span style="background-color: yellow">' + `${search}` + '</span>')
    }

    getSourceLogo(sourceType) {
        var logoURL = "";
        if (sourceType.indexOf("ALFRESCO") != -1) {
            logoURL = "https://www.logiciels.pro/wp-content/uploads/2021/05/alfresco-one-avis-prix-alternatives-logiciel.webp";
        }
        else if (sourceType.indexOf("S3") != -1) {
            logoURL = "https://ih1.redbubble.net/image.3917587429.0371/st,small,507x507-pad,600x600,f8f8f8.jpg";
        }

        return logoURL;
    }

    getSourceLogoForDropDown(sourceType) {
        var logoURL = "";
        if (sourceType.indexOf("ALFRESCO") != -1) {
            logoURL = "https://www.logiciels.pro/wp-content/uploads/2021/05/alfresco-one-avis-prix-alternatives-logiciel.webp";
        }
        else if (sourceType.indexOf("S3") != -1) {
            logoURL = "https://static-00.iconduck.com/assets.00/aws-icon-2048x2048-274bm1xi.png";
        }

        return logoURL;
    }

    displayMoreResults() {
        this.showMoreResultsButton = true;
        this.showMoreResults = true;
    }

    slidesEx = ['first', 'second'];

    onSlideChange(swiper: any) {
        if (swiper.isEnd) {
            // all swiper events are run outside of ngzone, so use ngzone.run or detectChanges to update the view.
            this.ngZone.run(() => {
                this.slidesEx = [...this.slidesEx, `added ${this.slidesEx.length - 1}`];
            });
            console.log(this.slidesEx);
        }
    }

    getSlides() {
        // this.slides$.next(Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`));
            this.slides$.next(Array.from({ length: 600 }).map((el, index) => {
                console.log(el);
                return `Slide ${index + 1}`;
            }));
        }
    
        thumbsSwiper: any;
        setThumbsSwiper(swiper) {
            this.thumbsSwiper = swiper;
        }
        controlledSwiper: any;
        setControlledSwiper(swiper) {
            this.controlledSwiper = swiper;
        }
    
        indexNumber = 1;
        exampleConfig = { slidesPerView: 3 };
        slidesPerView: number = 4;
        pagination: any = false;
    
        slides2 = ['slide 1', 'slide 2', 'slide 3'];
        replaceSlides() {
            this.slides2 = ['foo', 'bar'];
        }
    
        togglePagination() {
            if (!this.pagination) {
                this.pagination = { type: 'fraction' };
            } else {
                this.pagination = false;
            }
        }
    
        navigation = false;
        toggleNavigation() {
            this.navigation = !this.navigation;
        }
    
        scrollbar: any = false;
        toggleScrollbar() {
            if (!this.scrollbar) {
                this.scrollbar = { draggable: true };
            } else {
                this.scrollbar = false;
            }
        }
        breakpoints = {
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 40 },
            1024: { slidesPerView: 4, spaceBetween: 50 },
        };
    
    
    //  slides = Array.from({ length: 5 }).map((el, index) => `Slide ${index + 1}`);
    
        slides = Array.from({ length: 5 }).map((el, index) => {
            console.log(el)
            return `Slide ${index + 1}`;
        });
    
    // virtualSlides = Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`);
        virtualSlides = Array.from({ length: 600 }).map((el, index) => {
            console.log(el);
            return `Slide ${index + 1}`;
        });
    
        log(log: string) {
            console.log(log);
        }
    
        breakPointsToggle: boolean;
        breakpointChange() {
            this.breakPointsToggle = !this.breakPointsToggle;
            this.breakpoints = {
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 4, spaceBetween: 40 },
                1024: { slidesPerView: this.breakPointsToggle ? 7 : 5, spaceBetween: 50 },
            };
        }

}
