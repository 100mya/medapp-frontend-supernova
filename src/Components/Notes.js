import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'; // Import icons for arrows
import './Notes.css';

const NotesPage = ({ showNotes, setShowNotes }) => {
  const [userEmail, setUserEmail] = useState('');
  const [filenames, setFilenames] = useState([]);
  const [selectedFilename, setSelectedFilename] = useState('');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedCredentials = localStorage.getItem('rx_chatbot_credentials');
    if (storedCredentials) {
      const { email } = JSON.parse(storedCredentials);
      setUserEmail(email);
      fetchFilenames(email);
      fetchNotes(email);
    } else {
      console.error('User credentials not found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (showNotes) {
      fetchNotes(userEmail);
    }
  }, [showNotes, userEmail]);

  const fetchFilenames = async (email) => {
    try {
      const response = await fetch(`/api/get-filenames?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setFilenames(data.filenames || []);
      } else {
        throw new Error('Failed to fetch filenames');
      }
    } catch (error) {
      console.error('Error fetching filenames:', error);
    }
  };

  const fetchNotes = async (email) => {
    try {
      const response = await fetch('/api/get-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      } else {
        throw new Error('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/add-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedFilename,
          note: noteText,
          email: userEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage('Note added successfully');
          fetchNotes(userEmail);
        } else {
          throw new Error('Failed to add note');
        }
      } else {
        throw new Error('Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (filename, note) => {
    try {
      const response = await fetch('/api/delete-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          note,
          email: userEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage('Note deleted successfully');
          fetchNotes(userEmail);
        } else {
          throw new Error('Failed to delete note');
        }
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleNoteSelect = (filename, note) => {
    setSelectedFilename(filename);
    setNoteText(note);
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  return (
    <div className={`notes-page-container ${showNotes ? 'show' : ''}`}>
      <div className="notes-toggle" onClick={toggleNotes}>
        <span className="label">Notes</span>
      </div>

      <h1 className="page-title">Notes</h1>

      <form className="add-note-form" onSubmit={handleAddNote}>
        <select
          id="filename"
          className="form-select"
          value={selectedFilename}
          onChange={(e) => setSelectedFilename(e.target.value)}
        >
          <option value="">Select a filename</option>
          {filenames.map((filename, index) => (
            <option key={index} value={filename}>{filename}</option>
          ))}
        </select>
        <textarea
          id="note-text"
          className="form-textarea"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note..."
          required
        />
        <button type="submit" className="btn btn-primary">Add Note</button>
      </form>

      {message && <div className="message">{message}</div>}

      <table className="notes-table">
        <thead>
          <tr>
            <th className="table-header">Filename</th>
            <th className="table-header">Note</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note, index) => (
            <tr key={index}>
              <td>{note.filename}</td>
              <td>{note.note}</td>
              <td>
                <button className="btn btn-secondary" onClick={() => handleNoteSelect(note.filename, note.note)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDeleteNote(note.filename, note.note)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotesPage;
