import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
  message? : string;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message){ return null; }
  return (
    <div className="flex items-center bg-emerald-600/15 p-3 rounded-lg text-emerald-600 gap-x-2 text-sm">
      <FaCheckCircle className="w-4 h-4 mr-1" />
      {message}
    </div>
  );
};

export default FormSuccess;