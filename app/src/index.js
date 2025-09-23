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

  //sessionStorage.clear();

  const fetch = async () => {
    const data = await post('website/site_data', null, null);
    if (data && data.rc) {
      return;
    }
    if (!data) {
      return;
    }

    const indexed = {};
    data.forEach((_obj) => {
      indexed[_obj.key] = _obj;
    });

    setSiteData(indexed);
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
  }, [siteData]);

  const updateSiteData = async () => {
    sessionStorage.removeItem('site_data');
    await fetch();
  };

  return (
    <>
      {dataLoading && <div><Spinner animation="border" /></div>}

      <BrowserRouter>
      <Routes>
        <Route exactpath="/" element={<GamePage siteData={siteData} updateSiteData={updateSiteData} />} />
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
try {
  const domNode = document.getElementById('root');
  if (!domNode) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(domNode);
  root.render(<App />);
  
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Error rendering React app:', error);
  // Fallback: show error message on screen
  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
      <h2>Application Error</h2>
      <p>Failed to load the application: ${error.message}</p>
      <p>Please check the browser console for more details.</p>
    </div>
  `;
  document.body.appendChild(errorDiv);
}
