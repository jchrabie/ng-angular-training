import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Output,
  QueryList,
} from '@angular/core';
import { DropdownItemComponent } from '../dropdown-item/dropdown-item.component';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: #fff;
        border: 1px solid #ccc;
        border-top: none;
        border-radius: 0 0 5px 5px;
        z-index: 1;
        margin: -5px 5px;
        padding: 0;
      }
    `,
  ],
  host: { tabindex: '0' },
})
export class DropdownComponent implements AfterContentInit {
  @ContentChildren(DropdownItemComponent)
  items!: QueryList<DropdownItemComponent>;

  @Output() close = new EventEmitter<void>();

  #keyManager!: FocusKeyManager<DropdownItemComponent>;

  @HostListener('keydown', ['$event'])
  manage(event: KeyboardEvent) {
    this.#keyManager.onKeydown(event);
  }

  @HostListener('document:keydown.escape', ['$event'])
  closeDropdown() {
    this.close.emit();
  }

  ngAfterContentInit(): void {
    this.#keyManager = new FocusKeyManager(this.items).withWrap();
  }
}
