import { Component, OnInit, Input,ViewChild,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import 'hammerjs';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  @ViewChild('rform') reviewFormDirective : any;
  dishIds !: string[];
  prev !: string;
  next !: string;
  dish !: Dish;
  dishcopy!: Dish;
  reviewForm !: FormGroup;
  review !: Comment;
  errMess?: string;
  formErrors : any = {
    'name': '',
    'comment': '',
    'rating':5
  };

  userDet = {author: '',
  comment: '',rating:5};


  validationMessages : any = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'comment is required.',
    },
  };


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') public BaseURL: any,
    private fb: FormBuilder) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any>errmess);
      this.route.params
      .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
        errmess => this.errMess = <any>errmess );
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() : void{
    this.reviewForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      comment: ['', Validators.required ],
      rating: 5,
      Date : Date.now()
    });
    this.reviewForm.valueChanges.subscribe(data => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now

  }

  onValueChanged(data ?: any) {
    if (!this.reviewForm) { return; }
    const form = this.reviewForm;
    for (const field  in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field]  = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.review = this.reviewForm.value;
    console.log(this.review);
    this.reviewForm.reset({
      author: '',
      comment: '',
      rating: 5,
      date: '',
    });
    const d = new Date();
let text = d.toISOString();
    this.reviewFormDirective.resetForm({author: '',
    comment: '',rating:5});
     this.dishcopy.comments.push({author: this.review.author,
     comment: this.review.comment,rating:this.review.rating,date:text});
     this.dishservice.putDish(this.dishcopy)
     .subscribe(dish => {
       this.dish = dish; this.dishcopy = dish;
     },
     errmess => { this.dish != null; this.dishcopy != null; this.errMess = <any>errmess; });
     
  }



}
