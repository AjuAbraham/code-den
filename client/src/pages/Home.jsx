import { useQuery } from "@tanstack/react-query";
import React from "react";
import { topContributers } from "../lib/axios";
import { useNavigate } from "react-router-dom";

// Dummy data for top consistent users
const topUsers = [
  {
    id: 1,
    name: "Alice",
    avatar: "https://avatar.iran.liara.run/public/girl",
    maxStreak: 27,
  },
  {
    id: 2,
    name: "Bob",
    avatar: "https://avatar.iran.liara.run/public/boy",
    maxStreak: 23,
  },
  {
    id: 3,
    name: "Charlie",
    avatar: "https://avatar.iran.liara.run/public/boy",
    maxStreak: 21,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["top"],
    queryFn: topContributers,
    staleTime: 10000,
  });
  console.log("data", data);
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold z-10 text-center mb-6">
        Welcome to <span className="text-primary">Code Den</span>
      </h1>

      <h2 className="text-2xl font-bold text-white mb-4">
        🔥 Top Consistent Users
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => navigate(`/user/:${user.id}`)}
            className="bg-slate-800 cursor-pointer border border-slate-700 rounded-2xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl transition-shadow"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-14 w-14 rounded-full object-cover border border-slate-600"
            />
            <div>
              <h3 className="text-white font-semibold text-lg">{user.name}</h3>
              <p className="text-orange-400 text-sm flex items-center gap-1">
                🔥 Max Streak:{" "}
                <span className="font-bold">{user.maxStreak}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
