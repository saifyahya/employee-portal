package com.esense.portal.controller;

import com.esense.portal.dto.ResponseDto;
import com.esense.portal.service.impl.ReportService;
import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.JRException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
@CrossOrigin({"http://127.0.0.1:4200", "http://localhost:4200"})
public class ReportController {
    private ReportService reportService;
    @GetMapping("/report")
    public ResponseEntity getUserWeeklyReport(@RequestParam String username,@RequestParam String startDate,@RequestParam String endDate){
        try {
            byte[] output =  reportService.generateReport(username,startDate,endDate);
            HttpHeaders httpHeaders=new HttpHeaders();
            httpHeaders.setContentType(MediaType.APPLICATION_PDF);
            return new ResponseEntity<>(output,httpHeaders,HttpStatus.OK);
        } catch (JRException | SQLException | IOException e) {
            return new ResponseEntity(new ResponseDto(false,"Error generating User Report:"+e.getMessage()),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
