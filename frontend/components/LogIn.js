import React, { useState } from 'react';

const LogInForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 200px;
`;

export const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSummary, setShowSummary] = useState(false);


  const handleLogin = event => {
    event.preventDefault()
    dispatchEvent(login(email, password))
  }
  
  return (
    <div>
      {!showSummary && (
        <LogInForm onSubmit={handleLogin}>
          <Label>
            <p>E-mail</p>
            <input
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Label>
          <Label>
            <p>password</p>
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            >
            </input>
          </Label>
          <Button type='submit'>Log in!</Button>
        </LogInForm>
      )}
    </div>
  )
}