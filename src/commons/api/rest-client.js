function performRequest(request, callback) {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    // Clone the request to set custom headers
    const modifiedRequest = new Request(request, {
        credentials: 'include', // Ensure credentials are included in all requests
        headers: new Headers({
            ...Object.fromEntries(request.headers), // Copy any existing headers
            'Authorization': token ? `Bearer ${token}` : '', // Add Authorization header if token is present
        }),
    });

    fetch(modifiedRequest)
        .then(response => {
            if (response.ok) {
                return response.json().then(json => callback(json, response.status, null));
            } else {
                return response.clone().json()
                    .then(err => callback(null, response.status, err))
                    .catch(() => {
                        return response.text().then(text => {
                            callback(null, response.status, { error: text });
                        });
                    });
            }
        })
        .catch(err => {
            callback(null, 500, err);
        });
}

// Export performRequest as a named export
export { performRequest };
