package com.trying.report.controller;

import com.trying.report.entity.Role;
import com.trying.report.entity.User;
import com.trying.report.repository.RoleRepository;
import com.trying.report.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    // Create new user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String roleName = payload.get("role");

        if (userService.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // will be encoded in service
        user.setRole(role);

        User saved = userService.saveUser(user);
        return ResponseEntity.ok(saved);
    }

    // Update existing user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String roleName = payload.get("role");

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User updatedUser = userService.updateUser(id, username, password, role);
        return ResponseEntity.ok(updatedUser);
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Map<String, Object>>> fetchRoles() {
        List<Map<String, Object>> roleList = roleRepository.findAll().stream()
                .map(role -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", role.getId());
                    m.put("name", role.getName());
                    return m;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(roleList);
    }

    // Get all users

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userService.findAll();

        List<Map<String, Object>> result = users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("password", u.getPlainPassword() != null ? u.getPlainPassword() : "");

            Map<String, Object> roleMap = new HashMap<>();
            if (u.getRole() != null) {
                roleMap.put("id", u.getRole().getId());
                roleMap.put("name", u.getRole().getName());
            }
            map.put("role", roleMap);
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }



//    @GetMapping("/me")
//    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("username", userDetails.getUsername());
//        response.put("role", /* fetch role from User entity */);
//        return ResponseEntity.ok(response);
//    }



}
