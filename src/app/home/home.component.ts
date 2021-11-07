import { Component, OnInit,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dish?: Dish;
  promotion?: Promotion;
  leader?:Leader; 
  errMess?: string;
  constructor(private dishservice: DishService,
    private promotionservice: PromotionService, private leaderservice:LeaderService,@Inject('BaseURL') public BaseURL: any) { }

  ngOnInit(): void {
    this.dishservice.getFeaturedDish().subscribe((dish) => this.dish =dish,
    errmess => this.errMess = <any>errmess);

    this.promotionservice.getFeaturedPromotion().subscribe((p) => this.promotion =p,
    errmess => this.errMess = <any>errmess);
    this.leaderservice.getFeaturedLeader().subscribe((l) => this.leader = l,
    errmess => this.errMess = <any>errmess);
  }

 

}
