import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Category,
  DIFFICULTIES,
  Difficulty,
} from '../shared/model/data.models';
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

  categories = this.#categoriesService.categories;
  subCategories = this.#categoriesService.subCategories;
  currentCategory = this.#categoriesService.currentCategory;
  currentSubCategory = this.#categoriesService.currentSubCategory;
  questions = this.#quizService.questions;
  readonly difficulties = DIFFICULTIES;

  selectCategory(categorySelected: Category): void {
    this.currentCategory.update(() => categorySelected);
    this.currentSubCategory.update(() => null);
  }

  selectSubCategory(subCategorySelected: Category): void {
    this.currentSubCategory.update(() => subCategorySelected);
  }

  selectDifficulty(difficulty: Difficulty): void {
    this.#quizService.difficulty.update(() => difficulty);
  }

  createQuiz(): void {
    this.#quizService.createQuiz(this.#categoriesService.currentCategoryId());
  }

  shouldCreateQuiz(): boolean {
    return Boolean(
      (this.subCategories().length && this.currentSubCategory()) ||
        (!this.subCategories().length && this.currentCategory())
    );
  }

  changeQuestion(questionIndex: number): void {
    this.#quizService.changeQuestion(
      questionIndex,
      this.#categoriesService.currentCategoryId()
    );
  }
}
