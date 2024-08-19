'use client';
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay";
import messages from '@/messages.json';
import { Mail } from 'lucide-react';
import Footer from '@/components/Footer';


const Page = () => {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12  text-black">
    <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
    
    <Carousel plugins={[Autoplay({ delay: 2000 })]}
      className="w-full max-h-full max-w-xs"
      >
    <CarouselContent>
      {messages.map((message, index) => (
        <CarouselItem key={index}>
          <div className="p-4">
            <Card>
            <CardHeader>
                    <CardTitle className=''>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className=" text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
            </Card>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
  </main>
  
  </>
  )
}

export default Page