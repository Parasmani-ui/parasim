import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import Spinner from 'react-bootstrap/Spinner';

import GamePage from './website/GamePage';
import NotFound from './website/NotFound';
import { post } from './components/utils/ServerCall';
import gameConfig from './gameConfig';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './css/Global.css';

const App = () => {
  const [siteData, setSiteData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('App component rendering, siteData:', siteData);

  //sessionStorage.clear();

  const fetch = async () => {
    console.log('Fetching site data...');
    try {
      const data = await post('website/site_data', null, null);
      console.log('Site data response:', data);
      
      if (data && data.rc) {
        console.error('Site data error:', data.rc);
        setError(data.rc);
        return;
      }
      if (!data) {
        console.warn('No site data received');
        return;
      }

      const indexed = {};
      data.forEach((_obj) => {
        indexed[_obj.key] = _obj;
      });

      setSiteData(indexed);
      console.log('Site data set successfully:', indexed);
    } catch (err) {
      console.error('Error fetching site data:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    console.log('App useEffect running...');
    fetch();
  }, []);

  useEffect(() => {
    console.log('Site data changed:', siteData);
  }, [siteData]);

  const updateSiteData = async () => {
    sessionStorage.removeItem('site_data');
    await fetch();
  };

  // Show error if there's one
  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', fontFamily: 'Arial, sans-serif' }}>
        <h2>App Error</h2>
        <p>Error: {error}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  // Show loading state
  if (dataLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  console.log('Rendering router...');
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamePage siteData={siteData} updateSiteData={updateSiteData} />} />
        <Route index element={<GamePage siteData={siteData} updateSiteData={updateSiteData} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

// Set favicon and title immediately (DOM is ready when webpack script loads)
const setupPageMetadata = () => {
  const faviconPath = gameConfig.favicon;

  let faviconLink = document.querySelector("link[rel~='icon']");
  if (!faviconLink) {
    faviconLink = document.createElement("link");
    faviconLink.rel = "icon";
    document.head.appendChild(faviconLink);
  }

  faviconLink.href = faviconPath;

  let title = document.querySelector("title");
  if (!title) {
    title = document.createElement("title");
    title.innerText = gameConfig.title;
    document.head.appendChild(title);
  } else {
    title.innerText = gameConfig.title;
  }
};

// Run immediately
setupPageMetadata();

// Add error handling for production debugging
console.log('Starting React app initialization...');
console.log('gameConfig:', gameConfig);

try {
  console.log('Looking for root element...');
  const domNode = document.getElementById('root');
  console.log('Root element:', domNode);
  
  if (!domNode) {
    throw new Error('Root element not found');
  }
  
  console.log('Creating React root...');
  const root = createRoot(domNode);
  
  console.log('Rendering App component...');
  root.render(<App />);
  
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Error rendering React app:', error);
  console.error('Error stack:', error.stack);
  
  // Fallback: show error message on screen
  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial, sans-serif; background: white; border: 1px solid red; margin: 20px;">
      <h2>Application Error</h2>
      <p>Failed to load the application: ${error.message}</p>
      <p>Please check the browser console for more details.</p>
      <details>
        <summary>Error Stack</summary>
        <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.stack}</pre>
      </details>
    </div>
  `;
  document.body.appendChild(errorDiv);
}
