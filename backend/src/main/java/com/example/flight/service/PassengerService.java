package com.example.flight.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flight.dto.PassengerDTO;
import com.example.flight.entity.Passenger;
import com.example.flight.repository.PassengerRepository;

@Service
public class PassengerService {
    
    @Autowired
    private PassengerRepository passengerRepository;
    
    public PassengerDTO savePassenger(Passenger passenger) {
        Passenger savedPassenger = passengerRepository.save(passenger);
        return convertToDTO(savedPassenger);
    }
    
    public PassengerDTO getPassengerById(Long id) {
        return passengerRepository.findById(id)
            .map(this::convertToDTO)
            .orElse(null);
    }
    
    public List<PassengerDTO> getPassengersByBooking(Long bookingId) {
        return passengerRepository.findByBookingId(bookingId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public PassengerDTO updatePassenger(Long id, Passenger passengerDetails) {
        return passengerRepository.findById(id)
            .map(passenger -> {
                if (passengerDetails.getFullName() != null)
                    passenger.setFullName(passengerDetails.getFullName());
                if (passengerDetails.getEmail() != null)
                    passenger.setEmail(passengerDetails.getEmail());
                if (passengerDetails.getPhone() != null)
                    passenger.setPhone(passengerDetails.getPhone());
                if (passengerDetails.getDateOfBirth() != null)
                    passenger.setDateOfBirth(passengerDetails.getDateOfBirth());
                if (passengerDetails.getGender() != null)
                    passenger.setGender(passengerDetails.getGender());
                if (passengerDetails.getNationality() != null)
                    passenger.setNationality(passengerDetails.getNationality());
                if (passengerDetails.getAadharNumber() != null)
                    passenger.setAadharNumber(passengerDetails.getAadharNumber());
                if (passengerDetails.getPassportNumber() != null)
                    passenger.setPassportNumber(passengerDetails.getPassportNumber());
                if (passengerDetails.getVisaNumber() != null)
                    passenger.setVisaNumber(passengerDetails.getVisaNumber());
                if (passengerDetails.getSeatNumber() != null)
                    passenger.setSeatNumber(passengerDetails.getSeatNumber());
                Passenger updatedPassenger = passengerRepository.save(passenger);
                return convertToDTO(updatedPassenger);
            })
            .orElse(null);
    }
    
    public boolean deletePassenger(Long id) {
        if (passengerRepository.existsById(id)) {
            passengerRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public void deletePassengersForBooking(Long bookingId) {
        List<Passenger> passengers = passengerRepository.findByBookingId(bookingId);
        passengerRepository.deleteAll(passengers);
    }
    
    private PassengerDTO convertToDTO(Passenger passenger) {
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
