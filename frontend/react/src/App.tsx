import { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignup() {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, document, password }),
    });
    const data = await response.json();
    if (data.accountId) {
      setMessage('success');
    } else {
      setMessage(data.message);
    }
  }

  return (
    <>
      <div>
        <input
          className="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input-document"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
        />
        <input
          className="input-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-button" onClick={handleSignup}>
          Signup
        </button>
        {message && <span className="span-message">{message}</span>}
      </div>
    </>
  );
}

export default App;
