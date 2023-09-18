import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnswersComponent } from './answers/answers.component';
import { QuizMakerComponent } from './quiz-maker/quiz-maker.component';
import { CategoriesService, QuizService } from './shared/services';

const routes: Routes = [
  {
    path: 'result',
    component: AnswersComponent,
    resolve: { data: () => inject(QuizService).getLatestResults() },
  },
  {
    path: '**',
    component: QuizMakerComponent,
    resolve: { data: () => inject(CategoriesService).loadAllCategories() },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
