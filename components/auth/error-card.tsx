"use client";
import { AlertTriangle, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export const ErrorCard = ({ 
  title = "Oops! Something went wrong",
  description = "We encountered an error while processing your request. Please try again or contact support if the issue persists.",
  returnPath = "/login",
  returnLabel = "Back to login"
}) => {
  return (
    <Card className="shadow-md w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center space-y-2 pb-2">
        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-center">{title}</h2>
      </CardHeader>
      
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      </CardContent>
        <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href={returnPath}>
            {returnLabel}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ErrorCard;