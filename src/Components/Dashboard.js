import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { FiUpload, FiFileText, FiList, FiMessageCircle, FiClipboard, FiLayers, FiMap, FiGitMerge, FiMenu, FiBook } from 'react-icons/fi';
import './Dashboard.css';
import UploadPapers from './UploadPapers';
import SummaryGenerator from './SummaryGenerator';
import ProfileComponent from './ProfileComponent';
import ComparisonTool from './CompareSummaries';
import AIChat from './AIChat';
import QuestionsGenerator from './QuestionsGenerator';
import MindMaps from './MindMaps';
import ResearchLibrary from './ResearchLibrary';
import CompareAndChat from './CompareAndChat';
import UploadDashboard from './UploadDashboard';
import Notes from './NotesGenerator';
import Flashcards from './FlashCards';

function Dashboard({ handleLogout }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [showNotes, setShowNotes] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showInfoText, setShowInfoText] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfoText(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const handleTabClick = (path) => {
    setActiveTab(path);
    setShowNotes(false);
    setSidebarCollapsed(true);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  const renderSidebar = () => (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <ul>
        <li>
          <Link
            to="/dashboard/upload-papers"
            className={activeTab === '/dashboard/upload-papers' ? 'active' : ''}
            onClick={() => handleTabClick('/dashboard/upload-papers')}
          >
            <FiUpload className="icon" />
            <span className="label">Upload Documents</span>
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/summary-generator"
            className={activeTab === '/dashboard/summary-generator' ? 'active' : ''}
            onClick={() => handleTabClick('/dashboard/summary-generator')}
          >
            <FiFileText className="icon" />
            <span className="label">Summary Generator</span>
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/comparison-tool"
            className={activeTab === '/dashboard/comparison-tool' ? 'active' : ''}
            onClick={() => handleTabClick('/dashboard/comparison-tool')}
          >
            <FiList className="icon" />
            <span className="label">Compare Summaries</span>
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/ai-chat"
            className={activeTab === '/dashboard/ai-chat' ? 'active' : ''}
            onClick={() => handleTabClick('/dashboard/ai-chat')}
          >
            <FiMessageCircle className="icon" />
            <span className="label">Chat with Document</span>
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/compare-and-chat"
            className={activeTab === '/dashboard/compare-and-chat' ? 'active' : ''}
            onClick={() => handleTabClick('/dashboard/compare-and-chat')}
          >
            <FiMap className="icon" />
            <span className="label">Compare and Chat</span>
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/questions-generator"
            className={activeTab === '/dashboard/questions-generator' ? 'active' : ''}
            onClick={() => handleTabClick('/dashboard/questions-generator')}
          >
            <FiClipboard className="icon" />
            <span className="label">Questions Generator</span>
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/mind-maps"
            className={activeTab === '/dashboard/mind-maps' ? 'active' : ''}
            onClick={() => handleTabClick('/dashboard/mind-maps')}
          >
            <FiGitMerge className="icon" />
            <span className="label">Mind Maps</span>
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/flashcards"
            className={activeTab === '/dashboard/flashcards' ? 'active' : ''}
            onClick={() => handleTabClick('/dashboard/flashcards')}
          >
            <FiBook className="icon" />
            <span className="label">Flashcards</span>
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard/research-library"
            className={activeTab === '/dashboard/research-library' ? 'active' : ''}
            onClick={() => handleTabClick('/dashboard/research-library')}
          >
            <FiLayers className="icon" />
            <span className="label">Notes</span>
          </Link>
        </li>
      </ul>
    </aside>
  );

  return (
    <div className="dashboard">
      <ProfileComponent handleLogout={handleLogout} />

      {isMobile && (
        <button className="toggle-sidebar-button" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      )}

      {renderSidebar()}

      <main className="main-content">
        <Routes>
          <Route path="upload-papers" element={<UploadPapers />} />
          <Route path="summary-generator" element={<SummaryGenerator />} />
          <Route path="comparison-tool" element={<ComparisonTool />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="questions-generator" element={<QuestionsGenerator />} />
          <Route path="mind-maps" element={<MindMaps />} />
          <Route path="research-library" element={<ResearchLibrary />} />
          <Route path="compare-and-chat" element={<CompareAndChat />} />
          <Route path="upload-dashboard" element={<UploadDashboard />} />
          <Route path="flashcards" element={<Flashcards />} />

          <Route path="/" element={
            <div>
              <h1>Welcome to your Dashboard</h1>
              <p>Select an option from the sidebar to get started.</p>
            </div>
          } />
        </Routes>
      </main>

      <button className={`toggle-notes-button ${showNotes ? 'shifted' : ''}`} onClick={toggleNotes}>
        Notes
      </button>
      {showInfoText && (
          <span className="info-text">
             You can paste your content as prompt and generate notes simultaneously <span className="arrow">→</span>
          </span>
        )}

      {showNotes && <Notes showNotes={showNotes} />}
    </div>
  );
}

export default Dashboard;
