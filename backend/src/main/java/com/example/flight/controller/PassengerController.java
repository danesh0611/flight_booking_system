package com.example.flight.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.flight.dto.PassengerDTO;
import com.example.flight.entity.Booking;
import com.example.flight.entity.Passenger;
import com.example.flight.repository.BookingRepository;
import com.example.flight.service.PassengerService;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = "http://localhost:3000")
public class PassengerController {
    
    @Autowired
    private PassengerService passengerService;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @PostMapping
    public ResponseEntity<PassengerDTO> addPassenger(@RequestBody PassengerDTO passengerDTO,
                                                     @RequestParam Long bookingId) {
        // Fetch the booking
        Booking booking = bookingRepository.findById(bookingId)
            .orElse(null);
        
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        
        // Create passenger entity
        Passenger passenger = new Passenger();
        passenger.setFullName(passengerDTO.getFullName());
        passenger.setEmail(passengerDTO.getEmail());
        passenger.setPhone(passengerDTO.getPhone());
        passenger.setDateOfBirth(passengerDTO.getDateOfBirth());
        passenger.setGender(passengerDTO.getGender());
        passenger.setNationality(passengerDTO.getNationality());
        passenger.setAadharNumber(passengerDTO.getAadharNumber());
        passenger.setPassportNumber(passengerDTO.getPassportNumber());
        passenger.setVisaNumber(passengerDTO.getVisaNumber());
        passenger.setSeatNumber(passengerDTO.getSeatNumber());
        passenger.setBooking(booking);
        
        PassengerDTO savedPassenger = passengerService.savePassenger(passenger);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPassenger);
    }
    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PassengerDTO>> getPassengersByBooking(@PathVariable Long bookingId) {
        List<PassengerDTO> passengers = passengerService.getPassengersByBooking(bookingId);
        return ResponseEntity.ok(passengers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PassengerDTO> getPassenger(@PathVariable Long id) {
        PassengerDTO passenger = passengerService.getPassengerById(id);
        if (passenger == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(passenger);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PassengerDTO> updatePassenger(@PathVariable Long id,
                                                        @RequestBody PassengerDTO passengerDTO) {
        Passenger passengerDetails = new Passenger();
        passengerDetails.setFullName(passengerDTO.getFullName());
        passengerDetails.setEmail(passengerDTO.getEmail());
        passengerDetails.setPhone(passengerDTO.getPhone());
        passengerDetails.setDateOfBirth(passengerDTO.getDateOfBirth());
        passengerDetails.setGender(passengerDTO.getGender());
        passengerDetails.setNationality(passengerDTO.getNationality());
        passengerDetails.setAadharNumber(passengerDTO.getAadharNumber());
        passengerDetails.setPassportNumber(passengerDTO.getPassportNumber());
        passengerDetails.setVisaNumber(passengerDTO.getVisaNumber());
        passengerDetails.setSeatNumber(passengerDTO.getSeatNumber());
        
        PassengerDTO updatedPassenger = passengerService.updatePassenger(id, passengerDetails);
        if (updatedPassenger == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(updatedPassenger);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassenger(@PathVariable Long id) {
        boolean deleted = passengerService.deletePassenger(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping("/{id}/seat")
    public ResponseEntity<PassengerDTO> assignSeat(@PathVariable Long id, 
                                                   @RequestParam String seatNumber) {
        Passenger passengerDetails = new Passenger();
        passengerDetails.setSeatNumber(seatNumber);
        
        PassengerDTO updatedPassenger = passengerService.updatePassenger(id, passengerDetails);
        if (updatedPassenger == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(updatedPassenger);
    }
}
