import { Component, DoCheck, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { PunchService } from '../service/punch-service/punch.service';
import { UserService } from '../service/user-service/user.service';
import { User } from '../model/user';
import jsPDF from 'jspdf';
import { Punch } from '../model/punch';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {

  /*Current Week*/
  firstDayofThisWeek!: Date;
  weeks: Date[] = [];

  chart: any;  // dounght chart for weekly hours of each employee
  barChart: any;  //bar chart for daily hours for each employee

  // Users and their working hours
  users: User[] = [];
  usersWeeklyHours: Map<string, number[]> = new Map<string, number[]>();  // <username,[working_hours,working_minutes]>
  usersDailyHours: Map<string, number[]> = new Map<string, number[]>();  //  <username,[1st day workinghours, ....]>

  constructor(private punchService: PunchService, private userService: UserService) { }

  ngOnInit(): void {
    this.getTheFirstDayOfTheWeek();
    this.fillWeeks();
    this.getAllUsers();
  }

  getTheFirstDayOfTheWeek(): void {
    let d = new Date();
    let day = d.getDay();
    d.setDate(d.getDate() - day);
    this.firstDayofThisWeek = new Date(d);
  }

  fillWeeks(): void {
    this.weeks.push(new Date(this.firstDayofThisWeek));
    for (let i = 0; i < 6; i++) {
      let nextDate = this.firstDayofThisWeek.getDate() + 1;
      this.firstDayofThisWeek.setDate(nextDate);
      this.weeks.push(new Date(this.firstDayofThisWeek));
    }
  }

  // Get All Users To Be Displayed In the Table
  async getAllUsers() {
    try {
      const data = await this.userService.getAllUsers().toPromise();
      this.users = data || [];
    } catch (error) {
      console.log(`Error fetching the users ${error}`);
      this.users = [];
    }
    this.getWeeklyWorkingHours();
    this.getDailyWorkingHours();
  }

  // Calculate Weekly Hours For Each User as total_hours, total_minutes
  async getWeeklyWorkingHours() {
    const startDate = this.weeks[0].toISOString().split("T")[0];
    const endDate = this.weeks[this.weeks.length - 1].toISOString().split("T")[0];

    for (const u of this.users) {
      let totalHours = 0;
      let totalMinutes = 0;

      await this.punchService.getUserPunchesByDatePeriodOrderedAsc(u.name, startDate, endDate)
        .toPromise()
        .then((data) => {
          let punches = data || [];
          let [workHours, workMinutes] = this.calculateWorking_BreakingHours(punches);
          totalHours += workHours;
          totalMinutes += workMinutes;
        })
        .catch((err) => { console.error(`Error fetching punches for ${u.name}:`, err); });

      // Convert total minutes into hours and minutes
      let extraHours = Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;
      totalHours += extraHours;
      this.usersWeeklyHours.set(u.name, [totalHours, totalMinutes]);
    }
    this.createDonutChart();
  }

  calculateWorking_BreakingHours(punches: Punch[]): [number, number] {
    let workHours: number = 0;
    let workMinutes: number = 0;

    for (const day of this.weeks) {
      let dayDate = day.toISOString().split('T')[0];
      let dayPunches = punches.filter((p) => p.punchDate === dayDate);

      for (let i = 0; i < dayPunches.length; i++) {
        if (i % 2 === 0) { // Working time 
          if (dayPunches[i + 1]) {
            let [hours, minutes] = this.differentBetweenTwoTimes(dayPunches[i].punchTime, dayPunches[i + 1].punchTime);
            workHours += hours;
            workMinutes += minutes;
          } else {
            // Handle case for missing checkout (will not calculate the working time in the chart until the punch is closed)
          }
        } else { // Break time , Does not exist in charts

        }
      }
    }
    let newWorkingMinutes = workMinutes + workHours * 60;
    workHours = Math.floor(newWorkingMinutes / 60);
    newWorkingMinutes = newWorkingMinutes % 60;
    return [workHours, newWorkingMinutes];
  }


  // Calculate Daily Hours For Each User as array of numbers with the same order of the days in the week
  async getDailyWorkingHours() {
    const startDate = this.weeks[0].toISOString().split("T")[0];
    const endDate = this.weeks[this.weeks.length - 1].toISOString().split("T")[0];

    for (const user of this.users) {
      let dailyHours: number[] = [];
      await this.punchService.getUserPunchesByDatePeriodOrderedAsc(user.name, startDate, endDate)
        .toPromise()
        .then((data) => {
          let punches = data || [];
          dailyHours = this.calculateDailyWorkingHours(punches);
        })
        .catch((error) => {
          console.error(`Error fetching punches for ${user.name} between ${startDate} and ${endDate}:`, error);
          dailyHours = new Array(this.weeks.length).fill(0); // Handle errors by adding 0 hours for each day
        });

      this.usersDailyHours.set(user.name, dailyHours);
      console.log("Users daily hours calculation:", this.usersDailyHours);
    }
    this.createBarChart();
  }

  calculateDailyWorkingHours(punches: Punch[]): number[] {
    const dailyHours = new Array(this.weeks.length).fill(0);

    for (const day of this.weeks) {
      let dayDate = day.toISOString().split('T')[0];
      let dayPunches = punches.filter(p => p.punchDate === dayDate);

      if (dayPunches.length > 1) {
        let [hours, minutes] = this.calculateWorking_BreakingHours(dayPunches);
        dailyHours[this.weeks.indexOf(day)] = parseFloat(hours + (minutes < 10 ? `.0${minutes}` : `.${minutes}`));
      }
    }
    return dailyHours;
  }

  differentBetweenTwoTimes(start: string, end: string): number[] {
    const startHours = parseInt(start.substring(0, 2));
    const startMinutes = parseInt(start.substring(3, 5));
    const endHours = parseInt(end.substring(0, 2));
    const endMinutes = parseInt(end.substring(3, 5));

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    let difference = endTotalMinutes - startTotalMinutes;
    if (difference < 0) {
      difference += 24 * 60;
    }
    const diffHours = Math.floor(difference / 60);
    const diffMinutes = difference % 60;
    return [diffHours, diffMinutes]
  }

  createDonutChart(): void {
    const usersName: string[] = [];
    const useresValues: string[] = [];
    this.usersWeeklyHours.forEach((value, key) => {
      usersName.push(key);
      const concatenatedValue = value[0] + (value[1] < 10 ? `.0${value[1]}` : `.${value[1]}`);
      useresValues.push(concatenatedValue);
    });

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("donutChart", {
      type: 'doughnut',
      data: {
        labels: usersName,
        datasets: [{
          label: 'Working hours',
          data: useresValues,
          backgroundColor: this.RandomColorsGenerator(useresValues.length)  //random colors method
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
          datalabels: {
            anchor: 'end',
            align: 'start',
            color: 'white',
            font: {
              size: 14,
              weight: 'bold',
              family: 'Arial',
              style: 'italic',
            }, formatter: function (value, context) {
              return `${value} h`; // Append "h" to each value
            }
          }
        },
        hover: {
          intersect: true
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  createBarChart(): void {
    const usersName: string[] = [];
    const usersValues: number[][] = [];

    // Extract data from usersDailyHours map
    this.usersDailyHours.forEach((value, key) => {
      usersName.push(key);
      usersValues.push(value);
    });

    // Destroy the existing chart if it exists
    if (this.barChart) {
      this.barChart.destroy();
    }

    // Create datasets for the bar chart
    const datasets = usersName.map((name, index) => ({
      label: name,
      data: usersValues[index],
      backgroundColor: this.RandomColorsGenerator(1)[0]
    }));

    this.barChart = new Chart("barChart", {
      type: 'bar',
      data: {
        labels: this.weeks.map((day) => day.toDateString()),
        datasets: datasets
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: false
          }
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#000',
            font: {
              size: 12,
              weight: 'bold',
              family: 'Arial',
              style: 'normal',
            },
            formatter: function (value, context) {
              return `${value} h`; // Append "h" to each value
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  RandomColorsGenerator(quantity: number): string[] {
    let colors: string[] = []
    for (let i = 0; i < quantity; i++) {
      let color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      colors.push(color);
    }
    return colors;
  }

  exportChartToPDF(): void {
    // Check if both charts exist
    if (!this.chart || !this.barChart) {
      console.error("Both charts need to be available to export.");
      return;
    }

    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Set PDF title and date
    const title = 'Employee Working Hours';
    const date = new Date().toLocaleDateString();

    // Set title
    pdf.setFontSize(18);
    pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 25, { align: 'center' });

    //Set weeks
    const weeks = `Weeks: ${this.weeks[0].toISOString().split('T')[0]} to ${this.weeks[this.weeks.length - 1].toISOString().split('T')[0]}`;
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(14);
    pdf.text(weeks, pdf.internal.pageSize.getWidth() / 2, 35, { align: 'center' });

    // Set date
    pdf.setFontSize(12);
    pdf.text(`Date: ${date}`, pdf.internal.pageSize.getWidth() / 2, 45, { align: 'center' });

    const logo = new Image();
    logo.src = '../../assets/images/esense-logo.png';
    pdf.addImage(logo, 'PNG', 5, 5, 20, 15);


    // Add the doughnut chart image to the PDF
    const donutChartCanvas = document.getElementById('donutChart') as HTMLCanvasElement;
    html2canvas(donutChartCanvas).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const chartWidth = 100;
      const chartHeight = chartWidth * canvas.height / canvas.width;
      pdf.addImage(imgData, 'PNG', (pdf.internal.pageSize.getWidth() - chartWidth) / 2, 55, chartWidth, chartHeight);

      // Add the bar chart image to the PDF
      const barChartCanvas = document.getElementById('barChart') as HTMLCanvasElement;
      html2canvas(barChartCanvas).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const barChartWidth = pdf.internal.pageSize.getWidth() - 20;
        const barChartHeight = barChartWidth * canvas.height / canvas.width;
        const yOffset = 50 + chartHeight;
        pdf.addImage(imgData, 'PNG', 10, yOffset, barChartWidth, barChartHeight);


        pdf.setFontSize(10);
      pdf.text('Page 1 of 1', pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
      
        // Save the PDF
        pdf.save('charts.pdf');

        // Generate the PDF and convert it to a Blob
        const pdfOutput = pdf.output('blob');

        // Create a URL from the Blob and open it in a new window
        const blobUrl = URL.createObjectURL(pdfOutput);
        window.open(blobUrl);
      });
    });
  }

  nextWeek(): void {
    this.weeks.forEach((d) => d.setDate(d.getDate() + 7));
    this.getWeeklyWorkingHours();
    this.getDailyWorkingHours();
  }

  prevWeek(): void {
    this.weeks.forEach((d) => d.setDate(d.getDate() - 7));
    this.getWeeklyWorkingHours();
    this.getDailyWorkingHours();
  }
}
