import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title }     from '@angular/platform-browser';

import { PlatformService } from '../services/platform.service';
import { PlatformModel, IdolComponent } from '../models/platform';

@Component({
  selector: 'app-platform-details',
  templateUrl: './platform-details.component.html'
})
export class PlatformDetailsComponent implements OnInit {
  envString: string;
  isLoading: boolean;
  config: PlatformModel;
  title: string;
  
  constructor(
    private route: ActivatedRoute, 
    private platformService: PlatformService,
    private titleService: Title
  ) { }

  ngOnInit() {
    
    this.route.params.subscribe(urlParams => {
      this.title = urlParams.environment + ' Details';
      this.titleService.setTitle(this.title);
      this.platformService.getConfigByName(urlParams.environment).subscribe(
        config => this.config = config,
        error => console.log(error),
        () => {
          let isLicValid = this.platformService.isComponentLive(this.config.server, this.config.licenseServer.mainPort)
            .subscribe(
              res => this.config.licenseServer.isValid = res,
              error=> console.log(error),
              () => {
                this.config.instances.forEach(instance => {
                  instance.components.forEach(component => {
                    let isValid = this.platformService.isComponentLive(this.config.server, component.mainPort)
                      .subscribe(
                        res => component.isValid = res,
                        error => console.log(error),
                        () => {}
                      )
                  });
                })
              }
            )
        }
      );
    });
  }

}
