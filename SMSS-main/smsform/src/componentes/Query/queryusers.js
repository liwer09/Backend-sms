import axios from "axios";

const getusers = async () => {
    const endpoint = "https://localhost/users";
    try {
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {

    }
}

const deleteusers = async (id) => {
    const endpoint = `https://localhost/users/${id}`;
    try {
        const response = await axios.delete(endpoint);
        const status = response.status;
        const data = response.data;
        return {status, data};
    } catch (error) {

    }
}

const putusers = async (queryWithoutGroup, groupId, newRow) => {
    const endpoint = `${queryWithoutGroup}&group_id=${encodeURIComponent(groupId)}`;
    try {
        const response = await axios.put(endpoint, newRow);
        const status = response.status;
        const data = response.data;
        return {status, data};
    } catch (error) {
    }
}

const postusers = async (queryWithoutGroupPost, groupId, newRow) => {
    const endpoint = `${queryWithoutGroupPost}&group_id=${encodeURIComponent(groupId)}`;
    try {
        const response = await axios.post(endpoint, newRow);
        const status = response.status;
        const data = response.data;
        return {status, data};
    } catch (error) {

    }
}

export { getusers, deleteusers, putusers , postusers  };
