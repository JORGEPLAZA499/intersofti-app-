import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";


type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const supabaseUrl = (supabase as any).supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: anonKey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid === false && data.reason === "already_unsubscribed") setStatus("already");
        else if (data.valid) setStatus("valid");
        else setStatus("invalid");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (data?.success) setStatus("success");
      else if (data?.reason === "already_unsubscribed") setStatus("already");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          {status === "loading" && <p className="text-muted-foreground">Loading...</p>}
          {status === "valid" && (
            <>
              <h1 className="text-2xl font-bold">Unsubscribe</h1>
              <p className="text-muted-foreground">
                Are you sure you want to unsubscribe from our emails?
              </p>
              <button
                onClick={handleUnsubscribe}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
              >
                Confirm Unsubscribe
              </button>
            </>
          )}
          {status === "success" && (
            <>
              <h1 className="text-2xl font-bold">Unsubscribed</h1>
              <p className="text-muted-foreground">
                You have been successfully unsubscribed. You will no longer receive emails from us.
              </p>
            </>
          )}
          {status === "already" && (
            <>
              <h1 className="text-2xl font-bold">Already Unsubscribed</h1>
              <p className="text-muted-foreground">This email has already been unsubscribed.</p>
            </>
          )}
          {status === "invalid" && (
            <>
              <h1 className="text-2xl font-bold">Invalid Link</h1>
              <p className="text-muted-foreground">
                This unsubscribe link is invalid or has expired.
              </p>
            </>
          )}
          {status === "error" && (
            <>
              <h1 className="text-2xl font-bold">Error</h1>
              <p className="text-muted-foreground">
                Something went wrong. Please try again later.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Unsubscribe;
