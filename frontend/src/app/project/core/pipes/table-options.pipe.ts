import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableOptions'
})
export class TableOptionsPipe implements PipeTransform {

  transform(value: number): number[] {
    if (value) {
      return value > 100 ? [ 5, 10, 25, 50, value] : [5, 10, 25, 50]
    }
  }

}
