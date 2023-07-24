import axios from "axios";

const sendUpdate = (message, goals) =>
  axios.post("/api/v1/career_updates", {
    career_update: {
      message,
      goals
    }
  });

const deleteCareerUpdate = id => axios.delete(`/api/v1/career_updates/${id}`);

const editCareerUpdate = (message, goals, id) => {
  console.log("message:", message);
  console.log("goals:", goals);
  console.log("id:", id);

  return axios.patch(`/api/v1/career_updates/${id}`, {
    career_update: {
      message,
      goals
    }
  });
};

export const careerUpdatesService = {
  sendUpdate,
  deleteCareerUpdate,
  editCareerUpdate
};
