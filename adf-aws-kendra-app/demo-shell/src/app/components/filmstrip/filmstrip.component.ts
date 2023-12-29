import { ChangeDetectorRef, Component, NgZone, ViewChild } from "@angular/core";
import { SwiperComponent } from "swiper/angular";
import { DomSanitizer } from '@angular/platform-browser';

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
// import { emptyWithList } from "lib/core/src/lib/datatable/components/datatable/datatable.component.stories";
// import Swiper from "swiper/types/swiper-class";

// install Swiper components
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
    selector: "results-swiper",
    styleUrls: ['./filmstrip.component.scss'],
    templateUrl: "./filmstrip.component.html"
})

export class FilmStripComponent {
    @ViewChild('swiperRef', { static: false }) swiperRef?: SwiperComponent;

    show: boolean;
    thumbs: any;
    slides$ = new BehaviorSubject<string[]>(['']);
    recommededResponseList = <any>[];
    
    constructor(private cd:ChangeDetectorRef, private ngZone: NgZone, private sanitizer: DomSanitizer) {
        console.dir(this.cd);

        var response = {
            "id":"1234-1234-1234",
            "Type":"ALFRESCO",
            "documentTitle": "Test.pdf",
            "documentURI":"http://www.google.com",
            "format": "TEXT",
            "sourceRepo": "ALFRESCO",
            "scoreConfidence":"HIGH",
            "documentExcerptHTMLString": "<span style='background-color: yellow'>This is a test</span>",
            "sourceLogoURL":"https://www.logiciels.pro/wp-content/uploads/2021/05/alfresco-one-avis-prix-alternatives-logiciel.webp"
        }
        var response2 = {
            "id":"9090-9090-9090",
            "Type":"AWS S3",
            "documentTitle": "S3-Doc.pdf",
            "documentURI":"http://www.google.com",
            "format": "TEXT",
            "sourceRepo": "S3",
            "scoreConfidence":"MEDIUM",
            "documentExcerptHTMLString": "",
            "sourceLogoURL":"https://ih1.redbubble.net/image.3917587429.0371/st,small,507x507-pad,600x600,f8f8f8.jpg"

        }
        this.recommededResponseList.push(response);
        this.recommededResponseList.push(response2);
        
    }
    ngOnInit() { 

    }

    transform(value) {
        console.log(this.sanitizer.bypassSecurityTrustHtml(value))
        return this.sanitizer.bypassSecurityTrustHtml(value);
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
}
