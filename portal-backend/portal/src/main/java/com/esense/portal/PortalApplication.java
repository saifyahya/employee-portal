package com.esense.portal;

import com.esense.portal.entity.Role;
import com.esense.portal.entity.User;
import com.esense.portal.enums.DepartmentEnum;
import com.esense.portal.enums.RoleEnum;
import com.esense.portal.repository.UserRepository;
import com.esense.portal.service.IAuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@SpringBootApplication
@AllArgsConstructor
public class PortalApplication implements CommandLineRunner {
	private IAuthenticationService authService;
	private PasswordEncoder passwordEncoder;

	private UserRepository userRepository;

	public static void main(String[] args) {
		SpringApplication.run(PortalApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
//		User user = new User();
//		user.setPhoneNumber("+962790790790");
//		user.setActive(true);
//		user.setEmail("admin@esense.com");
//		user.setJoiningDate(LocalDateTime.now());
//		user.setPosition("HR");
//		user.setName("ARayyan");
//		user.setDepartment(DepartmentEnum.HR);
//		Role employeeRole = new Role();
//		employeeRole.setRole(RoleEnum.EMPLOYEE);
//		Role managerRole = new Role();
//		managerRole.setRole(RoleEnum.MANAGER);
//		user.addToRoles(employeeRole);
//		user.addToRoles(managerRole);
//		user.setPassword(passwordEncoder.encode("Admin@123"));
//		userRepository.save(user);

	}
}
