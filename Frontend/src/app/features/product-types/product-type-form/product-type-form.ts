import {
  Component,
  effect,
  input,
  output
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import {
  ProductType,
  ProductTypePayload
} from '../../../core/models/product-type.model';

@Component({
  selector: 'app-product-type-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './product-type-form.html',
  styleUrl: './product-type-form.css'
})
export class ProductTypeForm {
  readonly productType = input<ProductType | null>(null);
  readonly saving = input(false);
  readonly resetKey = input(0);

  readonly saved = output<ProductTypePayload>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]],
    description: ['']
  });

  constructor() {
    effect(() => {
      const productType = this.productType();
      this.resetKey();

      if (productType) {
        this.form.reset({
          name: productType.name,
          description: productType.description ?? ''
        });
      } else {
        this.form.reset({
          name: '',
          description: ''
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload: ProductTypePayload = {
      name: value.name!.trim(),
      description: value.description?.trim() || null
    };

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
