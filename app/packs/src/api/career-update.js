import axios from "axios";

const sendUpdate = (message, goals) =>
  axios.post("/api/v1/career_updates", {
    career_update: {
      message,
      goals
    }
  });

const deleteCareerUpdate = id => axios.delete(`/api/v1/career_updates/${id}`);

const editCareerUpdate = (message, goals, id) =>
  axios.update(`/api/v1/career_updates/${id}`, {
    career_update: {
      message,
      goals
    }
  });

export const careerUpdatesService = {
  sendUpdate,
  deleteCareerUpdate,
  editCareerUpdate
};
