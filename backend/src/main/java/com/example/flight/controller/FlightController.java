package com.example.flight.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.flight.dto.FlightDTO;
import com.example.flight.entity.Flight;
import com.example.flight.service.FlightService;

@RestController
@RequestMapping("/api/flights")
public class FlightController {
    
    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }
    
    @GetMapping
    public ResponseEntity<List<FlightDTO>> getAllFlights() {
        List<FlightDTO> flights = flightService.getAllFlights()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(flights);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FlightDTO> getFlightById(@PathVariable Long id) {
        return flightService.getFlightById(id)
                .map(flight -> ResponseEntity.ok(convertToDTO(flight)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/number/{flightNumber}")
    public ResponseEntity<FlightDTO> getFlightByNumber(@PathVariable String flightNumber) {
        return flightService.getFlightByNumber(flightNumber)
                .map(flight -> ResponseEntity.ok(convertToDTO(flight)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<FlightDTO> createFlight(@RequestBody FlightDTO flightDTO) {
        Flight flight = convertToEntity(flightDTO);
        Flight savedFlight = flightService.createFlight(flight);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedFlight));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<FlightDTO> updateFlight(@PathVariable Long id, @RequestBody FlightDTO flightDTO) {
        try {
            Flight flight = convertToEntity(flightDTO);
            Flight updatedFlight = flightService.updateFlight(id, flight);
            return ResponseEntity.ok(convertToDTO(updatedFlight));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }
    
    private FlightDTO convertToDTO(Flight flight) {
        return new FlightDTO(
            flight.getId(),
            flight.getFlightNumber(),
            flight.getAirline(),
            flight.getDepartureAirport(),
            flight.getArrivalAirport(),
            flight.getDepartureTime(),
            flight.getArrivalTime(),
            flight.getAvailableSeats(),
            flight.getPrice()
        );
    }
    
    private Flight convertToEntity(FlightDTO flightDTO) {
        // For new flights, don't set id or flightNumber (they will be auto-generated)
        if (flightDTO.getId() == null) {
            return new Flight(
                flightDTO.getAirline(),
                flightDTO.getDepartureAirport(),
                flightDTO.getArrivalAirport(),
                flightDTO.getDepartureTime(),
                flightDTO.getArrivalTime(),
                flightDTO.getAvailableSeats(),
                flightDTO.getPrice()
            );
        }
        // For updates, use the full constructor
        return new Flight(
            flightDTO.getId(),
            flightDTO.getFlightNumber(),
            flightDTO.getAirline(),
            flightDTO.getDepartureAirport(),
            flightDTO.getArrivalAirport(),
            flightDTO.getDepartureTime(),
            flightDTO.getArrivalTime(),
            flightDTO.getAvailableSeats(),
            flightDTO.getPrice()
        );
    }
}
