import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { apiClient } from '@/lib/api'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface Passenger {
  id: number
  fullName: string
  email: string
  phone: string
  passportNumber: string
  visaNumber: string
  seatNumber?: string
}

interface BookingConfirmation {
  id: number
  flightNumber: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  totalPrice: number
  passengers: Passenger[]
}

const Booked = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [booking, setBooking] = useState<BookingConfirmation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    // Try to get bookingId from session storage or URL params
    const id = sessionStorage.getItem('lastBookingId') || router.query.bookingId as string
    
    if (id) {
      setBookingId(id)
      fetchBookingDetails(id)
    } else {
      setIsLoading(false)
    }
  }, [router.query])

  const fetchBookingDetails = async (id: string) => {
    try {
      setIsLoading(true)
      const bookingData = await apiClient.get(`/bookings/${id}`)
      
      // Fetch passengers for this booking
      const passengersData = await apiClient.get(`/passengers/booking/${id}`)
      
      // Combine data for display
      const confirmationData: BookingConfirmation = {
        id: bookingData.id,
        flightNumber: bookingData.flightNumber || 'FL-XXXX',
        airline: bookingData.airline || 'AirVista',
        departureAirport: bookingData.departureAirport || 'DEP',
        arrivalAirport: bookingData.arrivalAirport || 'ARR',
        departureTime: bookingData.departureTime || 'TBD',
        arrivalTime: bookingData.arrivalTime || 'TBD',
        totalPrice: bookingData.totalPrice || 0,
        passengers: passengersData
      }
      
      setBooking(confirmationData)
    } catch (error) {
      console.error('Error fetching booking:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load booking confirmation",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const printTicket = () => {
    if (!booking) return

    const ticketContent = `
      <html>
        <head>
          <title>Airline Ticket - ${booking.flightNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .ticket { border: 2px solid #333; padding: 20px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .flight-info { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            .total { font-weight: bold; text-align: right; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1>${booking.airline}</h1>
              <h2>AIRLINE TICKET</h2>
              <p>Booking Reference: ${booking.id}</p>
            </div>

            <div class="section">
              <div class="section-title">Flight Information</div>
              <div class="flight-info">
                <div>
                  <p><strong>Flight Number:</strong> ${booking.flightNumber}</p>
                  <p><strong>From:</strong> ${booking.departureAirport}</p>
                  <p><strong>Time:</strong> ${booking.departureTime}</p>
                </div>
                <div>
                  <p><strong>Airline:</strong> ${booking.airline}</p>
                  <p><strong>To:</strong> ${booking.arrivalAirport}</p>
                  <p><strong>Time:</strong> ${booking.arrivalTime}</p>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Passenger Details & Seat Numbers</div>
              <table>
                <thead>
                  <tr>
                    <th>Passenger Name</th>
                    <th>Email</th>
                    <th>Passport</th>
                    <th>Seat</th>
                  </tr>
                </thead>
                <tbody>
                  ${booking.passengers.map(p => `
                    <tr>
                      <td>${p.fullName}</td>
                      <td>${p.email}</td>
                      <td>${p.passportNumber}</td>
                      <td style="font-weight: bold; color: #0066cc;">${p.seatNumber || 'TBD'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Total Cost</div>
              <p style="text-align: right; font-size: 18px;"><strong>$${booking.totalPrice}</strong></p>
            </div>

            <div class="footer">
              <p>✓ Booking Confirmed. Please visit airport counter for final check-in.</p>
              <p>This is an official airline ticket. Keep it safe for check-in.</p>
            </div>
          </div>
        </body>
      </html>
    `
    
    const newWindow = window.open()
    newWindow?.document.write(ticketContent)
    newWindow?.document.close()
    setTimeout(() => newWindow?.print(), 250)
  }

  if (isLoading) {
    return (
      <div className='h-screen w-screen flex justify-center items-center flex-col'>
        <p>Loading booking confirmation...</p>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className='h-screen w-screen flex justify-center items-center flex-col'>
        <Image src={"/assets/congrats.webp"} alt="Congrats" width={200} height={200} />
        <h2 style={{ textAlign: 'center' }} className='mt-4 text-2xl font-bold'>Congratulations! Your booking has been confirmed</h2>
        <p className='mt-4 text-gray-600'>Pay the amount at the airport counter and pick your ticket</p>

        <Link href="/">
          <Button className='mt-6 bg-lime-500 hover:bg-lime-600'>Back to home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-green-50 to-white p-4 py-12'>
      <div className='lg:max-w-4xl lg:mx-auto'>
        <div className='flex justify-center mb-6'>
          <Image src={"/assets/congrats.webp"} alt="Congrats" width={150} height={150} />
        </div>

        <h1 className='text-center text-3xl font-bold text-green-600 mb-2'>Booking Confirmed!</h1>
        <p className='text-center text-gray-600 mb-8'>Confirmation details are shown below</p>

        {/* Flight Details */}
        <div className='flex flex-col rounded-md bg-blue-50 border-2 border-blue-200 w-full p-6 mb-6'>
          <div className='font-bold text-lg mb-4'>Flight Details</div>
          <hr className="border-blue-300 mb-4"></hr>
          
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
            <div>
              <p className='text-sm text-gray-600'>Flight Number</p>
              <p className='font-semibold text-lg'>{booking.flightNumber}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Airline</p>
              <p className='font-semibold'>{booking.airline}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Departure</p>
              <p className='font-semibold'>{booking.departureAirport}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Arrival</p>
              <p className='font-semibold'>{booking.arrivalAirport}</p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-600'>Departure Time</p>
              <p className='font-semibold'>{booking.departureTime}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Arrival Time</p>
              <p className='font-semibold'>{booking.arrivalTime}</p>
            </div>
          </div>
        </div>

        {/* Passengers Details */}
        <div className='flex flex-col rounded-md bg-slate-50 border-2 border-slate-200 w-full p-6 mb-6'>
          <div className='font-bold text-lg mb-4'>Passenger Details</div>
          <hr className="border-slate-300 mb-4"></hr>

          {booking.passengers.map((passenger, index) => (
            <div key={passenger.id} className='mb-6 pb-6 border-b border-slate-300 last:border-b-0'>
              <h3 className='font-semibold text-md mb-3'>Passenger {index + 1}</h3>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-600'>Full Name</p>
                  <p className='font-semibold'>{passenger.fullName}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Email</p>
                  <p className='font-semibold text-sm'>{passenger.email}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Phone</p>
                  <p className='font-semibold'>{passenger.phone}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Passport Number</p>
                  <p className='font-semibold'>{passenger.passportNumber}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Visa Number</p>
                  <p className='font-semibold'>{passenger.visaNumber}</p>
                </div>
                <div className='bg-blue-100 p-3 rounded-md border-l-4 border-blue-500'>
                  <p className='text-sm text-gray-600'>Allocated Seat</p>
                  <p className='font-bold text-lg text-blue-700'>
                    {passenger.seatNumber ? passenger.seatNumber : 'TBD (Assign at counter)'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className='flex flex-col rounded-md bg-yellow-50 border-2 border-yellow-200 w-full p-6 mb-8'>
          <div className='font-bold text-lg mb-4'>Booking Summary</div>
          <hr className="border-yellow-300 mb-4"></hr>
          
          <div className='flex justify-between items-center'>
            <span className='text-lg'>Total Amount</span>
            <span className='text-2xl font-bold text-yellow-700'>${booking.totalPrice}</span>
          </div>
          <p className='text-sm text-gray-600 mt-4 italic'>
            ℹ️ Payment instructions: Please visit the airport counter with your confirmation details to complete payment and receive your ticket
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 justify-center'>
          <Link href="/">
            <Button className='bg-lime-500 hover:bg-lime-600 px-8 py-2'>Back to Home</Button>
          </Link>
          <Button 
            onClick={printTicket}
            className='bg-blue-600 hover:bg-blue-700 px-8 py-2'
          >
            📄 Print Ticket
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Booked
