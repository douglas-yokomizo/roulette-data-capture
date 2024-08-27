import { useEffect, useState } from "react";
import { fetchUsersData } from "@/app/utils/supabase/client";
import CountUp from "react-countup";

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchSubscribers = async () => {
      const users = await fetchUsersData();
      const totalSubscribers = users.filter((user) => user.newsletter).length;
      setSubscribers(totalSubscribers);
      setIsLoaded(true);
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Inscritos na Newsletter</h2>
      {isLoaded ? (
        <p className="text-3xl font-bold">
          <CountUp end={subscribers} duration={2} />
        </p>
      ) : (
        <p className="text-3xl font-bold">0</p>
      )}
    </div>
  );
};

export { NewsletterSubscribers };
