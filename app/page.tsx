"use client"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import ProfileForm from "@/app/components/custom/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { outfit } from "@/lib/fonts"

const formSchema = z.object({
    problemId: z.string().min(1, {
        message: "Problem ID must contain at least 1 character.",
    }),
})

export default function ProblemForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            problemId: "123",
        },
    })
    let onSubmit = ProfileForm(form)

    return (
        <>
            <title>PB - Form Page</title>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 px-4 transition-colors duration-500">
                <div className="relative w-full max-w-md mx-auto">
                    <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/60 dark:border-white/10 -z-10"></div>
                    <div className="p-8 sm:p-10">
                        <h1 className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-700 dark:from-blue-400 dark:to-indigo-400 tracking-tight text-center mb-8 ${outfit.className}`}>
                            Load Problem
                        </h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="problemId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Problem ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is the problem ID of your leetcode question.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <Button className="w-full py-6 text-lg mt-4" type="submit">Launch Workspace</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}
