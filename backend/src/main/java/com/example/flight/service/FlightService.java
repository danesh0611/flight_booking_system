package com.example.flight.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.flight.entity.Flight;
import com.example.flight.repository.FlightRepository;

@Service
public class FlightService {
    
    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }
    
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
    
    public Optional<Flight> getFlightById(Long id) {
        return flightRepository.findById(id);
    }
    
    public Optional<Flight> getFlightByNumber(String flightNumber) {
        return flightRepository.findByFlightNumber(flightNumber);
    }
    
    public Flight createFlight(Flight flight) {
        return flightRepository.save(flight);
    }
    
    public Flight updateFlight(Long id, Flight flightDetails) {
        return flightRepository.findById(id)
                .map(flight -> {
                    flight.setFlightNumber(flightDetails.getFlightNumber());
                    flight.setAirline(flightDetails.getAirline());
                    flight.setDepartureAirport(flightDetails.getDepartureAirport());
                    flight.setArrivalAirport(flightDetails.getArrivalAirport());
                    flight.setDepartureTime(flightDetails.getDepartureTime());
                    flight.setArrivalTime(flightDetails.getArrivalTime());
                    flight.setAvailableSeats(flightDetails.getAvailableSeats());
                    flight.setPrice(flightDetails.getPrice());
                    return flightRepository.save(flight);
                })
                .orElseThrow(() -> new RuntimeException("Flight not found"));
    }
    
    public void deleteFlight(Long id) {
        flightRepository.deleteById(id);
    }
}
