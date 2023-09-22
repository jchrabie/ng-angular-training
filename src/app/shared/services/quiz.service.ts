import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { first, map, tap } from 'rxjs';
import {
  ApiQuestion,
  Difficulty,
  Question,
  Results,
} from '../model/data.models';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  #API_URL = 'https://opentdb.com/';
  #http = inject(HttpClient);
  #latestResults = signal<Results | null>(null);

  shouldChangeQuestion = signal<boolean>(true);
  questions = signal<Question[]>([]);
  difficulty = signal<Difficulty | null>(null);

  createQuiz(categoryId: number): void {
    this.#http
      .get<{ results: ApiQuestion[] }>(this.#getUrl(5, categoryId))
      .pipe(map((res) => this.#mapResults(res.results)))
      .pipe(tap((q) => this.questions.update(() => q)))
      .pipe(tap(() => this.shouldChangeQuestion.update(() => true)))
      .pipe(first())
      .subscribe();
  }

  changeQuestion(questionIndex: number, categoryId: number) {
    this.#http
      .get<{ results: ApiQuestion[] }>(this.#getUrl(1, categoryId))
      .pipe(map((res) => this.#mapResults(res.results)[0]))
      .pipe(
        tap((q) =>
          this.questions.mutate((questions) => (questions[questionIndex] = q))
        )
      )
      .pipe(tap(() => this.shouldChangeQuestion.update(() => false)))
      .pipe(first())
      .subscribe();
  }

  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index]) score++;
    });
    this.#latestResults.update(() => ({ questions, answers, score }));
  }

  getLatestResults(): Results | null {
    return this.#latestResults();
  }

  resetQuiz(): void {
    this.questions.update(() => []);
    this.difficulty.update(() => null);
  }

  #getUrl(amout: number, categoryId: number): string {
    return `${
      this.#API_URL
    }/api.php?amount=${amout}&category=${categoryId}&difficulty=${this.difficulty()?.toLowerCase()}${
      amout > 1 ? '&type=multiple' : ''
    }`;
  }

  #mapResults(results: ApiQuestion[]): Question[] {
    return results.map((q) => ({
      ...q,
      all_answers: [...q.incorrect_answers, q.correct_answer].sort(() =>
        Math.random() > 0.5 ? 1 : -1
      ),
    }));
  }
}
