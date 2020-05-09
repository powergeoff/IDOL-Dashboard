import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { PlatformModel, Instance } from '../models/platform';
import { PlatformService } from '../services/platform.service';
import { IdolRequest } from '../models/request';
import { IdolRequestService } from '../services/request.service';
import { IdolResponse } from '../models/response';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  idolRequestForm = this.fb.group({
    environment: [''],
    install: [''],
    database: [''],
    text: [''],
    printFields: [''],
    fieldText: [''],
    urlExists: [''],
  });

  get environment(){
    return this.idolRequestForm.get('environment').value;
  }
  set environment(patchValue){
    this.idolRequestForm.patchValue({
      environment: patchValue,
    });
    //reload instanceList
    this.changeEnvironment(patchValue);
  }
  get install (){
    return this.idolRequestForm.get('install').value;
  }
  set install(patchValue){
    this.idolRequestForm.patchValue({
      install: patchValue,
    });
    this.changeInstance(patchValue);
  }
  get database (){
    return this.idolRequestForm.get('database').value;
  }
  set database(patchValue){
    this.idolRequestForm.patchValue({
      database: patchValue,
    });
  }

  //ui stuff
  envList: string[];
  instanceList: string[];
  databaseList: string[];

  //pagination
  page: number;
  itemsPerPage = 5;

  title: string;
  isLoading: boolean;
  config: PlatformModel[];
  request: IdolRequest;
  urlInstance: string; //from route param
  
  response$: Observable<IdolResponse>;
  response: IdolResponse;

  constructor( private route: ActivatedRoute, 
    private titleService: Title, 
    private platFormService: PlatformService, 
    private fb: FormBuilder, 
    private idolRequestService: IdolRequestService) { }

  
  ngOnInit(): void {
    this.page = 1;
    this.envList = [];
    this.instanceList = [];
    this.databaseList = [];

    this.platFormService.getConfig().subscribe(
      data => {
        this.config = data;
        for (var i of data)
        {
          this.envList.push(i.environment);
        }
      },
      error => console.dir(error),
      () => {
        this.route.params.subscribe(
          urlParams =>{
            if (urlParams.environment != null){
              this.title = 'Search ' + urlParams.environment + ' ' + urlParams.instance;
              this.environment = urlParams.environment;
              this.urlInstance = urlParams.instance;
            }
            else{
              this.title = 'Search';
              this.environment = this.envList[0];
            }
            this.titleService.setTitle(this.title);
          },
          error =>{ console.dir(error)},
          () => {}
        );
      }
    );
    
  }

  
  changeInstance(insName: string){
    this.databaseList = [];
    this.databaseList.push(''); //should be able to select null
    let myServer = this.config.find(server => server.environment == this.environment).server;
    let currentInstance: Instance;
    currentInstance = this.config.find(server => server.environment == this.environment).instances.find(install => install.name == this.install);
    this.idolRequestService.getDataBases(myServer, currentInstance).subscribe(
      data => {
        for (var i of data.DataBases){
          this.databaseList.push(i);
        }
      }, 
      error => {
        console.dir(error);
      },
      () => {}
      
    )
  }

  changeEnvironment(envname: string){
    this.instanceList = [];
    this.platFormService.getConfigByName(envname).subscribe(
      data => {
        for (var i of data.instances){
          this.instanceList.push(i.name);
        }
      },
      error => {},
      () => {
        if (this.urlInstance == null){
          this.install = this.instanceList[0];
        }
        else{
          this.install = this.urlInstance;
        }

      }
    );
  }

  searchButton()
  {
    this.page = 1;
    this.search(1, this.itemsPerPage)
  }
  //pagination page change event
  pageChange($event) {
    let end = $event * this.itemsPerPage;
    let start = end - (this.itemsPerPage - 1);
    this.search(start, end);
  }

  search(start, end ){
    let myServer = this.config.find(server => server.environment == this.environment).server;
    let currentInstance: Instance;
    currentInstance = this.config.find(server => server.environment == this.environment).instances.find(install => install.name == this.install);
    
    let request = new IdolRequest();

    request.Instance = currentInstance;
    request.Server = myServer;
    request.DataBase = this.database;
    request.Text = this.idolRequestForm.get('text').value;
    request.PrintFields = this.idolRequestForm.get('printFields').value;
    request.FieldText = this.idolRequestForm.get('fieldText').value;
    request.UrlExists = this.idolRequestForm.get('urlExists').value;
    request.Start = start.toString();
    request.End = end.toString();
    console.dir(request);

    this.idolRequestService.getResponse(request).subscribe(
      data => {
        this.response = data;
        console.dir(this.response);
      },
      error => {},
      () => {}
    );
  }

}
