import { Component, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'hero-detail',
  templateUrl: './hero-detail.component.html'
})
export class HeroDetailComponent {

  public heroForm: FormGroup;

  constructor(@Inject(FormBuilder) fb: FormBuilder) {
    const fields: any = {
      city: '',
      street: ''
    };

    this.heroForm = fb.group({
      name: '',
      email: '',
      child1: fb.group({
        a: '',
        b: ''
      }),
      child2: fb.group({
          a: '',
          b: ''
      }),
      x: fb.group(fields),
      y: fb.group(fields)
    });
  }
}
