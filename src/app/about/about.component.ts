import { Component, OnInit } from '@angular/core';

//models
import{ IdolRequest } from '../models/request';
import{ IdolResponse } from '../models/response';
//services
import { Title }     from '@angular/platform-browser';
import { IdolRequestService } from '../services/request.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  title: string;

  response: IdolResponse;

  constructor(private titleService: Title, private idolRequestService: IdolRequestService) { }

  ngOnInit() {
    this.title = 'About/ Help Page';
    this.titleService.setTitle(this.title);
  }

}
