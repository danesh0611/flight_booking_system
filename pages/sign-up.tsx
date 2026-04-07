import React, {useState} from 'react';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api';

const SignUp = () => {

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const [values, setValues] = useState({
        email: '',
        password: '',
        name:'',
    });
    const { toast } = useToast()
    const router = useRouter();


    const handleChange = (prop: string) => (event: { target: { value: any; }; }) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    
    const handleSignUp = async (e: { preventDefault: () => void; } | undefined) => {
        e?.preventDefault()
        if(!values.email || !values.name || !values.password){
            toast({
                variant: "destructive",
                title: "Error",
                description: "Fill up the missing fields",
            })
        }else if(!isValidEmail(values.email)){
            toast({
                variant: "destructive",
                title: "Error",
                description: "Enter a valid email address",
            })
        }else if(values.password.length < 6){
            toast({
                variant: "destructive",
                title: "Error",
                description: "Password must be 6+ characters",
            })
        }else{
            try {
                const response = await apiClient.post('/users/register', {
                    name: values.name,
                    email: values.email,
                    password: values.password
                })
                // Store user data from backend
                localStorage.setItem('user', JSON.stringify(response))
                localStorage.setItem('userId', response.id.toString())
                toast({
                    title: "Success",
                    description: "Account created successfully!",
                })
                setTimeout(() => router.replace('/'), 1000)
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message || "Registration failed",
                })
            }
        }
    }

    return (
        <main className='w-full h-screen flex justify-center items-center'>
            <div className='hidden w-1/2 h-full bg-white text-black lg:flex lg:flex-col lg:px-16 justify-center'>
                <div className="relative">
                <h1 className='text-4xl font-semibold'>Welcome to{" "} 
                    <span className=" h-fit w-fit bg-[url('/underline.svg')] bg-bottom bg-no-repeat">
                    AIR<span className="text-lime-500"> VISTA</span>
                    </span>! Your Ultimate Online Flight Ticket Booking</h1>
                    <p className='text-slate-500 text-justify mt-4 text-base'>Enter your travel information, such as your departure and arrival cities, dates of travel, and number of passengers.
Select your preferred airline and class of travel.
Compare prices and select the flight that best meets your needs.
Enter your contact information and credit card details to complete your booking.
That&apos;s it! You&apos;ve just booked your flight with our website. We hope you enjoy your trip!</p>                    
                </div>
            </div>
            <div className='lg:w-1/2 p-4'>
                <div className='mx-auto flex flex-col gap-8 lg:w-1/2'>
                    <div>
                    <h1 className='text-2xl font-medium'>Create an Account</h1>
                    <p className='text-sm text-slate-500'>Enter your credentials to create a new account</p>
                    </div>
                    <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <h1 className=''>Name</h1>
                            <input value={values.name} type="text" required onChange={handleChange('name')} className='w-full p-4 text-slate-500 outline-none border border-slate-400 rounded' placeholder='Full Name'/>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h1 className=''>Email</h1>
                            <input value={values.email} type='email' required onChange={handleChange('email')} className='w-full p-4 text-slate-500 outline-none border border-slate-400 rounded' placeholder='example@gmail.com'/>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h1 className=''>Password</h1>
                            <input value={values.password} required onChange={handleChange('password')} type='password' className='w-full p-4 text-slate-500 outline-none border border-slate-400 rounded' placeholder='password'/>
                        </div>
                        <div>
                            <button onClick={handleSignUp} className="w-full p-4 text-sm bg-lime-500 hover:bg-lime-600 transition-all duration-300 rounded cursor-pointer text-white font-medium">Sign Up</button>
                        </div>
                        <Link href='/'>
                            <h1 className='text-center'>← <span className='text-lime-500 cursor-pointer hover:underline'>Back to Home</span></h1>
                        </Link>
                        <Link href='/login'>
                            <h1 className='text-center'>Already have an account?<span className='text-lime-500 cursor-pointer hover:underline'> Login</span> </h1>
                        </Link>
                    </form>
                </div>
            </div>
            </main>
    )
}

export default SignUp