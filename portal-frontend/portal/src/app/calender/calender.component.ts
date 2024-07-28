import { ChangeDetectionStrategy, Component, DoCheck, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { PunchService } from '../service/punch-service/punch.service';
import { UserService } from '../service/user-service/user.service';
import { User } from '../model/user';
import jsPDF from 'jspdf';
import { Punch } from '../model/punch';
import { log } from 'console';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit, DoCheck {
showData() {
this.showCharts=!this.showCharts;
}
  chart: any;
  barChart: any;

  users: User[] = [];
  usersWeeklyHours: Map<string, number[]> = new Map<string, number[]>();
  usersDailyHours: Map<string, number[]> = new Map<string, number[]>();

  firstDayofThisWeek!: Date;
  weeks: Date[] = [];
showCharts: boolean=false;

  constructor(private punchService: PunchService, private userService: UserService) { }

  ngOnInit(): void {
    this.getTheFirstDayOfTheWeek();
    this.fillWeeks();
    this.getAllUsers();
  }

  ngDoCheck(): void {
    // Optionally, handle change detection
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
    // let breakHours: number = 0;
    // let breakMinutes: number = 0;
  
    for (const day of this.weeks) {
      let dayDate = day.toISOString().split('T')[0];
      let dayPunches = punches.filter((p) => p.punchDate === dayDate);
  
      for (let i = 0; i < dayPunches.length; i++) {
        if (i % 2 === 0) { // Working time (check-ins)
          if (dayPunches[i + 1]) {
            let [hours, minutes] = this.differentBetweenTwoTimes(dayPunches[i].punchTime, dayPunches[i + 1].punchTime);
            workHours += hours;
            workMinutes += minutes;
          } else {
            // Handle case for missing checkout (not shown for brevity)
          }
        } else { // Break time (check-outs)
          // Handle break times similarly if needed (not shown for brevity)
        }
      }
    }
  
    return [workHours, workMinutes];
  }
  
  // differentBetweenTwoTimes(start: string, end: string): [number, number] {
  //   const startHours = parseInt(start.substring(0, 2));
  //   const startMinutes = parseInt(start.substring(3, 5));
  //   const endHours = parseInt(end.substring(0, 2));
  //   const endMinutes = parseInt(end.substring(3, 5));
  
  //   const startTotalMinutes = startHours * 60 + startMinutes;
  //   const endTotalMinutes = endHours * 60 + endMinutes;
  
  //   let difference = endTotalMinutes - startTotalMinutes;
  
  //   if (difference < 0) {
  //     difference += 24 * 60; // Adjust for crossing midnight
  //   }
  
  //   const diffHours = Math.floor(difference / 60);
  //   const diffMinutes = difference % 60;
  
  //   return [diffHours, diffMinutes];
  // }
  
  // async getWeeklyWorkingHours() {
  //   const startDate = this.weeks[0].toISOString().split("T")[0];
  //   const endDate = this.weeks[this.weeks.length - 1].toISOString().split("T")[0];
  //   for (const u of this.users) {
  //     let hours = 0;
  //     let minutes = 0;
  //     // for (const day of this.weeks) {
  //       // await this.punchService.getUserPunchesByDateOrderedAsc(u.name, day.toISOString().split("T")[0]).toPromise()
  //       //   .then((data) => {
  //       //     if (data && data.length > 1) {
  
  //       //       let diff= this.calculateWorking_BreakingHours(data);
  //       //       hours += diff[0][0];
  //       //       minutes += diff[0][1];
  //       //       console.log("numberss: ",hours, minutes)
  //       //     }
  //       //   })
  //       //   .catch((err) => { console.error(`Error fetching punches for ${u.name} on ${day}:`, err); });

  //       await this.punchService.getUserPunchesByDatePeriodOrderedAsc(
  //         u.name,startDate,endDate).toPromise().then((data)=>{
  //           let punches = data||[];
  //        let diff= this.calculateWorking_BreakingHours(punches)||[0,0];
  //             hours += diff[0];
  //             minutes += diff[0];
  //             console.log("numberss: ",hours, minutes)
  //         })
  //     // }
  //     let extraHours = Math.floor(minutes / 60);
  //     minutes = minutes % 60;
  //     hours += extraHours;
  //     this.usersWeeklyHours.set(u.name, [hours, minutes]);
  //   }
  //   this.createDonutChart();
  // }


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
    const dailyHours = new Array(this.weeks.length).fill(0); // Initialize daily hours with 0 for each day
  
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
  

//   async getDailyWorkingHours() {
//     for (const user of this.users) {
//       let dailyHours: number[] = [];

//       for (const day of this.weeks) {
//         await this.punchService.getUserPunchesByDateOrderedAsc(user.name, day.toISOString().split("T")[0])
//           .toPromise()
//           .then((data) => {
//             let hours = 0;
//             let minutes = 0;
//             if (data && data.length > 1) {
//               // let diff: number[] = this.differentBetweenTwoTimes(data[0].punchTime, data[data.length - 1].punchTime);
//               // hours = diff[0];
//               // minutes = diff[1];
//               let diff= this.calculateWorkingHours(data);
//               hours += diff[0][0];
//               minutes += diff[0][1];
//               console.log("numberss: ",hours, minutes)
//             }
//             let formattedValue = hours + (minutes < 10 ? `.0${minutes}` : `.${minutes}`);
//             dailyHours.push(parseFloat(formattedValue));
//           })
//           .catch((error) => {
//             console.error(`Error fetching punches for ${user.name} on ${day}:`, error);
//             dailyHours.push(0); // Handle errors by adding 0 hours
//           });
//       }

//       this.usersDailyHours.set(user.name, dailyHours);
//       console.log("users daily hours calculation:", this.usersDailyHours);
//     }

//     this.createBarChart();
//   }

// calculateWorkingHours(punches:Punch[]):number[][]{
//  let workHours:number[]=[0,0];
//  let breakHours:number[]=[0,0];
//  for(let i =0;i<punches.length;i++){
// if(i%2===0){

//     if(punches[i+1]){
//       workHours[0]+=this.differentBetweenTwoTimes(punches[i].punchTime,punches[i+1].punchTime)[0]
//       workHours[1]+=this.differentBetweenTwoTimes(punches[i].punchTime,punches[i+1].punchTime)[1]

//     }else{   // the empoloyee does not punch checkout for his working period 
//       // let date = new Date();
//       // let currentTime= date.getHours()+':'+date.getMinutes();
//       // workHours[0]+=this.differentBetweenTwoTimes(punches[i].punchTime,currentTime)[0]
//       // workHours[1]+=this.differentBetweenTwoTimes(punches[i].punchTime,currentTime)[1]

//         }
// }
// else{
//       if(punches[i+1]){
//         breakHours[0]+=this.differentBetweenTwoTimes(punches[i].punchTime,punches[i+1].punchTime)[0]
//         breakHours[1]+=this.differentBetweenTwoTimes(punches[i].punchTime,punches[i+1].punchTime)[1]
//       }
//       else{ // the empoloyee does not punch checkout for his breaking period 
//         // let date = new Date();
//         // let currentTime= date.getHours()+':'+date.getMinutes();
//         // breakHours[0]+=this.differentBetweenTwoTimes(punches[i].punchTime,currentTime)[0]
//         // breakHours[1]+=this.differentBetweenTwoTimes(punches[i].punchTime,currentTime)[1]

//         }
// }
// }
// let totalWM= workHours[0]*60+workHours[1];
// let totalWH= Math.floor(totalWM/60);
// totalWM=totalWM%60;

// let totalBM= breakHours[0]*60+breakHours[1];
// let totalBH= Math.floor(totalBM/60);
// totalBM=totalBM%60;

// return[[totalWH,totalWM],[totalBH,totalBM]]

// }
//  calculateWorking_BreakingHours(punches: Punch[]) {
//   for (const day of this.weeks) {
//       let dayDate = day.toISOString().split('T')[0];
//       let dayPunches = punches.filter((p) => p.punchDate === dayDate);

//       let workHours: number[] = [0, 0];
//       let breakHours: number[] = [0, 0];

//       for (let i = 0; i < dayPunches.length; i++) {
//           if (i % 2 === 0) { // Check-ins (start of a working period)
//               if (dayPunches[i + 1]) {
//                   let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, dayPunches[i + 1].punchTime);
//                   workHours[0] += diff[0];
//                   workHours[1] += diff[1];
//               } else {
//                   // Employee did not punch checkout for their working period
//                   // let currentDate = new Date();
//                   // let currentTime = currentDate.getHours() + ':' + currentDate.getMinutes();
//                   // if (currentDate.toISOString().split('T')[0] === dayPunches[i].punchDate) {
//                   //     let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, currentTime);
//                   //     workHours[0] += diff[0];
//                   //     workHours[1] += diff[1];
//                   //     console.log("reminder for work setted at",dayPunches[i].punchDate )
//                   //     this.workReminder.set(dayPunches[i].punchDate, `You have been working from ${this.formatPunchTime(dayPunches[i].punchTime)}`);
//                   // }
//               }
//           } else { // Check-outs (start of a break period)
//               if (dayPunches[i + 1]) {
//                   let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, dayPunches[i + 1].punchTime);
//                   breakHours[0] += diff[0];
//                   breakHours[1] += diff[1];
//               } else {
//                    // Employee did not punch checkout for their break period
//                   // let currentDate = new Date();
//                   // let currentTime = currentDate.getHours() + ':' + currentDate.getMinutes();
//                   // if (currentDate.toISOString().split('T')[0] === dayPunches[i].punchDate) {
//                   //     let diff = this.differentBetweenTwoTimes(dayPunches[i].punchTime, currentTime);
//                   //     breakHours[0] += diff[0];
//                   //     breakHours[1] += diff[1];
//                   //     console.log("reminder for break setted at",dayPunches[i].punchDate )
//                   //     this.breakReminder.set(dayPunches[i].punchDate, `You have been taking a break from ${this.formatPunchTime(dayPunches[i].punchTime)}`);
//                   // }
//               }
//           }
//       }

//       // Sum total hours correctly and set into the Maps
//       let totalWM = workHours[0] * 60 + workHours[1];
//       let totalWH = Math.floor(totalWM / 60);
//       let totalWMRest = totalWM % 60;

//       // let totalBM = breakHours[0] * 60 + breakHours[1];
//       // let totalBH = Math.floor(totalBM / 60);
//       // let totalBMRest = totalBM % 60;

//  return[totalWH,totalWMRest]
//   }
// }



// differentBetweenTwoTimes(start: string, end: string): number[] {
//   const startHours = parseInt(start.substring(0, 2));
//   const startMinutes = parseInt(start.substring(3, 5));
//   const endHours = parseInt(end.substring(0, 2));
//   const endMinutes = parseInt(end.substring(3, 5));

//   const startTotalMinutes = startHours * 60 + startMinutes;
//   const endTotalMinutes = endHours * 60 + endMinutes;

//   let difference = endTotalMinutes - startTotalMinutes;

//   // Handle cases where the difference is negative (crossing midnight)
//   if (difference < 0) {
//     difference += 24 * 60; // Add 24 hours worth of minutes
//   }

//   // Convert the difference back to hours and minutes
//   const diffHours = Math.floor(difference / 60);
//   const diffMinutes = difference % 60;
//   return [diffHours, diffMinutes]
// }


  differentBetweenTwoTimes(start:string,end:string): number[]{
    const startHours=parseInt(start.substring(0,2));
    const  startMinutes = parseInt(start.substring(3,5));
    const endHours=parseInt(end.substring(0,2));
    const  endMinutes = parseInt(end.substring(3,5));
  
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
  
    let difference = endTotalMinutes - startTotalMinutes;
  
    // Handle cases where the difference is negative (crossing midnight)
    if (difference < 0) {
      difference += 24 * 60; // Add 24 hours worth of minutes
    }
  
    // Convert the difference back to hours and minutes
    const diffHours = Math.floor(difference / 60);
    const diffMinutes = difference % 60;
    return [diffHours,diffMinutes]
  }

  createDonutChart(): void {
    const usersName: string[] = [];
    const useresValues: string[] = [];
    this.usersWeeklyHours.forEach((value, key) => {
      usersName.push(key);
      const concatenatedValue = value[0] + (value[1] < 10 ? `.0${value[1]}` : `.${value[1]}`);
      console.log("the number ",value);
      
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
          // backgroundColor: ['#FF5733', '#4BC0C0'] // Adjust colors as needed
          backgroundColor:this.RandomColorsGenerator(useresValues.length)
        }]
      },
      options: {
        cutout: '50%', // This makes it a donut chart by cutting out the center
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          }
        }
      }
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
      backgroundColor:this.RandomColorsGenerator(1)[0]
    }));

    this.barChart = new Chart("barChart", {
      type: 'bar',
      data: {
        labels: this.weeks.map((day) => day.toDateString()), // Assuming this.weeks is an array of date strings or week labels
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
        }
      }
    });
  }

  // Method to get colors for each dataset (optional)
  // getColor(index: number): string {
  //   const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#4BC0C0']; // Define your colors
  //   return colors[index % colors.length]; // Cycle through the colors
  // }


  RandomColorsGenerator( quantity :number): string[] {
    let colors:string[]= []
    for (let i = 0; i < quantity; i++) {
      let color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      colors.push(color);
    }
    return colors;
  }

  exportChartToPDF(): void {
    // Check if the chart exists
    if (!this.barChart) {
      console.error("No chart available to export.");
      return;
    }

    // Get base64 image of the chart
    const chartImage = this.barChart.toBase64Image();

    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Add the chart image to the PDF
    pdf.addImage(chartImage, 'PNG', 10, 10, 190, 100); // Adjust positioning and size as needed

    // Save the PDF
    pdf.save('chart.pdf');

    // Generate the PDF and convert it to a Blob
    const pdfOutput = pdf.output('blob');

    // Create a URL from the Blob and open it in a new window
    const blobUrl = URL.createObjectURL(pdfOutput);
    window.open(blobUrl);
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
