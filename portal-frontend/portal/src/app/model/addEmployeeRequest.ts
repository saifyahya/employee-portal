export class AddEmployeeRequest {
    name: string;
    department: string;
    email: string;
    position: string;
    password: string;
    phoneNumber: string;
    joiningDate: string;
  
    constructor(
      name: string,
      department: string,
      email: string,
      position: string,
      password: string,
      phoneNumber: string,
      joiningDate: string,
    
    ) 
    
    
    {
      this.name = name;
      this.department = department;
      this.email = email;
      this.position = position;
      this.password = password;
      this.phoneNumber = phoneNumber;
      this.joiningDate = joiningDate;
  

    }
  
  }
  