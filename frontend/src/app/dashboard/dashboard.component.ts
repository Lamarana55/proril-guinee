import { StatusAlerteFormatPipe } from './../project/core/pipes/status-alerte-format.pipe';
import { StatusCasFormatPipe } from './../project/core/pipes/status-cas-format.pipe';
import { STATUT_ALERTE, STATUT_CAS } from 'app/config/app.data';
import { Component, OnInit } from '@angular/core';
import { StatService } from 'app/project/core/services/stat.service';
import Chart from 'chart.js';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare const $: any;

declare interface StatData {
  nombres: number[]
  labels: string[]
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  canvas: any;
  ctx: any;
  chartColor: any;

  alerteStatutChart: any; // pie chart pour les statuts d'alertes
  alerteStatutStats: StatData;

  casStatutChart: any; // pie chart pour les statuts des cas
  casStatutStats: StatData;

  alerteRegionChart: any; // bar chart pour les 5 regions ayant le plus d'alertes
  alerteRegionStats: StatData;

  casPrefectureChart: any; // bar chart pour les 5 prefectures ayant le plus de cas
  casRegionStats: StatData;

  statsAlertes: {traite: number, nonTraitre: number}
  statsCas: {traite: number, enAttente: number};

  chartHours: any;
  today = new Date();
  debut = new Date().toISOString().split('T')[0];
  fin = new Date().toISOString().split('T')[0];
  rechercherForm: FormGroup;
  isRefresh: boolean = false;
  printDate: string = '';
  mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre',
    'Octobre', 'Novembre', 'Décembre']

  constructor (private stats: StatService,
                private fb: FormBuilder,
               private statutCasFormat: StatusCasFormatPipe,
               private statutAlerteFormat: StatusAlerteFormatPipe ) {}

  ngOnInit() {
    this.chartColor = '#FFFFFF';
    var d = new Date();
    d.setDate(1);
    this.debut = d.toISOString().split('T')[0];
    this.setStats();
    /* this.stats.findByPrefectureCas().subscribe(data => {
      console.log('datataaaa', data)
    }) */

  }

  onRefresh() {
    var dateDebut = this.debut.split('-');
    var dateFin = this.fin.split('-');

    if(dateDebut.length === 3 && dateFin.length === 3) {
      var formatDebut = `${dateDebut[2]} ${this.mois[parseInt(dateDebut[1]) - 1]} ${dateDebut[0]}`;
      var formatFin = `${dateFin[2]} ${this.mois[parseInt(dateFin[1]) - 1]} ${dateFin[0]}`
      this.printDate = `Statistiques du ${formatDebut} au ${formatFin}`
    }
    this.isRefresh = true;
    this.setStats(this.debut, this.fin);
  }

  onRestaurer() {
    this.isRefresh = false;
    var d = new Date();
    d.setDate(1);
    this.debut = d.toISOString().split('T')[0];
    this.fin = new Date().toISOString().split('T')[0];
    this.setStats();
  }

  loadChart() {
    // Chart Statut Alerte
    this.canvas = document.getElementById('chartAlerteByStatut');
    this.ctx = this.canvas.getContext('2d');
    this.alerteStatutChart = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: this.alerteStatutStats.labels,
        datasets: [{
          label: 'Villes',
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: ['#e83e8c', '#51bcda'],
          borderWidth: 0,
          data: this.alerteStatutStats.nombres
        }]
      },

      options: {

        legend: {
          display: true,
          position: 'bottom'
        },

        pieceLabel: {
          render: 'percentage',
          fontColor: ['white'],
          precision: 2
        },

        tooltips: {
          enabled: true
        },

        scales: {
          yAxes: [{

            ticks: {
              display: false
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: 'transparent',
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: 'transparent'
            },
            ticks: {
              display: false,
            }
          }]
        },
      }
    });

    // Chart Statut Cas
    this.canvas = document.getElementById('chartCasByStatut');
    this.ctx = this.canvas.getContext('2d');
    this.casStatutChart = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: this.casStatutStats.labels,
        datasets: [{
          label: 'Cas',
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: ['#e83e8c', '#51bcda', '#6bd098', '#e95e38'],
          borderWidth: 0,
          data: this.casStatutStats.nombres
        }]
      },

      options: {

        legend: {
          display: true,
          position: 'bottom'
        },

        pieceLabel: {
          render: 'percentage',
          fontColor: ['white'],
          precision: 2
        },

        tooltips: {
          enabled: true
        },

        scales: {
          yAxes: [{

            ticks: {
              display: false
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: 'transparent',
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: 'transparent'
            },
            ticks: {
              display: false,
            }
          }]
        },
      }
    });

    // Chart Region Alerte
    this.canvas = document.getElementById('chartAlerteByRegion');
    this.ctx = this.canvas.getContext('2d');
    this.alerteStatutChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.alerteRegionStats.labels,
        datasets: [{
            label: 'alertes',
            data: this.alerteRegionStats.nombres,
            backgroundColor: this.randomColors(8),
            // borderColor: ,
            borderWidth: 1
        }]
      },
      options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
      }
    });

    // Chart Prefecture
    this.canvas = document.getElementById('chartCasByPrefecture');
    this.ctx = this.canvas.getContext('2d');
    this.casStatutChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.casRegionStats.labels,
        datasets: [{
            label: 'cas',
            data: this.casRegionStats.nombres,
            backgroundColor: this.randomColors(33),
            // borderColor: ,
            borderWidth: 1
        }]
      },
      options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
      }
    });
  }

  setStats(debut: string = '', fin: string = '') {
    forkJoin({
      alertesNonTraites: this.stats.countByStatutAlerte(STATUT_ALERTE.NON_TRAITE, debut, fin),
      alertesTraites: this.stats.countByStatutAlerte(STATUT_ALERTE.TRAITE, debut, fin),
      casTraite: this.stats.countByStatutCas(STATUT_CAS.TRAITE, debut, fin),
      casEnAttente: this.stats.countByStatutCas(STATUT_CAS.EN_ATTENTE, debut, fin)
  }).pipe(
      map(({alertesNonTraites, alertesTraites, casTraite, casEnAttente}) => {
        this.statsAlertes = {traite: alertesTraites, nonTraitre: alertesNonTraites};
        this.statsCas = {traite: casTraite, enAttente: casEnAttente}
      })
    ).subscribe();

    forkJoin({
      alerteStatutStats: this.stats.findByStatutAlerte(debut, fin),
      casStatutStats: this.stats.findByStatutCas(debut, fin),
      alerteRegionStats: this.stats.findByRegionAlerte(debut, fin),
      casRegionStats: this.stats.findByRegionCas(debut, fin)
    }).pipe(
        map(({alerteStatutStats, casStatutStats, alerteRegionStats, casRegionStats}) => {
          this.alerteStatutStats = {
            nombres: alerteStatutStats.map(al => al.nombre),
            labels: alerteStatutStats.map(al => this.statutAlerteFormat.transform(al.statut))
          };
          this.casStatutStats = {
            nombres: casStatutStats.map(cas => cas.nombre),
            labels: casStatutStats.map(cas => this.statutCasFormat.transform(cas.statut))
          };
          this.alerteRegionStats = {
            nombres: alerteRegionStats.map(al => al.nombre),
            labels: alerteRegionStats.map(al => al.region)
          };
          this.casRegionStats = {
            nombres: casRegionStats.map(cas => cas.nombre),
            labels: casRegionStats.map(cas => cas.region)
          }
        })
    ).subscribe(
      () => {
        this.loadChart();
      }
    );
  }

  randomColors(size: number) {
    const colors: string[] = [];
    for (let i = 0; i < size; i++) {
      colors.push(this.getRandomColor())
    }

    return colors;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
