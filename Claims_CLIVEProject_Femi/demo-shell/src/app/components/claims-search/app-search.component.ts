import { Component, OnInit } from '@angular/core';
//import { ClaimSearchComponent } from './claims-form/app-claim-search.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
//import { ActivatedRoute, Router } from '@angular/router';

import { Pagination, ResultSetPaging, QueryBody} from '@alfresco/js-api';
//import {SearchForm, SearchQueryBuilderService, SearchService, SearchCategory } from '@alfresco/adf-content-services';
import { SearchConfiguration, SearchForm, SearchQueryBuilderService, SearchService, SearchCategory } from '@alfresco/adf-content-services';
//import { SearchConfiguration, SearchForm, SearchQueryBuilderService} from '@alfresco/adf-content-services';

import { ShowHeaderMode, UserPreferencesService } from '@alfresco/adf-core';
//import { ShowHeaderMode } from '@alfresco/adf-core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
//import { SearchCategoriesPage } from '@alfresco/adf-testing';

import { ClaimSearchService } from './app-search.service';


@Component({
    selector: 'app-search',
    templateUrl: './app-search.component.html',
    styleUrls: [`./app-search.component.scss`],
    providers: [SearchService, ClaimSearchService]
})


export class SearchPageComponent implements OnInit {

    loadedsearch = '';
    queryParamName = 'q';
 //   queryParamName = 'p';
    searchedWord = '';
    data: ResultSetPaging;
    pagination: Pagination;
    isLoading = true;
    showSearch = false;
    loadedFeature = 'search-page';
    search:boolean;

    sorting = ['name', 'asc'];
    searchForms: SearchForm[];
    showHeader = ShowHeaderMode.Always;

    categories: SearchCategory[];

    claimtype: SearchCategory;

    searchtype = 'folder'
    result2: QueryBody;
    queryParamList = ['q','clmnt', 'p', 'dol','extp','lob'];
    queryParams = [];
    queryMap = new Map<string,string>([
        ["q", "ins:accountNumber"],
        ["clmt", "cm:name"],
        ["p","ins:policyNum"],
        ["dol","ins:dol"],
        ["extp","ins:extp"],
        ["lob","ins:lob"]
    ]);

    private onDestroy$ = new Subject<boolean>();

    constructor(public router: Router,
            private preferences: UserPreferencesService,
            private queryBuilder: SearchQueryBuilderService,
            private route: ActivatedRoute,
            private claimService: ClaimSearchService) {
        combineLatest([this.route.params, this.queryBuilder.configUpdated])
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(([params, searchConfig]) => {

                const claim: SearchCategory =
                {
                    id: 'claimstatus',
                    component:
                    {
                        selector: 'radio',
                        settings:
                        {
                            field:'ins:accountStatus',
                            format:"ins:accountStatus:'(.*?)'",
                            options: [
                                {
                                  name: "APP.SEARCH.RADIO.NONE",
                                  value: "ins:accountStatus:'pending'",
                                  default: true
                                },
                                {
                                  name: "Pending",
                                  value: "ins:accountStatus:'pending'"
                                },
                                {
                                  name: "Active",
                                  value: "ins:accountStatus:'active'"
                                },
                            ]
                        },

                    },
                    name: 'Claim Status',
                    enabled: true,
                    expanded: false
                };

                const assignedTo: SearchCategory =
                {
                    id: 'assigned',
                    component:
                    {
                        selector: 'text',
                        settings:
                        {
                            field:'ins:assignedTo_acct',
                            format:"ins:assignedTo_acct:'(.*?)'",
                        },

                    },
                    name: 'Assigned To',
                    enabled: true,
                    expanded: false
                };

//                this.categories.push(claim);
//                searchConfig.categories.concat(this.categories.push(test));

                this.search = this.claimService.search;

                searchConfig.categories.pop();
                searchConfig.categories.pop();
                searchConfig.categories.pop();
                searchConfig.categories.pop();
                searchConfig.categories.pop();
                searchConfig.categories.pop();

                searchConfig.categories.push(claim);
                searchConfig.categories.push(assignedTo);

                console.log(searchConfig);
                this.updateSearchSetting(searchConfig);
                this.queryParams = [];

                this.queryParamList.forEach(param => {
                    console.log(this.route.snapshot.params[param]);
                    if(this.route.snapshot.params[param] === 'null')
                    {
                        console.log(param + ' is null' );
                    }else
                    {
                        if(!this.queryParams.includes(param))
                            this.queryParams.push(param);
                        console.log('Current List: ' + this.queryParams.toString());
                    }
                })

//                const query2 = this.getQueryParamValues(params[0]);

                const query2 = this.getQueryParamValues(params);

                query2 == query2;
                this.searchedWord = 'Cohen';


                const query = this.formatSearchQuery(this.searchedWord, searchConfig['app:fields']);
                console.log("query formatted");

                if (query) {
                    console.log("setting user query");
                    this.queryBuilder.userQuery = query2;

                }

                //this.searchedWord
 /*               this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                const query = this.formatSearchQuery(this.searchedWord, searchConfig['app:fields']);
                if (query) {
                    this.queryBuilder.userQuery = query;
                }
            */
           });

            queryBuilder.paging = {
                maxItems: this.preferences.paginationSize,
                skipCount: 0
            };
    }


