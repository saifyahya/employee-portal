package com.esense.portal.repository;

import com.esense.portal.dto.UserDto;
import com.esense.portal.entity.User;
import com.esense.portal.enums.DepartmentEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    List<User> findByNameContaining(String name);
    List<User> findByDepartmentOrderByName(DepartmentEnum name);

    long countByDepartment(DepartmentEnum name);
    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);

    @Query("SELECT u.name FROM User u")
    List<String> findAllUsersName();

    @Query("SELECT u.email FROM User u")
    List<String> findAllUsersEmail();


}
