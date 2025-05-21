import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/types/user";

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(30, {
    message: "Username must not be longer than 30 characters.",
  }).optional(),
  full_name: z.string().max(50).optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional(),
  bio: z.string().max(160).optional(),
});

interface ProfileFormValues extends z.infer<typeof profileFormSchema> {}

const safeValue = (value: string | null | undefined) => value || '';

export function ProfileForm() {
  const { toast } = useToast();
  const { profile, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      website: profile?.website || "",
      bio: profile?.bio || "",
    },
  });

  useEffect(() => {
    form.reset({
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      website: profile?.website || "",
      bio: profile?.bio || "",
    });
  }, [profile, form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsSaving(true);
    try {
      await updateProfile({
        ...profile,
        username: data.username,
        full_name: data.full_name,
        website: data.website,
        bio: data.bio,
      } as UserProfile);

      toast({
        title: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} value={safeValue(field.value)} />
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
                <Input placeholder="Full name" {...field} value={safeValue(field.value)} />
              </FormControl>
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
                <Input placeholder="www.example.com" {...field} value={safeValue(field.value)} />
              </FormControl>
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
                  placeholder="Tell us a little bit about yourself."
                  className="resize-none"
                  {...field}
                  value={safeValue(field.value)}
                />
              </FormControl>
              <FormDescription>
                Max. 160 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Update profile"}
        </Button>
      </form>
    </Form>
  );
}
