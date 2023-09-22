import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Category } from '../model/data.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  #API_URL = 'https://opentdb.com/';
  #http = inject(HttpClient);
  #allCategories!: Signal<Category[] | undefined>;

  categories = computed(
    () =>
      this.#allCategories()
        ?.map((category) => ({
          ...category,
          name: category.name.replace(/([\w|\s]*)\W?.*/i, '$1').trim(),
        }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((c) => c.name === value.name)
        ) ?? []
  );

  subCategories = computed(
    () =>
      this.#allCategories()
        ?.filter((category) =>
          category.name.match(new RegExp(`^${this.currentCategory()?.name}.+`))
        )
        .map((category) => ({
          ...category,
          name: category.name
            .replace(
              new RegExp(`${this.currentCategory()?.name}.*:(.*)`, 'i'),
              '$1'
            )
            .trim(),
        })) ?? []
  );

  currentCategory = signal<Category | null>(null);
  currentSubCategory = signal<Category | null>(null);
  currentCategoryId: Signal<number> = computed(
    () => this.currentSubCategory()?.id ?? this.currentCategory()?.id ?? 0
  );

  loadAllCategories(): void {
    this.#allCategories = toSignal<Category[]>(
      this.#http
        .get<{ trivia_categories: Category[] }>(
          this.#API_URL + 'api_category.php'
        )
        .pipe(map((res) => res.trivia_categories))
    );
  }

  resetCategories(): void {
    this.currentCategory.update(() => null);
    this.currentSubCategory.update(() => null);
  }
}
