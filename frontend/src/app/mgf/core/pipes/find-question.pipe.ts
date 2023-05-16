import { ParametrageService } from './../../parametrage/services/parametrage.service';
import { Observable, of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { Question } from 'app/mgf/parametrage/models/question.model';

@Pipe({
  name: 'findQuestion', pure: true
})
export class FindQuestionPipe implements PipeTransform {

  constructor(private paramService: ParametrageService) {}

  transform(id: number): Observable<Question> {
    return !!id ? this.paramService.getOneQuestion(id) : of();
  }

}
