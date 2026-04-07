'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from '@/lib/api'
import { airports } from '@/airports'
import {Command,CommandEmpty,CommandGroup,CommandInput,CommandItem, CommandList,} from "@/components/ui/command"
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

const AddFlight = () => {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)

    const [formData, setFormData] = useState({
        airline: '',
        departureAirport: '',
        arrivalAirport: '',
        departureTime: '',
        arrivalTime: '',
        availableSeats: '',
        price: '',
    })

    useEffect(() => {
        const adminData = localStorage.getItem('admin')
        const isAdminUser = localStorage.getItem('isAdmin')
        
        if (!adminData || isAdminUser !== 'true') {
            router.replace('/admin-login')
            return
        }
        
        setIsAdmin(true)
    }, [router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAirportSelect = (airport: string, field: 'departureAirport' | 'arrivalAirport') => {
        setFormData(prev => ({
            ...prev,
            [field]: airport
        }))
        if (field === 'departureAirport') {
            setOpenFrom(false)
        } else {
            setOpenTo(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.airline || !formData.departureAirport || 
            !formData.arrivalAirport || !formData.departureTime || !formData.arrivalTime || 
            !formData.availableSeats || !formData.price) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "All fields are required",
            })
            return
        }

        if (formData.departureAirport === formData.arrivalAirport) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Departure and arrival airports must be different",
            })
            return
        }

        try {
            setIsLoading(true)
            const flightData = {
                airline: formData.airline,
                departureAirport: formData.departureAirport,
                arrivalAirport: formData.arrivalAirport,
                departureTime: formData.departureTime,
                arrivalTime: formData.arrivalTime,
                availableSeats: parseInt(formData.availableSeats),
                price: parseFloat(formData.price),
            }

            await apiClient.post('/flights', flightData)

            toast({
                title: "Success",
                description: "Flight added successfully!",
            })

            // Reset form
            setFormData({
                airline: '',
                departureAirport: '',
                arrivalAirport: '',
                departureTime: '',
                arrivalTime: '',
                availableSeats: '',
                price: '',
            })

            // Redirect to admin dashboard
            setTimeout(() => {
                router.push('/admin')
            }, 1500)
        } catch (error: any) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to add flight",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAdmin) {
        return <div className="w-full h-screen flex justify-center items-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-slate-900">Add New Flight</h1>
                    <Link href="/admin">
                        <button className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition">
                            Back to Dashboard
                        </button>
                    </Link>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Airline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Airline *
                            </label>
                            <input
                                type="text"
                                name="airline"
                                value={formData.airline}
                                onChange={handleChange}
                                placeholder="e.g., American Airlines"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            />
                        </div>

                        {/* Airports with Dropdowns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Departure Airport *
                                </label>
                                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openFrom}
                                            className="w-full justify-between"
                                        >
                                            {formData.departureAirport
                                                ? airports.find((a) => a.code === formData.departureAirport)?.city
                                                : "Select airport..."}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search airport..." className="h-9" />
                                            <CommandEmpty>No airport found.</CommandEmpty>
                                            <CommandGroup className="h-56 overflow-y-scroll">
                                                {airports.map((airport) => (
                                                    <CommandItem
                                                        key={airport.code}
                                                        value={`${airport.city} ${airport.code}`}
                                                        onSelect={() => handleAirportSelect(airport.code, 'departureAirport')}
                                                    >
                                                        {airport.city} ({airport.code})
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                formData.departureAirport === airport.code ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Arrival Airport *
                                </label>
                                <Popover open={openTo} onOpenChange={setOpenTo}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openTo}
                                            className="w-full justify-between"
                                        >
                                            {formData.arrivalAirport
                                                ? airports.find((a) => a.code === formData.arrivalAirport)?.city
                                                : "Select airport..."}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search airport..." className="h-9" />
                                            <CommandEmpty>No airport found.</CommandEmpty>
                                            <CommandGroup className="h-56 overflow-y-scroll">
                                                {airports.map((airport) => (
                                                    <CommandItem
                                                        key={airport.code}
                                                        value={`${airport.city} ${airport.code}`}
                                                        onSelect={() => handleAirportSelect(airport.code, 'arrivalAirport')}
                                                    >
                                                        {airport.city} ({airport.code})
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                formData.arrivalAirport === airport.code ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Times */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Departure Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="departureTime"
                                    value={formData.departureTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Arrival Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="arrivalTime"
                                    value={formData.arrivalTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Seats & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Available Seats *
                                </label>
                                <input
                                    type="number"
                                    name="availableSeats"
                                    value={formData.availableSeats}
                                    onChange={handleChange}
                                    placeholder="e.g., 150"
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Price per Seat (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g., 2999"
                                    min="0.01"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6 border-t">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-lime-500 text-white font-medium rounded-lg hover:bg-lime-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Adding Flight...' : 'Add Flight'}
                            </button>
                            <Link href="/admin" className="flex-1">
                                <button
                                    type="button"
                                    className="w-full px-6 py-3 bg-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-400 transition"
                                >
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddFlight
