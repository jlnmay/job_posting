module.exports = {
    save: (data) => axios.post("/Job/Save", { JobViewModel: data }),
    getRowById: (id) => axios.get(`/Job/GetRowById/${id}`),
    deleteRow: (id) => axios.post(`/Job/Delete`, { id: id })
};