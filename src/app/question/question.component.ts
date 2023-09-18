import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Question } from '../shared/model/data.models';
import { QuizService } from '../shared/services';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent {
  @Input({ required: true }) question!: Question;
  @Input() correctAnswer?: string;
  @Input() userAnswer?: string;

  @Output() change = new EventEmitter<string>();
  @Output() changeQuestion = new EventEmitter<string>();

  #quizService = inject(QuizService);

  currentSelection!: string;
  shouldChangeQuestion = this.#quizService.shouldChangeQuestion;

  getButtonClass(answer: string): string {
    if (!this.userAnswer) {
      if (this.currentSelection == answer) return 'tertiary';
    } else {
      if (this.userAnswer == this.correctAnswer && this.userAnswer == answer)
        return 'tertiary';
      if (answer == this.correctAnswer) return 'secondary';
    }
    return 'primary';
  }

  buttonClicked(answer: string): void {
    this.currentSelection = answer;
    this.change.emit(answer);
  }
}
