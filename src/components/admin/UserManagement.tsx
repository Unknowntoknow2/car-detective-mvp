import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, created_at, last_sign_in_at, isAdmin');

        if (error) {
          setError(error.message);
        } else {
          // Ensure last_sign_in_at is handled correctly
          setUsers(data.map(item => ({
            id: item.id,
            email: item.email,
            created_at: item.created_at,
            last_sign_in_at: item.last_sign_in_at || null, // Convert undefined to null
            isAdmin: item.isAdmin
          })));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Table>
      <TableCaption>A list of your registered users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Sign In</TableHead>
          <TableHead>Is Admin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.created_at}</TableCell>
            <TableCell>{user.last_sign_in_at || 'Never'}</TableCell>
            <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
