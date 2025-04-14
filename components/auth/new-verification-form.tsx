"use client"

import { CardWrapper } from "@/components/auth/card-wrapper";
import {PuffLoader} from 'react-spinners'
import { useSearchParams } from "next/navigation";
import { useCallback,useEffect, useState} from "react";
import { newVerification } from "@/actions/new-verification";
import FormSuccess from "@/components/auth/form-success";
import FormError from "@/components/auth/form-error";
export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const onSubmit= useCallback (() => {
        if (success || error) {
            return;
        }
        if (!token) {
            setError("Token not found");
            return;
        }
        newVerification(token).then((response) => {
            setError(response?.error);
            setSuccess(response?.success);
        }).catch((error) => {
            setError("Something went wrong");
        }
        );
    }, [token, success, error]);

    useEffect(()=>{
        onSubmit();
    }, [onSubmit])
    return (
        <CardWrapper
            headerLabel="Confirming your email address"
            backButtonLabel="Back to login?"
            backButtonHref="/login"
        >
            <div className="flex items-center justify-center w-full">
                {!success && !error && <PuffLoader color="#000" size={40} />}
                <FormSuccess message={success} />
                {!success && <FormError message={error} />}
            </div>
        </CardWrapper>
    );
}