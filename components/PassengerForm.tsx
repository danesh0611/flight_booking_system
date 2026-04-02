'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Passenger {
  id?: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality: string
  aadharNumber?: string
  passportNumber: string
  visaNumber?: string
  seatNumber?: string
}

interface PassengerFormProps {
  numberOfPassengers: number
  onPassengersChange: (passengers: Passenger[]) => void
}

const PassengerForm: React.FC<PassengerFormProps> = ({ numberOfPassengers, onPassengersChange }) => {
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array(numberOfPassengers).fill(null).map((_, i) => ({
      id: `${i}`,
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      aadharNumber: '',
      passportNumber: '',
      visaNumber: '',
      seatNumber: '',
    }))
  )

  React.useEffect(() => {
    if (numberOfPassengers !== passengers.length) {
      const newPassengers = Array(numberOfPassengers).fill(null).map((_, i) => {
        return passengers[i] || {
          id: `${i}`,
          fullName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          nationality: '',
          aadharNumber: '',
          passportNumber: '',
          visaNumber: '',
          seatNumber: '',
        }
      })
      setPassengers(newPassengers)
    }
  }, [numberOfPassengers])

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    setPassengers(updated)
    onPassengersChange(updated)
  }

  return (
    <div className='flex flex-col rounded-md bg-slate-200 w-full p-4'>
      <div className='font-bold text-lg mb-4'>Passenger Details</div>
      <hr className="border-black mb-4"></hr>
      
      <div className='bg-blue-50 border-l-4 border-blue-500 p-3 mb-6 rounded'>
        <p className='text-sm text-gray-700'>
          <strong>Required fields:</strong> All fields marked with <span className='text-red-600 font-bold'>*</span> must be filled. 
          Visa number is optional; passport number is required for international travel.
        </p>
      </div>
      
      {passengers.map((passenger, index) => (
        <div key={index} className='mb-6 pb-6 border-b border-gray-400'>
          <h3 className='font-semibold mb-4'>Passenger {index + 1}</h3>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <Label htmlFor={`fullName-${index}`} className='mb-2'>Full Name *</Label>
              <Input
                id={`fullName-${index}`}
                placeholder='Enter full name'
                value={passenger.fullName}
                onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                required
              />
            </div>

            <div className='flex flex-col'>
              <Label htmlFor={`email-${index}`} className='mb-2'>Email *</Label>
              <Input
                id={`email-${index}`}
                type='email'
                placeholder='Enter email'
                value={passenger.email}
                onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                required
              />
            </div>

            <div className='flex flex-col'>
              <Label htmlFor={`phone-${index}`} className='mb-2'>Phone Number *</Label>
              <Input
                id={`phone-${index}`}
                placeholder='Enter phone number'
                value={passenger.phone}
                onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                required
              />
            </div>

            <div className='flex flex-col'>
              <Label htmlFor={`dob-${index}`} className='mb-2'>Date of Birth *</Label>
              <Input
                id={`dob-${index}`}
                type='date'
                value={passenger.dateOfBirth}
                onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                required
              />
            </div>

            <div className='flex flex-col'>
              <Label htmlFor={`gender-${index}`} className='mb-2'>Gender *</Label>
              <select 
                id={`gender-${index}`}
                value={passenger.gender}
                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                className='border border-gray-300 rounded px-3 py-2 bg-white'
                required
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className='flex flex-col'>
              <Label htmlFor={`nationality-${index}`} className='mb-2'>Nationality *</Label>
              <Input
                id={`nationality-${index}`}
                placeholder='Enter nationality'
                value={passenger.nationality}
                onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                required
              />
            </div>

            <div className='flex flex-col'>
              <Label htmlFor={`aadhar-${index}`} className='mb-2'>Aadhar Number (Optional)</Label>
              <Input
                id={`aadhar-${index}`}
                placeholder='Enter aadhar number'
                value={passenger.aadharNumber}
                onChange={(e) => handlePassengerChange(index, 'aadharNumber', e.target.value)}
              />
            </div>

            <div className='flex flex-col'>
              <Label htmlFor={`passport-${index}`} className='mb-2'>Passport Number *</Label>
              <Input
                id={`passport-${index}`}
                placeholder='Enter passport number'
                value={passenger.passportNumber}
                onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                required
              />
            </div>

            <div className='flex flex-col'>
              <Label htmlFor={`visa-${index}`} className='mb-2'>Visa Number (Optional)</Label>
              <Input
                id={`visa-${index}`}
                placeholder='Enter visa number if applicable'
                value={passenger.visaNumber}
                onChange={(e) => handlePassengerChange(index, 'visaNumber', e.target.value)}
              />
            </div>

            <div className='flex flex-col'>
              <Label htmlFor={`seat-${index}`} className='mb-2'>Seat Number (Will be allocated after booking)</Label>
              <Input
                id={`seat-${index}`}
                placeholder='Seat will be shown after booking confirmation'
                value={passenger.seatNumber}
                readOnly
                className='bg-gray-100'
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PassengerForm
