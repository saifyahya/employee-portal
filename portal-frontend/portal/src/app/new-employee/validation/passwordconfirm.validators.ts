import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export class PasswordConfirmValidator{

    static  PasswordsMatches(control:AbstractControl): ValidationErrors | null {
        const password= control.get('userData.password');
        const passwordConfirm = control.get('userData.passwordConfirm');
        if(password && passwordConfirm && password.value !== passwordConfirm.value){
            return {"passwordMatches":true}
        }
        return null;
    }
}