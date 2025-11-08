"use client"

import { useState, useEffect } from "react"
import "./Notes.css"

const NotesPage = ({ showNotes, setShowNotes }) => {
  const [userEmail, setUserEmail] = useState("")
  const [filenames, setFilenames] = useState([])
  const [selectedFilename, setSelectedFilename] = useState("")
  const [noteText, setNoteText] = useState("")
  const [notes, setNotes] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      const userId = localStorage.getItem("id")
      if (!userId) {
        return
      }

      try {
        const response = await fetch("/api/get-user-by-userid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        })

        if (response.ok) {
          const userData = await response.json()
          setUserEmail(userData.email)

          const filenamesResponse = await fetch(`/api/get-filenames?user_id=${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (filenamesResponse.ok) {
            const filenamesData = await filenamesResponse.json()
            setFilenames(filenamesData.filenames || [])
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    checkAuthAndFetchUser()
  }, [])

  const fetchNotes = async () => {
    const userId = localStorage.getItem("id")
    if (!userId) return

    try {
      const response = await fetch("/api/get-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      })

      if (response.ok) {
        const data = await response.json()
        setNotes(data.notes || [])
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  useEffect(() => {
    if (showNotes) {
      fetchNotes()
    }
  }, [showNotes])

  const handleAddNote = async (event) => {
    event.preventDefault()
    const userId = localStorage.getItem("id")
    if (!userId) return

    try {
      const response = await fetch("/api/add-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: selectedFilename,
          note: noteText,
          user_id: userId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMessage("Note added successfully")
          fetchNotes()
        }
      }
    } catch (error) {
      console.error("Error adding note:", error)
    }
  }

  const handleDeleteNote = async (filename, note) => {
    const userId = localStorage.getItem("id")
    if (!userId) return

    try {
      const response = await fetch("/api/delete-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename, note, user_id: userId }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMessage("Note deleted successfully")
          fetchNotes()
        }
      }
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const handleNoteSelect = (filename, note) => {
    setSelectedFilename(filename)
    setNoteText(note)
  }

  const toggleNotes = () => {
    setShowNotes(!showNotes)
  }

  return (
    <div className={`wl-notes-page-container-dark ${showNotes ? "show" : ""}`}>
      <div className="wl-notes-toggle-dark" onClick={toggleNotes}>
        <span className="wl-notes-label-dark">Notes</span>
      </div>

      <h1 className="wl-notes-page-title-dark">Notes</h1>

      <form className="wl-notes-add-form-dark" onSubmit={handleAddNote}>
        <select
          id="filename"
          className="wl-notes-form-select-dark"
          value={selectedFilename}
          onChange={(e) => setSelectedFilename(e.target.value)}
        >
          <option value="">Select a filename</option>
          {filenames.map((filename, index) => (
            <option key={index} value={filename}>
              {filename}
            </option>
          ))}
        </select>
        <textarea
          id="note-text"
          className="wl-notes-form-textarea-dark"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note..."
          required
        />
        <button type="submit" className="wl-notes-btn-primary-dark">
          Add Note
        </button>
      </form>

      {message && <div className="wl-notes-message-dark">{message}</div>}

      <table className="wl-notes-table-dark">
        <thead>
          <tr>
            <th className="wl-notes-table-header-dark">Filename</th>
            <th className="wl-notes-table-header-dark">Note</th>
            <th className="wl-notes-table-header-dark">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note, index) => (
            <tr key={index}>
              <td>{note.filename}</td>
              <td>{note.note}</td>
              <td>
                <button
                  className="wl-notes-btn-secondary-dark"
                  onClick={() => handleNoteSelect(note.filename, note.note)}
                >
                  Edit
                </button>
                <button className="wl-notes-btn-danger-dark" onClick={() => handleDeleteNote(note.filename, note.note)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default NotesPage
