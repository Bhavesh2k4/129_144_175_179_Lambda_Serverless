import { FaExclamationTriangle } from "react-icons/fa";

interface FormErrorProps {
  message? : string;
}

const FormError = ({ message }: FormErrorProps) => {
    if (!message){ return null; }
    return (
        <div className="flex items-center bg-destructive/15 p-3 rounded-lg text-destructive gap-x-2 text-sm">
        <FaExclamationTriangle className="w-4 h-4 mr-1" />
        {message}
        </div>
    );
};

export default FormError;