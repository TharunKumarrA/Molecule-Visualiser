import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";

const teamMembers = [
  "TharunKumarrA",
  "Naganathan05",
  "Lowkik-Sai",
  "Hariprasath8064",
  "adithya-menon-r",
  "Twinn-github09",
];

export default function Teams() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    async function fetchProfiles() {
      const promises = teamMembers.map(async (username) => {
        try {
          const res = await axios.get(
            `https://api.github.com/users/${username}`
          );
          return {
            name: res.data.name || res.data.login,
            username: res.data.login,
            avatar: res.data.avatar_url,
            profileUrl: res.data.html_url,
          };
        } catch (error) {
          console.error("Error fetching data for", username);
          return null;
        }
      });

      const results = await Promise.all(promises);
      setProfiles(results.filter((profile) => profile !== null));
    }

    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white font-inter p-8">
      <NavBar />
      <h1 className="text-4xl text-center  font-inter mb-8">Meet Our Team</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.username}
            className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg flex flex-col items-center"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-2 border-[#2ABD91] mb-4"
            />
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2ABD91] hover:underline"
            >
              @{profile.username}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
