import React from "react";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen z-10">
      <div className="loading-overlay"></div>
      <div className="loading-content">
        <svg className="loading-text" viewBox="0 0 200 60">
          <symbol id="s-text">
            <text textAnchor="middle" x="50%" y="50%">
              BOOKTREE
            </text>
          </symbol>
          <use xlinkHref="#s-text" className="loading-text-copy"></use>
          <use xlinkHref="#s-text" className="loading-text-copy"></use>
          <use xlinkHref="#s-text" className="loading-text-copy"></use>
          <use xlinkHref="#s-text" className="loading-text-copy"></use>
          <use xlinkHref="#s-text" className="loading-text-copy"></use>
        </svg>
      </div>
    </div>
  );
};

export default LoadingScreen;
