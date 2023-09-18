import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Results } from '../shared/model/data.models';
import { CategoriesService, QuizService } from '../shared/services';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css'],
})
export class AnswersComponent {
  @Input() data!: Results;

  #router = inject(Router);
  #quizService = inject(QuizService);
  #categoriesService = inject(CategoriesService);

  goBack(): void {
    this.#categoriesService.resetCategories();
    this.#quizService.resetQuiz();
    this.#router.navigate(['/']);
  }
}
