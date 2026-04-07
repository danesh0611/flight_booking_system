import React, { useState } from 'react'
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api';

const AdminLogin = () => {
    const router = useRouter()
    const { toast } = useToast()
    
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const handleChange = (prop: string) => (event: { target: { value: any; }; }) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleAdminLogin = async (e: { preventDefault: () => void; } | undefined) => {
        e?.preventDefault()
        if(!values.email || !values.password){
            toast({
                variant: "destructive",
                title: "Error",
                description: "Fill up the missing fields",
            })
        }else if(values.password.length < 6){
            toast({
                variant: "destructive",
                title: "Error",
                description: "Password must be 6+ characters",
            })
        }else{
            try {
                const response = await apiClient.post('/users/admin/login', {
                    email: values.email,
                    password: values.password
                })
                // Store admin data from backend
                localStorage.setItem('admin', JSON.stringify(response))
                localStorage.setItem('adminId', response.id.toString())
                localStorage.setItem('isAdmin', 'true')
                toast({
                    title: "Success",
                    description: "Admin logged in successfully!",
                })
                setTimeout(() => router.replace('/admin'), 1000)
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message || "Admin login failed - Unauthorized",
                })
            }
        }
    }

    return (
        <main className='w-full h-screen flex justify-center items-center'>
            <div className='hidden w-1/2 h-full bg-white text-black lg:flex lg:flex-col lg:px-16 justify-center'>
                <div className="relative">
                    <h1 className='text-4xl font-semibold'>Admin Dashboard{" "} 
                        <span className=" h-fit w-fit bg-[url('/underline.svg')] bg-bottom bg-no-repeat">
                        <span className="text-red-500">Access</span>
                        </span>
                    </h1>
                    <p className='text-slate-500 text-justify mt-4 text-base'>Login with your admin credentials to access the flight management dashboard. Manage flights, bookings, and user accounts.</p>
                </div>
            </div>
            <div className='lg:w-1/2 p-4'>
                <div className='mx-auto flex flex-col gap-8 lg:w-1/2'>
                    <div>
                        <h1 className='text-2xl font-medium'>Admin Login</h1>
                        <p className='text-sm text-slate-500'>Enter your admin credentials to access the dashboard.</p>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <h1 className=''>Email</h1>
                            <input onChange={handleChange("email")} className='w-full p-4 text-slate-500 outline-none border border-slate-400 rounded' placeholder='admin@example.com'/>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='w-full flex justify-between items-center'>
                                <h1 className=''>Password</h1>
                            </div>
                            <input onChange={handleChange("password")} type='password' className='w-full p-4 text-slate-500 outline-none border border-slate-400 rounded' placeholder='password'/>
                        </div>
                        <div>
                            <button onClick={handleAdminLogin} className="w-full p-4 text-sm bg-red-600 hover:bg-red-700 transition-all duration-300 rounded cursor-pointer text-white font-medium">Admin Login</button>
                        </div>
                        <div className='text-center text-sm'>
                            <Link href='/'>
                                <h1 className='text-center mb-2'>← <span className='text-lime-500 cursor-pointer hover:underline'>Back to Home</span></h1>
                            </Link>
                            <Link href='/login'>
                                <h1 className='text-lime-500 cursor-pointer hover:underline'>Back to User Login</h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AdminLogin
