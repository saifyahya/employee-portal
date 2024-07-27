import { Punch } from "./punch";

export class User{
    name:string;
    email:string;
    joiningDate:Date;
    department:string;
    position:string;
    punches:Punch[];


    constructor(
        name: string,
        email: string,
        joiningDate: Date,
        department: string,
        position: string,
        punches: Punch[] = []
      ) {
        this.name = name;
        this.email = email;
        this.joiningDate = joiningDate;
        this.department = department;
        this.position = position;
        this.punches = punches;
      }
}