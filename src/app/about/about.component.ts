import { Component, OnInit,Inject } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leaders ?: Leader[];
  constructor(private leaderService: LeaderService, @Inject('BaseURL') public BaseURL: any ) { 
    this.leaderService.getLeaders().subscribe(l => this.leaders = l);

  }

  ngOnInit(): void {
  }

}
