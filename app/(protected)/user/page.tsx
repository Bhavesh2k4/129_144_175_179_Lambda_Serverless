import React from 'react';
import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { UserRole } from '@prisma/client';

type UserSession = {
  id: string;
  name?: string | null;
  email: string;
  role: UserRole;
  image?: string | null;
  emailVerified?: Date | null;
}

const UserPage = async () => {
  const session = await auth();
  
  const user = session?.user || {} as UserSession;
  const expires = session?.expires || null;
  const { name, email, role, id , image} = user;

  
  // Format expiration date
  const formattedExpires = expires ? new Date(expires).toLocaleString() : 'N/A';

  const getInitials = (name?: string | null): string => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 shadow-sm">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              Serverless Functions Dashboard
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/user/new">
              <Button variant="default" className='hover:cursor-pointer'>Create New Function</Button>
            </Link>
            <Link href="/user/functions">
              <Button variant="outline" className='hover:cursor-pointer'>View All Functions</Button>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button type="submit" variant="destructive" className='hover:cursor-pointer'>
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">User Profile</CardTitle>
                <Badge variant="outline">{role || UserRole.USER}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-6 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback 
                    className="bg-primary text-primary-foreground text-xl"
                  >
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{name || 'Unknown User'}</h2>
                  <p className="text-gray-500">{email || 'No email provided'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-sm break-all">{id || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Session Expires</p>
                    <p className="text-sm">{formattedExpires}</p>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Functions</h3>
                    <Link href="/user/functions">
                      <Button variant="link" size="sm" className='hover:cursor-pointer'>View All</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserPage;