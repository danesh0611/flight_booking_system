'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from '@/lib/api'

const AdminDashboard = () => {
    const router = useRouter()
    const { toast } = useToast()
    const [flights, setFlights] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [admin, setAdmin] = useState<any>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const [deletingFlightId, setDeletingFlightId] = useState<number | null>(null)

    useEffect(() => {
        const adminData = localStorage.getItem('admin')
        const isAdmin = localStorage.getItem('isAdmin')
        
        if (!adminData || isAdmin !== 'true') {
            router.replace('/admin-login')
            return
        }
        
        setAdmin(JSON.parse(adminData))
        fetchFlights()
    }, [router])

    const fetchFlights = async () => {
        try {
            setIsLoading(true)
            const response = await apiClient.get('/flights')
            setFlights(response)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch flights",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteFlight = async (flightId: number) => {
        try {
            setDeletingFlightId(flightId)
            await apiClient.delete(`/flights/${flightId}`)
            
            toast({
                title: "Success",
                description: "Flight deleted successfully!",
            })
            
            setFlights(flights.filter(f => f.id !== flightId))
            setDeleteConfirm(null)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to delete flight",
            })
        } finally {
            setDeletingFlightId(null)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('admin')
        localStorage.removeItem('adminId')
        localStorage.removeItem('isAdmin')
        router.replace('/admin-login')
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
                        <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500">Welcome, {admin?.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/bookings">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Manage Bookings
                            </Button>
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm font-medium">Total Flights</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{flights.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm font-medium">Available Seats</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            {flights.reduce((sum, f) => sum + (f.availableSeats || 0), 0)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm font-medium">Total Value</h3>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            ${flights.reduce((sum, f) => sum + (f.price * f.availableSeats || 0), 0)}
                        </p>
                    </div>
                </div>

                {/* Flights Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-900">Flights</h2>
                        <Link href="/admin/add-flight">
                            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                                Add Flight
                            </button>
                        </Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Flight #</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Airline</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Available</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((flight) => (
                                    <tr key={flight.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{flight.flightNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{flight.airline}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {flight.departureAirport} → {flight.arrivalAirport}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">${flight.price}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded text-sm font-medium ${
                                                flight.availableSeats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {flight.availableSeats}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link href={`/admin/edit-flight/${flight.id}`}>
                                                <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                                            </Link>
                                            <button 
                                                onClick={() => setDeleteConfirm(flight.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Flight?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete {flights.find(f => f.id === deleteConfirm)?.flightNumber}? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deletingFlightId !== null}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteFlight(deleteConfirm)}
                                disabled={deletingFlightId !== null}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {deletingFlightId === deleteConfirm ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
