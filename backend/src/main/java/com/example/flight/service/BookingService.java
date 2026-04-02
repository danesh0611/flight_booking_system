package com.example.flight.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.flight.dto.BookingDTO;
import com.example.flight.dto.PassengerDTO;
import com.example.flight.entity.Booking;
import com.example.flight.entity.Flight;
import com.example.flight.entity.Passenger;
import com.example.flight.entity.User;
import com.example.flight.repository.BookingRepository;
import com.example.flight.repository.FlightRepository;
import com.example.flight.repository.UserRepository;

@Service
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, 
                         FlightRepository flightRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.flightRepository = flightRepository;
    }
    
    public BookingDTO createBooking(Long userId, Long flightId, Integer numberOfSeats) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        
        if (flight.getAvailableSeats() < numberOfSeats) {
            throw new RuntimeException("Not enough seats available");
        }
        
        Double totalPrice = flight.getPrice() * numberOfSeats + (numberOfSeats * 350); // price + taxes + convenience
        
        Booking booking = new Booking(user, flight, numberOfSeats, totalPrice, "CONFIRMED");
        flight.setAvailableSeats(flight.getAvailableSeats() - numberOfSeats);
        flightRepository.save(flight);
        
        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }
    
    public List<BookingDTO> getUserBookings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return bookingRepository.findByUser(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public BookingDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return convertToDTO(booking);
    }
    
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus("CANCELLED");
        Flight flight = booking.getFlight();
        flight.setAvailableSeats(flight.getAvailableSeats() + booking.getNumberOfSeats());
        flightRepository.save(flight);
        bookingRepository.save(booking);
    }
    
    private BookingDTO convertToDTO(Booking booking) {
        List<PassengerDTO> passengerDTOs = booking.getPassengers() != null ?
            booking.getPassengers().stream()
                .map(this::convertPassengerToDTO)
                .collect(Collectors.toList()) : List.of();
        
        Flight flight = booking.getFlight();
        return new BookingDTO(
            booking.getId(),
            booking.getUser().getId(),
            flight.getId(),
            flight.getFlightNumber(),
            flight.getAirline(),
            flight.getDepartureAirport(),
            flight.getArrivalAirport(),
            flight.getDepartureTime(),
            flight.getArrivalTime(),
            booking.getNumberOfSeats(),
            booking.getTotalPrice(),
            booking.getStatus(),
            booking.getBookedAt(),
            passengerDTOs
        );
    }
    
    private PassengerDTO convertPassengerToDTO(Passenger passenger) {
        return new PassengerDTO(
            passenger.getId(),
            passenger.getFullName(),
            passenger.getEmail(),
            passenger.getPhone(),
            passenger.getDateOfBirth(),
            passenger.getGender(),
            passenger.getNationality(),
            passenger.getAadharNumber(),
            passenger.getPassportNumber(),
            passenger.getVisaNumber(),
            passenger.getSeatNumber()
        );
    }
}
