import { Component, OnInit } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';

import { PlatformService } from '../services/platform.service';
import { PlatformModel, IdolComponent } from '../models/platform';

@Component({
  selector: 'app-platform-check',
  templateUrl: './platform-check.component.html',
  styleUrls: ['./platform-check.component.css']
})
export class PlatformCheckComponent implements OnInit {
  failedComponents: IdolComponent[];
  isModalContentReady: boolean;
  configModel: PlatformModel[];
  title: string;

  constructor(
    private platformService: PlatformService,
    private modalService: NgbModal,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.title = 'IDOL Platform Check';
    this.titleService.setTitle(this.title);
    this.configModel = [];
    this.platformService.getConfig().subscribe(res => this.configModel = res);
  }

  isEnvironmentValid(envName, modalContent) {
    let numQueryable = 0;
    let count = 0;
    this.isModalContentReady = false;
    this.failedComponents = [];
    let server = this.configModel.find(element => element.environment === envName);
    server.isValid = true;
    server.instances.filter(instance => {
        numQueryable += instance.components.filter(component => component.isQueryable == true && component.isActive).length;
    });
    let isLicValid = this.platformService.isComponentLive(server.server, server.licenseServer.mainPort)
      .subscribe(
        res => {
          server.licenseServer.isValid = res;
          if (res === false) {
            this.failedComponents.push(server.licenseServer);
            server.isValid = false;
          }
        },
        error => console.log(error),
        () => {
          server.instances.forEach(instance => {
            instance.components.forEach((component, index) => {
              if (component.isActive === true && component.isQueryable === true) {
                let isCompValid = this.platformService.isComponentLive(server.server, component.mainPort).subscribe(
                  res => {
                    component.isValid = res;
                    if (res === false) {
                      this.failedComponents.push(component);
                      server.isValid = false;
                    }
                  },
                  error => console.log(error),
                  () => {
                    if (component.isValid !== undefined) {
                      count++;
                    }
                    if (count === (numQueryable)){
                      this.isModalContentReady = true;
                    }
                  }
                );
              }
            });
          })
        }
      );
      //don't allow outside click to close modal
      let ngbModalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false
    };
    //console.dir(server);
     this.modalService.open(modalContent, ngbModalOptions).result.then((result) => {
    //   //console.dir(result);
     }, (reason) => {
    //   //console.dir(reason);
     });
  }

}
