import { Injectable } from '@angular/core';
import { KendraClient, QueryCommand, ListDataSourcesCommand } from "@aws-sdk/client-kendra";
import { AppConfigService } from '@alfresco/adf-core';

@Injectable()
export class SearchKendraService {

    appConfValues: any = {};
    currentCustomer: string = "";
    queryResponse: any = {};
    configValues: any = {};
    indexId = "";

    constructor(private appConfig: AppConfigService) {
        this.currentCustomer = this.appConfig.get<string>('currentCustomer');
        this.appConfValues = this.appConfig.get<Map<string, any>>(this.currentCustomer);
        this.indexId = this.appConfValues['KENDRA-INDEX-ID'];

        this.getConfig();

    }

    public getConfig() {
        var accessKey = this.appConfValues['ACCESS_KEY'];
        var secretKey = this.appConfValues['SECRET_KEY'];

        // var pageNumber = 1;
        // var pageSize = 10;
        // queryText = "What is the durability of S3?";

        this.configValues = {
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey
            },
            region: 'us-east-2'
        }
    }

    public listDataSources() {
        this.getConfig();
        const client = new KendraClient(this.configValues);
        const input = { // ListDataSourcesRequest
            IndexId: this.indexId, // required
            MaxResults: Number("10"),
        };
        const command = new ListDataSourcesCommand(input);
        const response = this.sendForResponse(client, command);

        return response;
    }

    public searchForQueryResults(queryText) {
        this.getConfig();
        console.log("queryText >> " + queryText);
        const client = new KendraClient(this.configValues);

        const input = { //QueryRequest
            IndexId: this.indexId,
            QueryText: queryText,
            // QueryResultTypeFilter: "DOCUMENT" || "QUESTION_ANSWER" || "ANSWER",
            // QueryResultTypeFilter: "ANSWER" && "DOCUMENT",
            PageNumber: Number("1"),
            PageSize: Number("100"),

            // RequestedDocumentAttributes: [ // DocumentAttributeKeyList
            //     "STRING_VALUE",
            // ],
            // Facets: [ // FacetList
            //     { // Facet
            //         DocumentAttributeKey: "STRING_VALUE",
            //         Facets: [
            //             {
            //                 DocumentAttributeKey: "STRING_VALUE",
            //                 Facet: "_data_source_id",
            //                 MaxResults: Number("10")
            //             }
            //         ],
            //         MaxResults: Number("10")
            //     }
            // ]
        };

        const command = new QueryCommand(input);
        this.queryResponse = this.sendForResponse(client, command);
        return this.queryResponse;

    }

    async sendForResponse(client, command) {
        const response = await client.send(command);
        return response;
    }


    public getCurrentZuluTime() {
        const today = new Date();
        var zulu_date_str = today.toISOString();

        zulu_date_str = zulu_date_str.split('-').join('');
        zulu_date_str = zulu_date_str.split('.')[0];
        zulu_date_str = zulu_date_str.split(':').join('') + "Z";

        return zulu_date_str;
    }



}
