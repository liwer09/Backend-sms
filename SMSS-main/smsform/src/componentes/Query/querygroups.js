import axios from "axios";

const getgroups = async () => {
    const endpoint = "https://localhost/groups";
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {

    }
}

const deletegroups = async (id) => {
    const endpoint = `https://localhost/groups/${id}`;
    try {
        const response = await axios.delete(endpoint);
        const status = response.status;
        const data = response.data;
        return {status, data};
    } catch (error) {

    }
}

const putgroups = async (id, queryParams, newRow) => {
    const endpoint = `https://localhost/groups/${newRow.id}?${queryParams}`;
    try {
        const response = await axios.put(endpoint, newRow);
        const status = response.status;
        const data = response.data;
        return {status, data};
    } catch (error) {

    }
}

const postgroups = async (queryParams, newRow) => {
    const endpoint = `https://localhost/groups?${queryParams}`;
    try {
        const response = await axios.post(endpoint, newRow);
        const status = response.status;
        const data = response.data;
        return {status, data};
    } catch (error) {

    }
}

export { getgroups, deletegroups, putgroups, postgroups };
