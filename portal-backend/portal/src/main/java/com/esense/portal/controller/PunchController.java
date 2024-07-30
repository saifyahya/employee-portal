package com.esense.portal.controller;

import com.esense.portal.dto.PunchDto;
import com.esense.portal.dto.ResponseDto;
import com.esense.portal.dto.auth.UserPrincipal;
import com.esense.portal.service.IPunchService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
@CrossOrigin({"http://127.0.0.1:4200", "http://localhost:4200"})
public class PunchController {
    private IPunchService punchService;

//    @GetMapping("/punches")
//    public ResponseEntity<List<PunchDto>> getAllUserPunches(@RequestParam String name) {
//        List<PunchDto> punches = punchService.getAllUserPunches(name);
//        return new ResponseEntity<>(punches, HttpStatus.OK);
//    }

//    @GetMapping("/punches/date")
//    public ResponseEntity<List<PunchDto>> getAllUserPunchesByDate(@RequestParam String name, @RequestParam LocalDate date) {
//        List<PunchDto> punches = punchService.getUserPunchesByDate(name, date);
//        return new ResponseEntity<>(punches, HttpStatus.OK);
//    }

    @GetMapping("/punches/dates")
    public ResponseEntity<List<PunchDto>> getAllUserPunchesByDatePeriod(@RequestParam String name, @RequestParam LocalDate sDate,@RequestParam LocalDate eDate) {
        List<PunchDto> punches = punchService.getUserPunchesWithinDatePeriod(name, sDate,eDate);
        return new ResponseEntity<>(punches, HttpStatus.OK);
    }

    @PostMapping("/punches")
    public ResponseEntity<ResponseDto> SaveUserPunch(@RequestParam String type, Authentication authentication,Principal principal) {
        UserPrincipal principal2 = (UserPrincipal)authentication.getPrincipal();
        System.out.println(principal.getName());
        System.out.println(principal2.getUsername());
        if(principal!=null) {
            PunchDto punchDto = new PunchDto(LocalDate.now(), LocalTime.now(),type);
            punchService.savePunch(punchDto, principal2.getUsername());
            return new ResponseEntity<>(new ResponseDto(true, HttpStatus.OK.toString()), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(new ResponseDto(false, HttpStatus.FORBIDDEN.toString()), HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/punches/email")
    public ResponseEntity<ResponseDto> AddNewUserPunch(@RequestBody PunchDto punchDto, @RequestParam String email) {
        punchService.savePunch(punchDto, email);
        return new ResponseEntity<>(new ResponseDto(true, HttpStatus.OK.toString()), HttpStatus.OK);
    }


}
