'use client'
import React,{useState,useEffect} from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast"
import PassengerForm from '@/components/PassengerForm'

interface Passenger {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality: string
  aadharNumber?: string
  passportNumber?: string
  visaNumber?: string
  seatNumber?: string
}

const FlightNumber = () => {

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const router = useRouter();
    const [flight, setFlight] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const { toast } = useToast()
    const flightNumber  = router.query.flightNumber;
    
    useEffect(() => {
        if(!router.isReady || !flightNumber) return;
        
        const fetchFlight = async () => {
            try {
                setIsLoading(true)
                const response = await apiClient.get(`/flights/number/${flightNumber}`)
                setFlight(response)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch flight details",
                })
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchFlight()
    }, [router.isReady, flightNumber, toast])
    
    const handleBook = async () => {
        const userJson = localStorage.getItem('user')
        const userId = localStorage.getItem('userId')
        
        if (!userJson || !userId) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please login first",
            })
            router.replace('/login')
            return
        }

        // Validate all passengers have required fields
        const allPassengersValid = passengers.every(p => 
            p.fullName && p.email && isValidEmail(p.email) && p.phone && p.dateOfBirth && p.gender && p.nationality && p.passportNumber
        )

        if (!allPassengersValid) {
            const missingFields: string[] = []
            passengers.forEach((p, idx) => {
                const missing: string[] = []
                if (!p.fullName) missing.push('Full Name')
                if (!p.email) missing.push('Email')
                else if (!isValidEmail(p.email)) missing.push('Valid Email')
                if (!p.phone) missing.push('Phone')
                if (!p.dateOfBirth) missing.push('Date of Birth')
                if (!p.gender) missing.push('Gender')
                if (!p.nationality) missing.push('Nationality')
                if (!p.passportNumber) missing.push('Passport Number')
                
                if (missing.length > 0) {
                    missingFields.push(`Passenger ${idx + 1}: ${missing.join(', ')}`)
                }
            })
            
            toast({
                variant: "destructive",
                title: "Missing Required Fields",
                description: missingFields.join(' | '),
            })
            return
        }

        try {
            setIsBooking(true)
            
            // Step 1: Create booking
            const bookingData = {
                userId: parseInt(userId),
                flightId: flight.id,
                numberOfSeats: numberOfSeats
            }
            
            const bookingResponse = await apiClient.post('/bookings', bookingData)
            const bookingId = bookingResponse.id
            
            // Store booking ID for confirmation page
            sessionStorage.setItem('lastBookingId', bookingId.toString())
            
            // Step 2: Add passengers
            for (const passenger of passengers) {
                await apiClient.post(`/passengers?bookingId=${bookingId}`, passenger)
            }
            
            toast({
                title: "Success",
                description: "Flight booked successfully!",
            })
            setTimeout(() => {
                router.push('/booked')
            }, 1000)
        } catch (error: any) {
            console.error('Booking error:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Booking failed",
            })
        } finally {
            setIsBooking(false)
        }
    }

    const handleSeatsChange = (newNumberOfSeats: number) => {
        if (newNumberOfSeats >= 1 && newNumberOfSeats <= (flight?.availableSeats || 10)) {
            setNumberOfSeats(newNumberOfSeats)
        }
    }

    if (isLoading) {
        return <div className="p-4 py-12 md:px-16 h-screen flex justify-center items-center">Loading...</div>
    }

    if (!flight) {
        return <div className="p-4 py-12 md:px-16 h-screen flex justify-center items-center">Flight not found</div>
    }

    const totalPrice = (flight.price || 0) * numberOfSeats + (150 * numberOfSeats) + (200 * numberOfSeats)
    
    return (
        <div>
            <section className="p-4 py-12 md:px-16 lg:max-w-6xl lg:mx-auto text-left flex-col gap-5 w-full h-full flex justify-center items-center">
                <div className='flex justify-start text-left font-bold'>
                    Checkout Details
                </div>
                <div className='flex flex-col rounded-md bg-slate-200 w-full p-4'>
                        <div>
                            Flight <span className='font-medium'>{flight.departureAirport}</span> to <span className='font-medium'>{flight.arrivalAirport}</span>
                        </div>
                        <hr className="border-black mt-2"></hr>
                        <div className=''></div>
                        <div className='grid lg:grid-cols-5 md:grid-cols-5 sm:grid-col-5 mt-6'>
                            <div className='flex justify-center items-center'><span className='font-bold text-lg'>{flight.airline}</span></div>
                            <div className='flex justify-center items-center'>{flight.departureTime}</div>
                            <div className='flex justify-center items-center'><Image src="/assets/flight.svg" height={100} width={100} alt='logo'/></div>
                            <div className='flex justify-center items-center lg:border-r-2  md:border-r-2 h-full border-black'>{flight.arrivalTime}</div>
                            <div className='flex flex-col justify-center items-center'>
                            
                                <p className='p-2 text-gray-900'>{flight.availableSeats} <span className='text-xs font-medium'>seats available</span></p>
                            </div>
                        </div>
                </div>

                <div className='flex flex-col rounded-md bg-slate-200 w-full p-4'>
                    <div className='font-bold text-lg mb-4'>Number of Passengers</div>
                    <hr className="border-black mb-4"></hr>
                    <div className='flex items-center gap-4'>
                        <Button 
                            variant="outline" 
                            onClick={() => handleSeatsChange(numberOfSeats - 1)}
                            disabled={numberOfSeats <= 1}
                        >
                            -
                        </Button>
                        <Input 
                            type="number" 
                            value={numberOfSeats} 
                            onChange={(e) => handleSeatsChange(parseInt(e.target.value))}
                            min={1}
                            max={flight.availableSeats}
                            className='w-20 text-center'
                        />
                        <Button 
                            variant="outline" 
                            onClick={() => handleSeatsChange(numberOfSeats + 1)}
                            disabled={numberOfSeats >= flight.availableSeats}
                        >
                            +
                        </Button>
                        <span className='ml-4 text-sm'>Max: {flight.availableSeats} passengers</span>
                    </div>
                </div>

                <PassengerForm 
                    numberOfPassengers={numberOfSeats}
                    onPassengersChange={setPassengers}
                />

                {passengers.length > 0 && (
                    <div className='flex flex-col rounded-md bg-purple-50 border-2 border-purple-200 w-full p-4'>
                        <div className='font-bold text-lg mb-4'>Booking Summary</div>
                        <hr className="border-purple-300 mb-4"></hr>
                        
                        <div className='grid grid-cols-1 gap-3'>
                            {passengers.map((passenger, index) => {
                                const isComplete = passenger.fullName && passenger.email && passenger.phone && 
                                                 passenger.dateOfBirth && passenger.gender && passenger.nationality && 
                                                 passenger.passportNumber && passenger.visaNumber
                                
                                return (
                                    <div key={index} className={`p-3 rounded ${isComplete ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'}`}>
                                        <div className='flex justify-between items-center'>
                                            <span className='font-semibold'>Passenger {index + 1}: {passenger.fullName || '(Incomplete)'}</span>
                                            <span className={`text-sm font-bold ${isComplete ? 'text-green-700' : 'text-red-700'}`}>
                                                {isComplete ? '✓ Complete' : '✗ Incomplete'}
                                            </span>
                                        </div>
                                        {passenger.passportNumber && (
                                            <p className='text-sm text-gray-700 mt-1'>Passport: {passenger.passportNumber}</p>
                                        )}
                                        {passenger.visaNumber && (
                                            <p className='text-sm text-gray-700'>Visa: {passenger.visaNumber}</p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                
                <div className='flex flex-col rounded-md bg-slate-200 w-full p-4'>
                        <div>
                            Price details
                        </div>
                        <hr className="border-black mt-2"></hr>
                        <div className=''></div>
                        <div className='grid grid-cols-2 mt-6'>
                            <div className='grid grid-row-4'>
                                <div>Base Fare (per person)</div>
                                <div>Tax (per person)</div>
                                <div>Convenience charges (per person)</div>
                                <div>Total ({numberOfSeats} {numberOfSeats === 1 ? 'person' : 'people'})</div>
                            </div>
                            <div className='grid grid-row-4'>
                                <div>: ₹{flight.price}</div>
                                <div>: ₹200</div>
                                <div>: ₹150</div>
                                <div className='font-medium'>: ₹{totalPrice}</div>
                            </div>
                        </div>
                </div>

                <Button 
                    className='bg-lime-500 hover:bg-lime-600 w-full text-lg py-6' 
                    onClick={handleBook}
                    disabled={isBooking || passengers.length === 0}
                >
                    {isBooking ? 'Processing...' : 'Book Now'}
                </Button>
    
            </section>
        </div>
    )
}

export default FlightNumber