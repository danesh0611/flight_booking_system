package com.example.flight.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.flight.dto.BookingDTO;
import com.example.flight.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }
    
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            Long flightId = Long.parseLong(request.get("flightId").toString());
            Integer numberOfSeats = Integer.parseInt(request.get("numberOfSeats").toString());
            
            BookingDTO booking = bookingService.createBooking(userId, flightId, numberOfSeats);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        try {
            List<BookingDTO> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable Long userId) {
        try {
            List<BookingDTO> bookings = bookingService.getUserBookings(userId);
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBooking(@PathVariable Long bookingId) {
        try {
            BookingDTO booking = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId) {
        try {
            bookingService.cancelBooking(bookingId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
