import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import * as API_USERS from '../../../person/api/person-api'; // Your API methods
import { jwtDecode } from 'jwt-decode';

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Replace useHistory with useNavigate
  
    const handleSubmit = async (e) => {
    e.preventDefault();
    API_USERS.login(username, password, (result, status) => {
        console.log("Login result:", jwtDecode(result.token)); // Debugging to confirm login data
        console.log("Login status:", status);  // Debugging to confirm status

        if (status === 200 && jwtDecode(result.token)) { // Check if user data is present
            onLogin(jwtDecode(result.token)); // Pass user details to App
        } else {
            setError((result && result.error) || "Invalid username or password.");
        }
    });
};

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert color="danger">{error}</Alert>}
            <FormGroup>
                <Label for="username">Username</Label>
                <Input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="password">Password</Label>
                <Input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </FormGroup>
            <Button type="submit" color="primary">Login</Button>
        </Form>
    );
};

export default LoginForm;