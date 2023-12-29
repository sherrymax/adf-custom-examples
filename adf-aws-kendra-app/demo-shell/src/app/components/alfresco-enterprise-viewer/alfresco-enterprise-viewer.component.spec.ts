import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfrescoEnterpriseViewerComponent } from './alfresco-enterprise-viewer.component';

describe('AevViewerComponent', () => {
  let component: AlfrescoEnterpriseViewerComponent;
  let fixture: ComponentFixture<AlfrescoEnterpriseViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlfrescoEnterpriseViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlfrescoEnterpriseViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
