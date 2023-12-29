import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'workbook',
  templateUrl: './workbook.component.html',
  styleUrls: ['./workbook.component.css']
})
export class WorkbookComponent implements OnInit {


  sanitizedURL : SafeResourceUrl;
  constructor(    private sanitizer: DomSanitizer
    ) { }


  ngOnInit(): void {
    var url="http://www.google.com"
    this.sanitizedURL = this.getSanitizedURL(url);
  }

  getSanitizedURL(url) : SafeResourceUrl{
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

}
