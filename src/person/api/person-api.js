import { HOST } from '../../commons/hosts';
import { performRequest, RestApiClient } from '../../commons/api/rest-client';

const endpoint = {
    person: '/person'
};

function getPersonById(params, callback) {
    let request = new Request(HOST.backend_api + endpoint.person + '/' + params.id, {
        method: 'GET',
    });

    console.log(request.url);
    performRequest(request, callback); // Use performRequest directly
}


function postPerson(user, callback) {
    const token = localStorage.getItem('token');

    fetch(HOST.backend_api + endpoint.person, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '' 
        },
        body: JSON.stringify(user),
        credentials: 'include' 
    })
    .then(response => {
        if (response.status === 201) {
            return response.json().then(data => callback(data, 201, null));
        } else {
            return response.json()
                .then(err => callback(null, response.status, err))
                .catch(() => callback(null, response.status, { message: "Failed to add person." }));
        }
    })
    .catch(error => callback(null, 500, { message: "An unexpected error occurred", error }));
}

function deletePerson(personId, callback) {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    fetch(HOST.backend_api + endpoint.person + '/' + personId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '' // Add Authorization header with Bearer token
        },
        credentials: 'include' // Ensure cookies (session) are included
    })
    .then(response => {
        if (response.ok) {
            callback("Person deleted successfully", 200, null); // On success
        } else if (response.status === 403) {
            throw new Error('Access Denied: You do not have permission to delete this person.');
        } else if (response.status === 401) {
            throw new Error('Unauthorized: You need to log in to perform this action.');
        } else {
            throw new Error(`Failed to delete person with ID: ${personId}`);
        }
    })
    .catch(error => callback(null, 500, error)); // On error
}

function updatePerson(personId, person, callback) {
    const token = localStorage.getItem('token');

    fetch(HOST.backend_api + endpoint.person + '/' + personId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '' 
        },
        body: JSON.stringify(person),
        credentials: 'include' 
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => callback(data, 200, null));
        } else {
            return response.json()
                .then(err => callback(null, response.status, err))
                .catch(() => callback(null, response.status, { message: "Failed to update person." }));
        }
    })
    .catch(error => callback(null, 500, { message: "An unexpected error occurred", error }));
}

function login(username, password, callback) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    let request = new Request('http://localhost:8080/person/auth/login?' + params.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    fetch(request)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Invalid username or password");
            }
        })
        .then(data => {
            const token = data.token; // Extract token from the response
            localStorage.setItem('token', token);
            callback(data, 200); // Call the provided callback on success
        })
        .catch(error => {
            callback(null, 400, error);
        });
}


function getCurrentUser(callback) {
    let request = new Request(HOST.backend_api + '/person/auth/current', {
        method: 'GET',
    });

    performRequest(request, callback);
}



// function getCurrentUser(callback) {
//     fetch(HOST.backend_api + '/person/auth/current', {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         if (response.status === 200) {
//             return response.json();
//         } else {
//             throw new Error("User not authenticated");
//         }
//     })
//     .then(user => callback(user, 200, null))
//     .catch(error => callback(null, 403, error));
// }

function getPersons(callback) {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    fetch(HOST.backend_api + '/person', {
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
            throw new Error("Failed to fetch persons");
        }
    })
    .then(data => callback(data, 200, null))
    .catch(error => callback(null, error.status || 500, error));
}



function logout() {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/login'; // Redirect to login page
}


export {
    getPersons,
    getPersonById,
    postPerson,
    deletePerson,
    updatePerson,
    login,
    getCurrentUser,
    logout
};

