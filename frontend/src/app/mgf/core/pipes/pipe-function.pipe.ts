import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeFunction'
})
export class PipeFunctionPipe implements PipeTransform {

  transform(value: any, handle: (value: any) => any): any {
    return handle(value);
  }

}
