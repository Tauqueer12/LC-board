"use client"

import {z} from "zod"
import {useRouter} from "next/navigation"
import {signupUser} from '@/app/components/custom/firebase-utils';


const signupFormSchema = z.object({
    email: z.string().email({message: 'Email is required'}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    confirmPassword: z.string().min(8, {message: "Password Didn't match"}),
}).superRefine(({confirmPassword, password}, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ['confirmPassword']
        });
    }
});

export default function SignupProfileForm(form: any) {
    const router = useRouter();
    return async function onSubmit(values: z.infer<typeof signupFormSchema>) {
        try {
            await signupUser(values.email, values.password);
            router.push(`/`);
        } catch (error: any) {
            form.setError('root', { message: error.message || 'Failed to sign up.' });
        }
    }
}

