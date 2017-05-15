import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'hero-child',
  templateUrl: './hero-child.component.html'
})
export class HeroChildComponent {

  @Input('fg')
  public fg: FormGroup;

  @Input('fgn')
  public fgn: string;

  constructor(@Inject(FormBuilder) fb: FormBuilder) {
    // this.childFormGroup = fb.group({
    //   city: '',
    //   street: ''
    // });
  }
}
