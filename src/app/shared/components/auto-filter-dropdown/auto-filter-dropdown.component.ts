import { FocusableOption } from '@angular/cdk/a11y';
import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownItemComponent } from './dropdown-item/dropdown-item.component';
import { DropdownComponent } from './dropdown/dropdown.component';

@Component({
  selector: 'app-auto-filter-dropdown',
  standalone: true,
  imports: [DropdownComponent, DropdownItemComponent, FormsModule, NgFor, NgIf],
  templateUrl: './auto-filter-dropdown.component.html',
  styleUrls: ['./auto-filter-dropdown.component.css'],
})
export class AutoFilterDropdownComponent<T extends { name: string }>
  implements FocusableOption
{
  @Input() items: T[] = [];
  @Input() placeholder = 'Select';
  @Input() searchTerm = '';

  @Output() itemSelected = new EventEmitter<T>();

  isDropdownOpen = false;
  filteredItems: T[] = [];

  #el = inject(ElementRef);

  openDropdown(focusedElement: EventTarget | null) {
    this.isDropdownOpen = true;
    this.filterItems();
    (focusedElement as HTMLInputElement).select();
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  filterItems() {
    if (!this.searchTerm) {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = this.items.filter((item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  searchItem(item: T) {
    this.searchTerm = item.name;
    this.isDropdownOpen = false;
    this.itemSelected.emit(item);
  }

  highlightMatchedText(item: string): string {
    if (!this.searchTerm) {
      return item;
    }

    const index = item.toLowerCase().indexOf(this.searchTerm.toLowerCase());

    if (index === -1) {
      return item;
    }

    const matchedText = item.slice(index, index + this.searchTerm.length);
    const highlightedText = `<b>${matchedText}</b>`;

    return item.replace(matchedText, highlightedText);
  }

  focus(): void {
    this.#el.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:keyup.tab', ['$event'])
  @HostListener('document:keyup.shift.tab', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.#el.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
