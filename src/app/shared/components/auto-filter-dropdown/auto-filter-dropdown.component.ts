import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auto-filter-dropdown',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './auto-filter-dropdown.component.html',
  styleUrls: ['./auto-filter-dropdown.component.css'],
})
export class AutoFilterDropdownComponent<T extends { name: string }> {
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

    const lowerCaseItem = item.toLowerCase();
    const lowerCaseSelectedItem = this.searchTerm.toLowerCase();
    const index = lowerCaseItem.indexOf(lowerCaseSelectedItem);

    if (index === -1) {
      return item;
    }

    const matchedText = item.slice(index, index + this.searchTerm.length);
    const highlightedText = `<b>${matchedText}</b>`;
    return item.replace(matchedText, highlightedText);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.#el.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
