"use client";

import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/hooks/use-store-modal';
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { useState } from 'react';
import axios from 'axios';  
import toast from 'react-hot-toast';

const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const StoreModal = useStoreModal();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    })

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try{
            setLoading(true);

            const response = await axios.post('/api/stores', values);

            toast.success('Store created successfully');
        } catch(error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    }

    return(
    <Modal
        title='Create Store'
        description='Add a new store to manage products and categories'
        isOpen={StoreModal.isOpen}
        onClose={StoreModal.onClose}
    >
        <div className='space-y-4 py-2 pb-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={loading}
                                        placeholder='E-Commerce' 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                        <Button 
                            onCLick={StoreModal.onClose}
                            disabled={loading}
                            variant="outline" 
                            >
                                Cancel
                        </Button>
                        <Button disabled={loading} type='submit'>Continue</Button>
                    </div>
                </form>
            </Form>
        </div>
    </Modal>
    )
}