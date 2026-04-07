import React from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Features = () => {
    const features = [
        {
            icon: '🔍',
            title: 'Easy Search',
            description: 'Search flights by departure and arrival cities with our intuitive search interface. Filter results to find the perfect flight for your needs.'
        },
        {
            icon: '💰',
            title: 'Best Prices',
            description: 'Get competitive pricing on all flights. We compare prices across multiple airlines to ensure you get the best deals.'
        },
        {
            icon: '📅',
            title: 'Flexible Dates',
            description: 'Choose your preferred travel date with our interactive calendar. Find the best rates for your travel plans.'
        },
        {
            icon: '🛫',
            title: 'Multiple Airlines',
            description: 'Access flights from major airlines. Compare options and choose the airline that works best for you.'
        },
        {
            icon: '🔒',
            title: 'Secure Booking',
            description: 'Book with confidence. Our secure payment system protects your personal and financial information.'
        },
        {
            icon: '⚡',
            title: 'Quick Checkout',
            description: 'Complete your booking in minutes. Our streamlined checkout process makes booking flights fast and easy.'
        },
        {
            icon: '👤',
            title: 'User Accounts',
            description: 'Create an account to save your preferences and track your bookings. Receive personalized recommendations.'
        },
        {
            icon: '📊',
            title: 'Flight Details',
            description: 'View complete flight information including departure times, arrival times, available seats, and pricing.'
        },
        {
            icon: '🎯',
            title: 'Real-time Updates',
            description: 'Get instant updates on flight availability and pricing. Stay informed about your bookings.'
        }
    ]

    return (
        <div className="bg-slate-100">
            <Header />
            
            {/* Hero Section */}
            <div className="w-full pt-24 pb-12 px-4 md:px-16 bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4">
                        Why Choose <span className="text-lime-500">Airvista?</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Experience the best flight booking platform with cutting-edge features designed for hassle-free travel planning.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="w-full px-4 md:px-16 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-300 border-l-4 border-lime-500"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Highlights Section */}
            <div className="w-full px-4 md:px-16 py-12 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                        What Makes Us <span className="text-lime-500">Different</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Side */}
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-lime-500 text-white">
                                        ✓
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                                        24/7 Customer Support
                                    </h4>
                                    <p className="text-slate-600">
                                        Our dedicated support team is available round the clock to help you with any queries or issues.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-lime-500 text-white">
                                        ✓
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                                        Price Match Guarantee
                                    </h4>
                                    <p className="text-slate-600">
                                        If you find a lower price elsewhere, we&apos;ll match it. Your satisfaction is our priority.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-lime-500 text-white">
                                        ✓
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                                        Free Booking Management
                                    </h4>
                                    <p className="text-slate-600">
                                        Manage, modify, or cancel your bookings anytime with our user-friendly booking dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="flex items-center justify-center">
                            <div className="bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg p-8 text-white text-center">
                                <div className="text-6xl mb-4">✈️</div>
                                <h3 className="text-2xl font-bold mb-2">Start Your Journey</h3>
                                <p className="text-lime-100 mb-6">
                                    Book your next flight with confidence and ease
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="w-full px-4 md:px-16 py-12">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-lime-500 to-lime-600 rounded-lg p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Book Your Next Flight?</h2>
                    <p className="text-lg text-lime-100 mb-8">
                        Experience the easiest way to find and book flights. Start exploring destinations today!
                    </p>
                    <Link href="/">
                        <Button className="bg-white text-lime-600 hover:bg-slate-100 px-8 py-3 font-semibold text-lg">
                            Search Flights Now
                        </Button>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Features
