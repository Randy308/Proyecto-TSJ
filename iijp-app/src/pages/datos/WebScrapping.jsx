import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthUser from '../../auth/AuthUser';

const WebScrapping = () => {
  
  const { getToken, can } = AuthUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!can("web_scrapping")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [can, navigate]);

  return (
    <div>WebScrapping</div>
  )
}

export default WebScrapping