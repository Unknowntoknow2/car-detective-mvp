import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Search, ShieldCheck, UserCheck } from "lucide-react";
import { toast } from "sonner";

// Define interfaces for the data we're working with
interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  isAdmin: boolean;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First get all users
      const { data: authUsers, error: authError } = await supabase.auth.admin
        .listUsers();

      if (authError) throw authError;

      // Then get all admin roles to determine who is an admin
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "admin") as {
          data: UserRole[] | null;
          error: Error | null;
        };

      if (rolesError) throw rolesError;

      // Create a set of admin user IDs for easy lookup
      const adminUserIds = new Set(
        (adminRoles || []).map((role) => role.user_id),
      );

      // Combine the data
      const combinedUsers = authUsers.users.map((user) => ({
        id: user.id,
        email: user.email || "No email",
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        isAdmin: adminUserIds.has(user.id),
      }));

      setUsers(combinedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminRole = async (userId: string, isAdmin: boolean) => {
    try {
      setIsSubmitting(true);

      if (isAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin") as { error: Error | null };

        if (error) throw error;

        toast.success("Admin role removed");
      } else {
        // Add admin role
        const { error } = await supabase
          .from("user_roles")
          .insert({
            user_id: userId,
            role: "admin",
          }) as { error: Error | null };

        if (error) throw error;

        toast.success("Admin role granted");
      }

      // Update the local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isAdmin: !isAdmin } : user
        ),
      );
    } catch (err) {
      console.error("Error updating admin role:", err);
      toast.error("Failed to update admin role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const unlockPremiumReport = async (userId: string) => {
    try {
      setIsSubmitting(true);

      // Find all valuations for this user that don't have premium unlocked
      const { data: valuations, error: fetchError } = await supabase
        .from("valuations")
        .select("id")
        .eq("user_id", userId)
        .is("premium_unlocked", null);

      if (fetchError) throw fetchError;

      if (!valuations.length) {
        toast.info("No valuations found to unlock");
        return;
      }

      // Update all valuations to have premium unlocked using raw SQL query
      // instead of RPC since TypeScript doesn't recognize our function yet
      const { error: updateError } = await supabase
        .from("valuations")
        .update({ premium_unlocked: true })
        .eq("user_id", userId)
        .is("premium_unlocked", null);

      if (updateError) throw updateError;

      toast.success(`Unlocked premium for ${valuations.length} valuations`);
    } catch (err) {
      console.error("Error unlocking premium:", err);
      toast.error("Failed to unlock premium reports");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${globalThis.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent");
    } catch (err) {
      console.error("Error sending password reset:", err);
      toast.error("Failed to send password reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = searchTerm
    ? users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm)
    )
    : users;

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <div className="flex mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by email or ID..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Email</TableHead>
              <TableHead className="w-[15%]">Created</TableHead>
              <TableHead className="w-[15%]">Last Sign In</TableHead>
              <TableHead className="w-[35%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0
              ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm
                      ? "No users matching your search"
                      : "No users found"}
                  </TableCell>
                </TableRow>
              )
              : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {user.email}
                        {user.isAdmin && (
                          <ShieldCheck className="ml-2 h-4 w-4 text-primary" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={user.isAdmin ? "destructive" : "outline"}
                          onClick={() => toggleAdminRole(user.id, user.isAdmin)}
                          disabled={isSubmitting}
                        >
                          <ShieldCheck className="h-4 w-4 mr-1" />
                          {user.isAdmin ? "Remove Admin" : "Make Admin"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unlockPremiumReport(user.id)}
                          disabled={isSubmitting}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Unlock Premium
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendPasswordReset(user.email)}
                          disabled={isSubmitting}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Reset Password
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
