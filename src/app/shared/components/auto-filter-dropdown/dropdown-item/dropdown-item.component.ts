import { FocusableOption } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
        padding: 5px 15px;
        cursor: pointer;
        list-style: none;
      }

      :host(:hover),
      :host(:focus) {
        background-color: #f0f0f0;
      }
    `,
  ],
  host: { tabindex: '-1' },
})
export class DropdownItemComponent implements FocusableOption {
  @Output() selection = new EventEmitter<void>();

  #el = inject(ElementRef);

  focus(): void {
    this.#el.nativeElement.focus();
  }

  @HostListener('click')
  @HostListener('keydown.enter')
  select() {
    this.selection.emit();
  }
}
