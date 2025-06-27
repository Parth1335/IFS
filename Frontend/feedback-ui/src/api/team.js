export const fetchTeamMembers = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch("http://localhost:8000/api/team/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch team members");
  }

  return await response.json();
};
