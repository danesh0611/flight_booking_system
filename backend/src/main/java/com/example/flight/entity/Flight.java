package com.example.flight.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "flights")
public class Flight {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String flightNumber;
    
    @Column(nullable = false)
    private String airline;
    
    @Column(nullable = false)
    private String departureAirport;
    
    @Column(nullable = false)
    private String arrivalAirport;
    
    @Column(nullable = false)
    private String departureTime;
    
    @Column(nullable = false)
    private String arrivalTime;
    
    @Column(nullable = false)
    private Integer availableSeats;
    
    @Column(nullable = false)
    private Double price;

    // Constructors
    public Flight() {}

    public Flight(Long id, String flightNumber, String airline, String departureAirport, 
                  String arrivalAirport, String departureTime, String arrivalTime, 
                  Integer availableSeats, Double price) {
        this.id = id;
        this.flightNumber = flightNumber;
        this.airline = airline;
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.availableSeats = availableSeats;
        this.price = price;
    }

    public Flight(String airline, String departureAirport, 
                  String arrivalAirport, String departureTime, String arrivalTime, 
                  Integer availableSeats, Double price) {
        this.airline = airline;
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.availableSeats = availableSeats;
        this.price = price;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    @PrePersist
    public void generateFlightNumber() {
        if (this.flightNumber == null || this.flightNumber.isEmpty()) {
            // Generate flight number as FL-XXXXXX (FL prefix + 6 random digits)
            String randomPart = String.valueOf((int)(Math.random() * 900000) + 100000);
            this.flightNumber = "FL" + randomPart;
        }
    }
}
