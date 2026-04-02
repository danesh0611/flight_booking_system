package com.example.flight.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.flight.dto.UserDTO;
import com.example.flight.entity.User;
import com.example.flight.repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public UserDTO register(String email, String password, String name) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User(email, password, name, "USER");
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    public UserDTO login(String email, String password) {
        Optional<User> user = userRepository.findByEmailAndPassword(email, password);
        if (!user.isPresent()) {
            throw new RuntimeException("Invalid email or password");
        }
        return convertToDTO(user.get());
    }
    
    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id).map(this::convertToDTO);
    }
    
    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::convertToDTO);
    }
    
    public UserDTO createAdmin(String email, String password, String name) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User(email, password, name, "ADMIN");
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    public UserDTO updateUser(Long id, String name, String password) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(name);
        if (password != null && !password.isEmpty()) {
            user.setPassword(password);
        }
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}
