import { Punch } from "./punch";

export class User{
    name:string;
    email:string;
    joiningDate:Date;
    department:string;
    position:string;
    phoneNumber:string;
    punches:Punch[];


    constructor(
        name: string,
        email: string,
        joiningDate: Date,
        department: string,
        position: string,
        punches: Punch[] = [],
        phoneNumber:string
      ) {
        this.name = name;
        this.email = email;
        this.joiningDate = joiningDate;
        this.department = department;
        this.position = position;
        this.punches = punches;
        this.phoneNumber=phoneNumber;
      }
}