    ngOnInit(){

 //       this.showSearch = this.claimSearch.search;

        this.queryBuilder.resetToDefaults();

        this.sorting = this.getSorting();

        this.queryBuilder.updated
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
            this.sorting = this.getSorting();
            this.isLoading = true;
        });

        this.queryBuilder.executed
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((resultSetPaging: ResultSetPaging) => {
                this.queryBuilder.paging.skipCount = 0;

                this.onSearchResultLoaded(resultSetPaging);
                this.isLoading = false;
            });
        var i = 0;

        this.claimService.searchCreated
        .subscribe(()=> this.search = true);


        console.log('route: ' + this.route.toString());

        if (this.route) {
   //         var query = '';
            console.log(this.route.snapshot.params);
/*
            this.queryParamList.forEach(param => {
                console.log(this.route.snapshot.params[param]);
                if(this.route.snapshot.params[param] === 'null')
                {
                    console.log(param + ' is null' );
                }else
                {
                    this.queryParams.push(param);
                    console.log('Current List: ' + this.queryParams.toString());
                }
            })
*/
            console.log('Available params: ' + this.queryParams.toString())
            i=0;
            this.route.params.forEach((params: Params) => {
//                console.log('Params: ' + params[this.qu]);
                console.log("searched word:" + this.searchedWord);
                console.log("compare params has q(set as a variable): " + params.hasOwnProperty(this.queryParams[i]));
                console.log("query param set: " + this.queryParams.at(i));
                console.log("value: " + params[this.queryParams[i]]);

                this.searchedWord = params.hasOwnProperty(this.queryParams[i]) ? params[this.queryParams[i]] : null;

                console.log("searched word: " + this.searchedWord);
                var query= '';

                if (params[this.queryParams[i]] !== 'null' )
                {

/*
                this.categories.push(this.claim);
                this.categories.push(this.claimtype);


                this.queryBuilder.categories = this.categories;
                this.queryBuilder.categories.forEach(element => { console.log(element.name)
                    if(element.name === 'Name')
                    {
                        element.name = 'claim type';
                    }

                });
*/
                    if(this.searchtype === 'folder')
                    {
                        console.log("folder");
                        console.log("here");
                        query = this.getQueryParamValues(params)
                        console.log(query);

                        const result: QueryBody = {
                            query: {
//                                query: "ins:accountNumber:" + this.searchedWord,
                                    query,
                                    language: 'afts'
                            },
                            include: ['path', 'allowableOperations'],
    //                        paging: this.paging,
      //                      fields: this.config.fields,
                            filterQueries:[ {query: "TYPE: 'cm:folder'"}],
     //                       facetQueries: this.facetQueries,
      //                      facetIntervals: this.facetIntervals,
       //                     facetFields: this.facetFields,
        //                    sort: this.sort,
         //                   highlight: this.highlight
                        };


                        this.result2 = result;

                    }
                    else if(this.searchtype === 'documents')
                    {
                        console.log("documents");
                        const result: QueryBody = {
                            query: {
                                query: "ins:accountNumber:" + this.searchedWord,
                                language: 'afts'
                            },
                            include: ['path', 'allowableOperations'],
    //                        paging: this.paging,
      //                      fields: this.config.fields,
                            filterQueries:[ {query: "TYPE: 'cm:documents'"}],
     //                       facetQueries: this.facetQueries,
      //                      facetIntervals: this.facetIntervals,
       //                     facetFields: this.facetFields,
        //                    sort: this.sort,
         //                   highlight: this.highlight
                        };

                        this.result2 = result;


                    }else
                    {
                        console.log("nothing");

                    }

 //                   if(i === (this.queryParams.length - 1))
                        this.queryBuilder.update(this.result2);
//                    this.queryBuilder.categories.forEach(element => { console.log(element.name)

 //                   });

                    i++;
                    console.log("updated");
                } else {
                    console.log("not updated");
                    this.queryBuilder.userQuery = null;
                   this.queryBuilder.executed.next(new ResultSetPaging({
                        list: {
                            pagination: { totalItems: 0 },
                            entries: []
                        }
                    }));
                }
            });
        }

    }

    searchSubmitted()
    {
        console.log("search submitted");
        this.showSearch = true;

    }

    openCase()
    {
        console.log("Open Case");
    }

    private formatSearchQuery(userInput: string, fields =  ['cm:name']) {
        if (!userInput) {
            return null;
        }
//        return fields.map(userInput);

               return fields.map((field) => `${field}:"${userInput}*"`).join(' OR ');
    }

    onDeleteElementSuccess() {
        this.queryBuilder.execute();
    }

    onRefreshPagination(pagination: Pagination) {
        this.queryBuilder.paging = {
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount
        };
        this.queryBuilder.update();
    }

    onSearchResultLoaded(resultSetPaging: ResultSetPaging) {
        this.data = resultSetPaging;
        this.pagination = { ...resultSetPaging.list.pagination };
    }


    private updateSearchSetting(config: SearchConfiguration): void {
        if (config.facetQueries) {
            this.updateSetting(config.facetQueries);
        }

        if (config.facetFields?.fields?.length) {
            config.facetFields.fields.forEach((field) => this.updateSetting(field));
        }

        if (config.facetIntervals?.intervals?.length) {
            config.facetIntervals.intervals.forEach((field) => this.updateSetting(field));
        }

        if (config.categories.length) {
            config.categories.forEach((field) => this.updateSetting(field.component));
        }
    }

    private getSorting(): string[] {
        const primary = this.queryBuilder.getPrimarySorting();

        if (primary) {
            return [primary.key, primary.ascending ? 'asc' : 'desc'];
        }

        return ['name', 'asc'];
    }

    private updateSetting(field) {
        field.settings = field.settings ?? {};
        field.settings.allowUpdateOnChange = false;
        field.settings.hideDefaultAction = true;
    }

    onSelection(value: any)
    {
        console.log(value.target.value);
        this.loadedsearch = value.target.value;
//        this.showSearch = true;

    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    getQueryParamValues(params:Params)
    {

        var query ='';
//        let queryMap = new Map<string,string>([["",""]]);

        this.queryParams.forEach(element => {
            console.log('Param: ' + element);
 //           console.log('Param Value: ' + params[element]);
  //          console.log('Param Value Length: ' + params[element])

            if(params[element] !== 'null')
                switch(element)
                {
                    case 'q':{
                        if(query)
                            query += params.hasOwnProperty(element) ? "AND ins:accountNumber:" +  params[element] + "*" : '';

                        else
                            query += params.hasOwnProperty(element) ? "ins:accountNumber:" +  params[element] +"*": '';

                        break;
                    }
                    case 'p':{
                        if(query)
                            query += params.hasOwnProperty(element) ? "AND ins:accountNumber:" +  params[element] : '';
                        else
                            query += params.hasOwnProperty(element) ? "ins:accountNumber:" +  params[element] : '';
                        break;
                    }
                    case 'dol':{
                        if(query)
                            query += params.hasOwnProperty(element) ? "AND ins:accountNumber:" +  params[element] : '';
                        else
                            query += params.hasOwnProperty(element) ? "ins:accountNumber:" +  params[element] : '';
                        break;
                    }
                    case 'clmnt':{
                        if(query)
                            query += params.hasOwnProperty(element) ? " AND cm:name:" +  params[element] + "*" : '';
                        else
                            query += params.hasOwnProperty(element) ? 'cm:name:\"' +  params[element] + '*\"': '';
                        break;
                    }
                    case 'extp':{
                        query += params.hasOwnProperty(element) ? element + params[element] : '';
                        break;
                    }
                    case 'lob': {
                        query += params.hasOwnProperty(element) ? element + params[element] : '';
                        break;
                    }
                    default:
                }

        });
//        this.result2 = query;
        return query;
    }
    onNavigate(feature: string)
    {
        console.log(feature);
        this.loadedFeature = feature;
//        this.router2.navigate(["/"+feature]);



    }
}
