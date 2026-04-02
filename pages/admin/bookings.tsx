'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from '@/lib/api'

interface Passenger {
  id: number
  fullName: string
  email: string
  passportNumber: string
  seatNumber?: string
}

interface Booking {
  id: number
  flightNumber: string
  airline: string
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  totalPrice: number
  numberOfSeats: number
  status: string
  passengers: Passenger[]
}

const AdminBookings = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(null)
  const [assigningSeat, setAssigningSeat] = useState<{ bookingId: number; passengerId: number } | null>(null)
  const [seatInput, setSeatInput] = useState<string>('')

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    const isAdmin = localStorage.getItem('isAdmin')
    
    if (!adminData || isAdmin !== 'true') {
      router.replace('/admin-login')
      return
    }
    
    setAdmin(JSON.parse(adminData))
    fetchBookings()
  }, [router])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('/bookings')
      setBookings(response)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch bookings",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignSeat = async (bookingId: number, passengerId: number) => {
    if (!seatInput.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a seat number",
      })
      return
    }

    try {
      await apiClient.patch(`/passengers/${passengerId}/seat?seatNumber=${seatInput}`, {})
      
      toast({
        title: "Success",
        description: `Seat ${seatInput} assigned successfully!`,
      })

      // Update local state
      setBookings(bookings.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            passengers: booking.passengers.map(p => 
              p.id === passengerId ? { ...p, seatNumber: seatInput } : p
            )
          }
        }
        return booking
      }))

      setAssigningSeat(null)
      setSeatInput('')
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to assign seat",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminId')
    localStorage.removeItem('isAdmin')
    router.replace('/admin-login')
  }

  const allSeatsAssigned = (booking: Booking) => {
    return booking.passengers.every(p => p.seatNumber)
  }

  const printTicket = (booking: Booking) => {
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
                    <th>Passport Number</th>
                    <th>Seat Number</th>
                  </tr>
                </thead>
                <tbody>
                  ${booking.passengers.map(p => `
                    <tr>
                      <td>${p.fullName}</td>
                      <td>${p.passportNumber}</td>
                      <td style="font-weight: bold; color: #0066cc;">${p.seatNumber}</td>
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
              <p>✓ All seats confirmed. Please arrive 2 hours before departure.</p>
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
    return <div className="w-full h-screen flex justify-center items-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Bookings & Seat Management</h1>
            <p className="text-slate-500">Manage passenger bookings and assign seats</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Passengers</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {bookings.reduce((sum, b) => sum + b.passengers.length, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Seats Assigned</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {bookings.reduce((sum, b) => sum + b.passengers.filter(p => p.seatNumber).length, 0)}
            </p>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Booking Header */}
              <div 
                onClick={() => setExpandedBookingId(expandedBookingId === booking.id ? null : booking.id)}
                className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Booking #{booking.id}</p>
                      <p className="text-sm text-gray-500">{booking.flightNumber} - {booking.airline}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.departureAirport} → {booking.arrivalAirport}
                      </p>
                      <p className="text-sm text-gray-500">{booking.departureTime}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm text-gray-900">${booking.totalPrice}</p>
                      <p className="text-sm text-gray-500">{booking.numberOfSeats} passengers</p>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </div>
              </div>

              {/* Expanded Booking Details */}
              {expandedBookingId === booking.id && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <h4 className="font-semibold text-gray-900 mb-4">Passengers & Seat Assignment</h4>
                  
                  <div className="space-y-3">
                    {booking.passengers.map((passenger, idx) => (
                      <div 
                        key={passenger.id} 
                        className="bg-white p-4 rounded border border-gray-200 flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Passenger {idx + 1}: {passenger.fullName}
                          </p>
                          <p className="text-sm text-gray-500">{passenger.email}</p>
                          <p className="text-sm text-gray-500">Passport: {passenger.passportNumber}</p>
                        </div>
                        
                        {assigningSeat?.passengerId === passenger.id ? (
                          <div className="flex gap-2 ml-4">
                            <Input
                              type="text"
                              placeholder="e.g., 1A, 2B"
                              value={seatInput}
                              onChange={(e) => setSeatInput(e.target.value)}
                              className="w-24"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAssignSeat(booking.id, passenger.id)}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setAssigningSeat(null)
                                setSeatInput('')
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="ml-4 text-right">
                            {passenger.seatNumber ? (
                              <div>
                                <p className="font-semibold text-blue-600 text-lg">{passenger.seatNumber}</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setAssigningSeat({ bookingId: booking.id, passengerId: passenger.id })
                                    setSeatInput(passenger.seatNumber || '')
                                  }}
                                  className="mt-1"
                                >
                                  Change
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => {
                                  setAssigningSeat({ bookingId: booking.id, passengerId: passenger.id })
                                  setSeatInput('')
                                }}
                              >
                                Assign Seat
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {allSeatsAssigned(booking) && (
                    <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                      <p className="text-green-800 font-semibold mb-3">✓ All seats assigned! Ready to print final ticket.</p>
                      <Button
                        onClick={() => printTicket(booking)}
                        className="bg-green-600 hover:bg-green-700 w-full"
                      >
                        📄 Print Final Ticket
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBookings
