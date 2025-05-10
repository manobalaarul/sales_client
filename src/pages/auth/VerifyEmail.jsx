import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Axios from "../../components/utils/Axios";
import SummaryApi from "../../common/SummaryApi";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const code = searchParams.get("code"); // Get 'code' from URL

      if (!code) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const response = await Axios({
          ...SummaryApi.verify_email,
          data: {
            code,
          },
        });
        setMessage(response.data.message);
        setSuccess(true);
      } catch (error) {
        setMessage(error.response?.data?.message || "Something went wrong!");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold">{message}</h2>
      {success && (
        <a href="/auth/login" className="mt-4 text-blue-500">
          Go to Login
        </a>
      )}
    </div>
  );
};

export default VerifyEmail;
