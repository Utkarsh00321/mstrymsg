'use client';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const Page = () => {
  const params = useParams();
  const {toast} = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async(data:z.infer<typeof verifySchema>)=>{

        try {
            const response = await axios.post<ApiResponse>('/api/verify-user',{
                username:params.username,
                code:data.code
            });
            console.log(response);
            toast({
                title:"Success",
                description:response.data.message
            });
            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            console.log(axiosError)
            toast({
                title:"Verification Failed",
                description:""
            });
        }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-2">
          Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Verification Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Verify</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}

export default Page