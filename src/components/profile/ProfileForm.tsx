import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea, TextareaProps } from "@/components/ui/textarea";

const profileFormSchema = z.object({
  username: z.string().min(2).max(50),
  full_name: z.string().min(2).max(50),
  bio: z.string().max(160).optional(),
  website: z.string().url().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  profileData?: ProfileFormValues | null;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function ProfileForm({ profileData, onSubmit, isSubmitting }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profileData?.username || "",
      full_name: profileData?.full_name || "",
      bio: profileData?.bio || "",
      website: profileData?.website || "",
    },
    mode: "onChange",
  });

  const submitHandler = async (values: ProfileFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Username"
                  {...field}
                  value={profileData?.username || ''} // Convert null to empty string
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Full Name"
                  {...field}
                  value={profileData?.full_name || ''} // Convert null to empty string
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                This is your full name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Bio"
                  {...field}
                  value={profileData?.bio || ''} // Convert null to empty string
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Write a short bio about yourself.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="Website"
                  {...field}
                  value={profileData?.website || ''} // Convert null to empty string
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Add a link to your personal website.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Form>
  );
}
