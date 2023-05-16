import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();

  constructor() { }

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }

  /* choiceSwal(message: string, title = 'Suppression') {
    return Swal.fire({
      title: title,
      icon: 'warning',
      text: message,
      showCancelButton: true,
      confirmButtonText: 'OUI',
      cancelButtonText: 'NON',
    })
  } */

  disconnectSwal() {
    return Swal.fire({
      icon: 'warning',
      title: 'Déconnexion',
      text: 'Votre connexion a expiré, vous allez être déconnecté.',
      timer: 5000,
      showConfirmButton: true,
      confirmButtonText: 'OK'
    })
  }


  showNotif(msg: string, typeNotif: 'success' | 'danger') {
    $.notify({
      icon: 'ti-gift',
      message: msg
    }, {
        type: typeNotif,
        autoHideDelay: 2000,
        showAnimation: 'fadeIn',
        hideAnimation: 'fadeOut',
        hideDuration: 700,
        placement: {
            from: 'top',
            align: 'center'
        }
    });
  }


  // ================================ Excel Export ================================ //

  tableToExcel(table: ElementRef, fileName: string, sheetName: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table.nativeElement, {dateNF: 'mm/dd/yyyy', raw: true});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  }

  jsonToExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {dateNF: 'mm/dd/yyyy'});
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'liste');
    XLSX.writeFile(workbook, excelFileName + '.xlsx');
  }

  async excelToJson(file: File): Promise<any> {
    let workBook = null;
    let sheetName = '';
    let jsonData = null;
    const data = await this.readFile(file).toPromise();
    workBook = XLSX.read(data, { type: 'binary' });
    jsonData = workBook.SheetNames.reduce((initial, name) => {
      const sheet = workBook.Sheets[name];
      initial[name] = XLSX.utils.sheet_to_json(sheet);
      sheetName = name;
      return initial;
    }, {});

    let jsonString = JSON.stringify(jsonData)
    jsonString = jsonString.substring(sheetName.length + 4, jsonString.length - 1);
    jsonData = JSON.parse(jsonString);

    return jsonData;
  }

  private readFile(file: File): Observable<string|ArrayBuffer> {
    const sub = new Subject<string|ArrayBuffer>();
    const reader = new FileReader();
    reader.onload = () => {
      sub.next(reader.result);
      sub.complete();
    };
    reader.readAsBinaryString(file);
    return sub.asObservable();
  }

  isExcelFile(file: File): boolean {
    return 'text/csv'.concat('application/vnd.ms-excel')
    .concat('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    .includes(file.type)
  }
}
