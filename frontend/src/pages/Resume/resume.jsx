import { useEffect, useState } from "react";
import Advertisement from "../../components/Advertisement/advertisement";

const Resume = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    setUserData(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  if (!userData) {
    return (
      <div className="mt-20 text-center text-gray-500">
        Loading resume...
      </div>
    );
  }

  return (
    <div className="px-4 xl:px-10 py-8 flex gap-5 bg-gray-100 mt-14">

      {/* LEFT – RESUME */}
      <div className="w-full md:w-[74%] space-y-5">

        {/* COVER + PROFILE */}
        <div className="bg-white rounded-xl overflow-hidden shadow">
          <img
            src={userData.cover_pic}
            alt="cover"
            className="w-full h-48 object-cover"
          />

          <div className="relative px-6 pb-6">
            <img
              src={userData.profilePic}
              alt="profile"
              className="w-32 h-32 rounded-full border-4 border-white absolute -top-16 bg-white"
            />

            <div className="pt-20">
              <h1 className="text-2xl font-semibold">
                {userData.f_name}
              </h1>

              <p className="text-gray-600">
                {userData.headlines || "No headline provided"}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {userData.curr_company || "—"} · {userData.curr_location || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {userData.about || "No description added yet."}
          </p>
        </div>

        {/* SKILLS */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-3">Skills</h2>

          {userData.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No skills added.
            </p>
          )}
        </div>

        {/* EXPERIENCE */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-3">Experience</h2>

          {userData.experience?.length ? (
            <div className="space-y-4">
              {userData.experience.map((exp, i) => (
                <div key={i}>
                  <h3 className="font-medium">{exp.role}</h3>
                  <p className="text-sm text-gray-600">
                    {exp.company}
                  </p>
                  <p className="text-xs text-gray-500">
                    {exp.startDate} – {exp.endDate || "Present"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No experience added.
            </p>
          )}
        </div>

        {/* CONTACT */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p className="text-sm text-gray-700">
            Email: <span className="text-blue-600">{userData.email}</span>
          </p>
        </div>
      </div>

      {/* RIGHT – AD */}
      <div className="hidden md:block w-[26%]">
        <div className="sticky top-20">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default Resume;
