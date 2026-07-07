"use client"
import Link from 'next/link';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import LoginProfileForm from '@/app/components/custom/login-form';
import { outfit } from "@/lib/fonts"

const loginFormSchema = z.object({
    email: z.string().email({message: 'Email is required'}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
})

export default function Home() {
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const onSubmit = LoginProfileForm(form)
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 px-4 transition-colors duration-500">
            <title>PB - Login Page</title>
            <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/60 dark:border-white/10 -z-10"></div>
                <div className="p-8 sm:p-10">
                    <h1 className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-700 dark:from-blue-400 dark:to-indigo-400 tracking-tight text-center mb-8 ${outfit.className}`}>
                        Welcome Back
                    </h1>
                    <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="" {...field}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <p className="text-sm font-medium text-center text-gray-500 dark:text-gray-400 mt-6">
                                        Don&apos;t have an account yet?&nbsp;
                                        <Link href="/signup"
                                              className="text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400 transition-colors">
                                            Sign up here
                                        </Link>
                                    </p>
                                    {form.formState.errors.root && (
                                        <p className="text-sm font-medium text-red-500 dark:text-red-400 text-center bg-red-50 dark:bg-red-950/30 p-2 rounded-md">
                                            {form.formState.errors.root.message}
                                        </p>
                                    )}
                                    <Button className="w-full py-6 text-lg mt-4" type="submit">Sign In</Button>
                                </form>
                            </Form>
                </div>
            </div>
        </div>
    );
}
