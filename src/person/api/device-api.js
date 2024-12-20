import { HOST1 } from '../../commons/hosts';
import { performRequest } from '../../commons/api/rest-client'; // Import performRequest directly

const endpoint = {
    device: '/device',
    mapping: '/mappings'
};

function getDevices(callback) {
    let request = new Request(HOST1.backend_api + endpoint.device, {
        method: 'GET',
    });
    console.log(request.url);
    performRequest(request, callback); // Use performRequest directly
}

function assignDeviceToUser(userId, deviceId, callback) {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage for authorization if required

    // const url = `${HOST1.backend_api}/device/${userId}/${deviceId}`;
    const request = new Request(HOST1.backend_api + endpoint.device + '/assign/' + userId + '/' + deviceId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '' // Optional authorization header
        }
    });


    fetch(request)
        .then(response => {
            if (response.ok) {
                return response.text(); // Get the success message from response
            } else if (response.status === 403) {
                throw new Error("Access forbidden: Admin privileges required to assign devices.");
            } else if (response.status === 404) {
                throw new Error("User or device not found.");
            } else {
                throw new Error(`Failed to assign device with ID: ${deviceId} to user with ID: ${userId}`);
            }
        })
        .then(message => callback({ message }, 200)) // Pass response as object with message key for consistency
        .catch(error => {
            console.error("Error in assignDeviceToUser:", error);
            callback(null, error.status || 500, error);
        });
}

function getDeviceById(params, callback) {
    let request = new Request(HOST1.backend_api + endpoint.device + '/' + params.id, {
        method: 'GET',
    });
    console.log(request.url);
    performRequest(request, callback); // Use performRequest directly
}

function getAssignedDevices2(callback = () => {}) { // Default to a no-op function if callback is not provided
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    fetch(HOST1.backend_api + '/device/my-devices', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '' // Add Authorization header with Bearer token
        }
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 403) {
            throw new Error("Access forbidden");
        } else {
            throw new Error("Failed to fetch assigned devices");
        }
    })
    .then(data => callback(data, 200, null))
    .catch(error => callback(null, error.status || 500, error));
}

function getAssignedDevices3(user_id, callback = () => {}) { // Add user_id as parameter
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    fetch(`${HOST1.backend_api}/device/${user_id}`, { // Update URL to include user_id
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '' // Add Authorization header with Bearer token
        }
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 403) {
            throw new Error("Access forbidden");
        } else {
            throw new Error("Failed to fetch assigned devices");
        }
    })
    .then(data => callback(data, 200, null)) // Pass the data to the callback
    .catch(error => callback(null, error.status || 500, error)); // Pass error to callback
}



function postDevice(device, callback) {
    let request = new Request(HOST1.backend_api + endpoint.device, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
    });
    console.log("URL: " + request.url);
    performRequest(request, callback); // Use performRequest directly
}

function deleteDevice(deviceId, callback) {
    const token = localStorage.getItem('token'); // Authorization if required
    return fetch(HOST1.backend_api + endpoint.device + '/' + deviceId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '', // Authorization header with token
        },
    })
    .then(response => {
        const contentType = response.headers.get("content-type");
        
        if (response.ok) {
            // Check if the response is JSON or plain text
            return contentType && contentType.includes("application/json") 
                ? response.json() 
                : response.text();
        } else if (response.status === 403) {
            throw new Error("Access denied: You do not have permission to delete this device.");
        } else if (response.status === 404) {
            throw new Error("Device not found: The device ID may be incorrect or does not exist.");
        } else {
            throw new Error(`Failed to delete device with ID: ${deviceId}`);
        }
    })
    .then(data => {
        if (typeof data === "string") {
            console.log("Delete response (text):", data); // Log raw text response
            callback({ message: data }, 200); // Pass as object for consistency
        } else {
            console.log("Delete response (json):", data); // JSON response
            callback(data, 200);
        }
    })
    .catch(err => {
        console.error("Error in deleteDevice:", err);
        callback(null, 500, err);
    });
}



function updateDevice(deviceId, device, callback) {
    let request = new Request(HOST1.backend_api + endpoint.device + '/' + deviceId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
    });
    console.log("URL: " + request.url);
    performRequest(request, callback); // Use performRequest directly
}

function getAssignedDevices(userId, callback) {
    let request = new Request(HOST1.backend_api + endpoint.device + `/assigned/${userId}`, {
        method: 'GET',
    });
    console.log(request.url);
    performRequest(request, callback); // Use performRequest directly
}

export { 
    getDevices,
    getDeviceById,
    postDevice,
    deleteDevice,
    updateDevice,
    getAssignedDevices,
    getAssignedDevices2,
    getAssignedDevices3,
    assignDeviceToUser 
};
