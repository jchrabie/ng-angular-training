import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Question } from '../shared/model/data.models';
import { QuizService } from '../shared/services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent {
  @Input() questions?: Question[] = [];

  @Output() changeQuestion = new EventEmitter<number>();

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl('/result');
  }
}
