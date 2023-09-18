import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
  signal,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Difficulty, Question } from '../shared/model/data.models';
import { CategoriesService, QuizService } from '../shared/services';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizMakerComponent {
  #quizService: QuizService = inject(QuizService);
  #categoriesService: CategoriesService = inject(CategoriesService);

  questions = this.#quizService.questions;

  categories = this.#categoriesService.categories;
  subCategories = this.#categoriesService.subCategories;
  currentCategory = this.#categoriesService.currentCategory;
  currentSubCategory = this.#categoriesService.currentSubCategory;

  selectCategory(categorySelected: Category): void {
    this.currentCategory.update(() => categorySelected);
    this.currentSubCategory.update(() => null);
  }

  selectSubCategory(subCategorySelected: Category): void {
    this.currentSubCategory.update(() => subCategorySelected);
  }

  createQuiz(difficulty: string): void {
    this.#quizService.createQuiz(
      this.currentSubCategory()?.id || this.currentCategory()?.id || 0,
      difficulty as Difficulty
    );
  }

  shouldCreateQuiz(): boolean {
    return Boolean(
      (this.subCategories().length && this.currentSubCategory()) ||
        (!this.subCategories().length && this.currentCategory())
    );
  }

  changeQuestion(questionIndex: number, difficulty: string) {
    this.#quizService.changeQuestion(
      questionIndex,
      difficulty as Difficulty,
      this.currentSubCategory()?.id || this.currentCategory()?.id || 0
    );
  }
}
