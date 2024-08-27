import { useEffect, useState } from "react";
import { fetchUsersData } from "@/app/utils/supabase/client";

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState(0);

  useEffect(() => {
    const fetchSubscribers = async () => {
      const users = await fetchUsersData();
      const totalSubscribers = users.filter((user) => user.newsletter).length;
      setSubscribers(totalSubscribers);
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Inscritos na Newsletter</h2>
      <p className="text-3xl font-bold">{subscribers}</p>
    </div>
  );
};

export { NewsletterSubscribers };
