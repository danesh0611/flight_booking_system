package com.example.flight.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BookingDTO {
    private Long id;
    private Long userId;
    private Long flightId;
    private String flightNumber;
    private String airline;
    private String departureAirport;
    private String arrivalAirport;
    private String departureTime;
    private String arrivalTime;
    private Integer numberOfSeats;
    private Double totalPrice;
    private String status;
    private LocalDateTime bookedAt;
    private List<PassengerDTO> passengers;

    // Constructors
    public BookingDTO() {}

    public BookingDTO(Long id, Long userId, Long flightId, Integer numberOfSeats, 
                     Double totalPrice, String status, LocalDateTime bookedAt) {
        this.id = id;
        this.userId = userId;
        this.flightId = flightId;
        this.numberOfSeats = numberOfSeats;
        this.totalPrice = totalPrice;
        this.status = status;
        this.bookedAt = bookedAt;
    }

    public BookingDTO(Long id, Long userId, Long flightId, Integer numberOfSeats, 
                     Double totalPrice, String status, LocalDateTime bookedAt, List<PassengerDTO> passengers) {
        this.id = id;
        this.userId = userId;
        this.flightId = flightId;
        this.numberOfSeats = numberOfSeats;
        this.totalPrice = totalPrice;
        this.status = status;
        this.bookedAt = bookedAt;
        this.passengers = passengers;
    }

    public BookingDTO(Long id, Long userId, Long flightId, String flightNumber, String airline,
                     String departureAirport, String arrivalAirport, String departureTime, 
                     String arrivalTime, Integer numberOfSeats, Double totalPrice, 
                     String status, LocalDateTime bookedAt, List<PassengerDTO> passengers) {
        this.id = id;
        this.userId = userId;
        this.flightId = flightId;
        this.flightNumber = flightNumber;
        this.airline = airline;
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.numberOfSeats = numberOfSeats;
        this.totalPrice = totalPrice;
        this.status = status;
        this.bookedAt = bookedAt;
        this.passengers = passengers;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public Integer getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(Integer numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }

    public List<PassengerDTO> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerDTO> passengers) {
        this.passengers = passengers;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getAirline() {
        return airline;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public String getDepartureAirport() {
        return departureAirport;
    }

    public void setDepartureAirport(String departureAirport) {
        this.departureAirport = departureAirport;
    }

    public String getArrivalAirport() {
        return arrivalAirport;
    }

    public void setArrivalAirport(String arrivalAirport) {
        this.arrivalAirport = arrivalAirport;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
}
