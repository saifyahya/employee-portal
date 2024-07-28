package com.esense.portal.service.impl;

import lombok.AllArgsConstructor;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.util.JRLoader;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class ReportService {
private DataSource dataSource;

public byte[] generateReport(String username, String startDate, String endDate) throws JRException, SQLException, IOException {
    JasperReport report = JasperCompileManager.compileReport("src/main/resources/reports/employeeWeeklyData.jrxml");
    Map<String, Object> params = new HashMap<>();
    params.put("username", username);
    params.put("start_date", startDate);
    params.put("end_date", endDate);
    params.put("logo", "src/main/resources/images/esense-logo.png");
    JasperPrint jasperPrint = JasperFillManager.fillReport(report, params, dataSource.getConnection());
    return JasperExportManager.exportReportToPdf(jasperPrint);
}



}






