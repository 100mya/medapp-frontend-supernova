import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NotesEditor.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const NotesEditor = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('title');
  const quillRef = useRef();

  const getEmail = () => {
    const credentials = JSON.parse(localStorage.getItem('rx_chatbot_credentials'));
    return credentials ? credentials.email : '';
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const email = getEmail();
      const response = await fetch(`/api/fetch?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleEdit = (file) => {
    setSelectedFile(file);
    setEditorContent(file.text);
  };

  const handleDelete = async (title) => {
    try {
      const email = getEmail();
      const response = await fetch(`/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, email }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleSave = async () => {
    try {
      const email = getEmail();
      const response = await fetch(`/api/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: editorContent,
          title: selectedFile.title,
          email,
          tags: selectedFile.tags,
          type: selectedFile.type,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update file');
      }
      fetchFiles();
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const getSuggestions = () => {
    const inputValue = searchTerm.trim().toLowerCase();

    if (!inputValue) {
      return files;
    }

    return files.filter((file) => {
      switch (searchCriteria) {
        case 'title':
          return file.title.toLowerCase().includes(inputValue);
        case 'tags':
          return file.tags.some((tag) => tag.toLowerCase().includes(inputValue));
        case 'type':
          return file.type.toLowerCase().includes(inputValue);
        default:
          return false;
      }
    });
  };

  const onChangeSearchCriteria = (event) => {
    setSearchCriteria(event.target.value);
    setSearchTerm('');
  };

  const inputProps = {
    placeholder: 'Search by ' + searchCriteria,
    value: searchTerm,
    onChange: (_, { newValue }) => setSearchTerm(newValue),
  };

  const filteredFiles = getSuggestions();

  return (
    <div className="NotesEditor-container">
      <div className="NotesEditor-table-section">
        <h2>Saved <span>Files</span></h2>
        <div className="NotesEditor-search">
          <select value={searchCriteria} onChange={onChangeSearchCriteria}>
            <option value="title">Search by Title</option>
            <option value="tags">Search by Tags</option>
            <option value="type">Search by Type</option>
          </select>
          <input
            type="text"
            className="NotesEditor-search-input"
            placeholder={'Search by ' + searchCriteria}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="NotesEditor-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tags</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file) => (
              <tr key={file.title}>
                <td>{file.title}</td>
                <td>
                  <div className="NotesEditor-tags">
                    {file.tags.map((tag, index) => (
                      <span key={index} className="NotesEditor-tag">{tag}</span>
                    ))}
                  </div>
                </td>
                <td>{file.type}</td>
                <td>
                  <button className="NotesEditor-action-button" onClick={() => handleEdit(file)}>
                    <FaEdit />
                  </button>
                  <button className="NotesEditor-action-button" onClick={() => handleDelete(file.title)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="NotesEditor-editor-section">
        {selectedFile && (
          <>
            <h2>Edit File: <span>{selectedFile.title}</span></h2>
            <ReactQuill
              ref={quillRef}
              value={editorContent}
              onChange={setEditorContent}
            />
            <div>
              <button className="NotesEditor-save-button" onClick={handleSave}>
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotesEditor;
