import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    localStorage.setItem('userEmail', email);
    toast.success('User logged in successfully!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginTop: '100px',
        padding: '40px',
        background: 'white',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--box-shadow)',
        maxWidth: '400px',
        margin: '100px auto'
      }}>
        <h2 style={{ marginBottom: '30px', color: 'var(--primary-color)' }}>Welcome Back!</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-control"
              placeholder="Enter your email"
            />
          </div>
          {error && <div style={{ color: '#dc3545', marginBottom: '15px', fontSize: '0.9em' }}>{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
