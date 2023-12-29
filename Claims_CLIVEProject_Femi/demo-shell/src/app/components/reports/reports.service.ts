/* * * ./app/comments/services/comment.service.ts * * */
// Imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { Http, Response, RequestOptions, Headers } from '@angular/http';
// import { RequestOptions } from '@angular/http';
// import { Http } from '@angular/http';
import { Observable } from 'rxjs'; // only need to import from rxjs
// import { Observable, of } from 'rxjs'; // only need to import from rxjs
import { map } from "rxjs/operators";


import { AppConfigService } from '@alfresco/adf-core';
// import { HttpClientModule } from '@angular/common/http'

// Import RxJs required methods
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';


@Injectable()
export class ReportsService {
    // private esUrlBase;
    // private claimEventUri;
    // private claimsUrl;
    // private headers;
    // private options;
    appConfValues: any = {};
    currentCustomer: string = "";
    totalRequests: any = [];

    // Resolve HTTP using the constructor
    constructor(private http: HttpClient, private appConfig: AppConfigService) {
        // this.esUrlBase = this.appConfig.get<string>('elasticsearchUrl');
        // this.claimEventUri = '/insuranceindex/claimevent/';
        // this.claimsUrl = this.esUrlBase + this.claimEventUri + '_search?size=500';
        // this.currentCustomer = this.appConfig.get<string>('currentCustomer');
        // this.appConfValues = this.appConfig.get<Map<string, any>>(this.currentCustomer);
        console.dir(this.appConfig);
    }

    getChildren(): Observable<any> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('smathews:demo')
        });

        const requestOptions = { headers: headers };
        var queryURL = "https://sse.dev.alfrescocloud.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/6ad2b229-0ed2-4623-8c44-e69c8daa4b17/children"

        return this.http.get(queryURL, requestOptions)
            .pipe(
                map(res => res['list']['entries'])
            );
    }

    getNodeProperties(nodeId): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('smathews:demo')
        });

        const requestOptions = { headers: headers };
        var queryURL = "https://sse.dev.alfrescocloud.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/" + nodeId + "?include=properties";

        return this.http.get(queryURL, requestOptions)
            .pipe(
                map(res => res['entry']['properties'])
            );
    }

    findClaimInElasticDB(claimNumber): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const requestOptions = { headers: headers };
        var queryURL = "http://mirkoadp740.sales-demohyland.com:9200/claims-test-2/_search?q=Claim-Number:" + claimNumber;

        return this.http.get(queryURL, requestOptions)
            .pipe(
                map(res => res['hits']['total']['value'])
            );
    }

    insertClaimToElasticDB(data: any): Observable<any> {
        var queryURL = "http://mirkoadp740.sales-demohyland.com:9200/claims-test-2/_doc";
        console.dir(data);
        console.log('data to INSERT : ' + JSON.stringify(data));

        return this.http.post(queryURL, data)
            .pipe(
                map(res => res['result'])
            );
    }



    getDashboardData(): Observable<any[]> {

        // const httpOptions = {
        //     headers: new HttpHeaders({
        //       'Content-Type':  'application/json',
        //       'Authorization': 'Basic ' + btoa('demo:demo')
        //     })
        //   };




        // this.headers = new Headers().append('Authorization', 'Basic ' + btoa('demo' + ':' + 'abs'));
        // this.headers = new Headers();
        // this.headers.append('Authorization', 'Basic ZGVtbzphYnM=');
        // this.options = new RequestOptions();
        // this.options = new RequestOptions({ Headers: new Headers(this.headers) });



        // var options = new RequestOptions();
        // options.headers = new Headers();
        // options.headers.append('Authorization', 'Basic ' + btoa('demo' + ':' + 'demo'));

        // var queryUrl = this.claimsUrl + queryParam;
        var queryUrl = this.appConfValues['JSON_DB_URL'];

        // return this.http.get(queryParam, options)
        //     .pipe(
        //         map(res => res.json().entries),
        //     );
        // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

        return this.http.get(queryUrl)
            .pipe(
                map(res => res['json']),
            );

        // return this.http.get<any>(queryUrl).subscribe(data => {
        //     this.totalRequests = data;
        // })

        // this.http.get(queryUrl)
        //     .subscribe(response => {
        //         console.log(response);
        //         this.totalRequests = response;
        //     });


        // return Observable.from(this.totalRequests);
    }

    // getClaimDetails(id: string): Observable<LolDashboardModelESResponse> {
    //     let claimDetailsUrl = this.esUrlBase + this.claimEventUri + id;
    //     return this.http.get(claimDetailsUrl)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    // }

    // getAuditControls(url: string): Observable<LolDashboardESResponse[]> {

    //     var options = new RequestOptions();
    //     options.headers = new Headers();
    //     options.headers.append('Authorization', 'Basic ' + btoa('demo' + ':' + 'demo'));

    //     return this.http.get(url, options)
    //         .pipe(
    //             map(res => res.json().applications),
    //         );

    // }

    insertData(data: any): Observable<any> {

        var queryUrl = this.appConfValues['COMMENTS_DB_URL'];
        console.log('queryUrl from INSERT : ' + queryUrl);
        console.dir(data);
        console.log('data to INSERT : ' + JSON.stringify(data));

        // var options = new RequestOptions();
        // options.headers = new Headers();
        // options.headers.append('Authorization', 'Basic ' + btoa('demo' + ':' + 'demo'));

        return this.http.post(queryUrl, data)
            .pipe(
                map(res => res['json']),
            );

    }



}
