// Simple test version to isolate the issue
import React from 'react';
import { createRoot } from 'react-dom/client';

// Simple test component
const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test App is Working!</h1>
      <p>If you see this, React is rendering correctly.</p>
      <p>Domain: {window.location.hostname}</p>
      <p>Environment API URL: {process.env.REACT_APP_API_URL || 'Not set'}</p>
      <button onClick={() => alert('Button clicked!')}>Test Button</button>
    </div>
  );
};

// Simple render without complex dependencies
try {
  console.log('Starting simple test app...');
  
  const domNode = document.getElementById('root');
  if (!domNode) {
    throw new Error('Root element not found');
  }
  
  console.log('Root element found, creating React root...');
  const root = createRoot(domNode);
  
  console.log('Rendering test app...');
  root.render(<TestApp />);
  
  console.log('Test app rendered successfully!');
} catch (error) {
  console.error('Error in test app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
      <h2>Test App Error</h2>
      <p>Error: ${error.message}</p>
      <p>Check console for details</p>
    </div>
  `;
}
