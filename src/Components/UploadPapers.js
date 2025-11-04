"use client"

import { useState, useEffect, useRef } from "react"
import "./UploadPapers.css"
import { AiOutlineDelete } from "react-icons/ai"
import { FiUpload } from "react-icons/fi"
import { Link } from "react-router-dom"

const UploadPapers = () => {
  const [attachedFiles, setAttachedFiles] = useState([])
  const [bulkAttachedFiles, setBulkAttachedFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [filenames, setFilenames] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bulkUploadFilename, setBulkUploadFilename] = useState("")
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const individualFileInputRef = useRef(null)
  const bulkFileInputRef = useRef(null)

  const [summaryDisabled, setSummaryDisabled] = useState(true)
  const [allSummaryDisabled, setAllSummaryDisabled] = useState(true)
  const [indexDisabled, setIndexDisabled] = useState(true)
  const [allIndexDisabled, setAllIndexDisabled] = useState(true)

  const [shouldPollButtons, setShouldPollButtons] = useState(false)

  const [isDraggingIndividual, setIsDraggingIndividual] = useState(false)
  const [isDraggingBulk, setIsDraggingBulk] = useState(false)

  useEffect(() => {
    const handleLoginWithStoredCredentials = async () => {
      try {
        const storedCredentials = localStorage.getItem("rx_chatbot_credentials")
        if (!storedCredentials) {
          throw new Error("No stored credentials found")
        }
        const { email, password } = JSON.parse(storedCredentials)

        const loginResponse = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        if (loginResponse.ok) {
          const loginData = await loginResponse.json()
          console.log("Logged in successfully:", loginData)
          setIsLoggedIn(true)
          setUserEmail(email)

          const filenamesResponse = await fetch(`/api/get-filenames?email=${encodeURIComponent(email)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (filenamesResponse.ok) {
            const filenamesData = await filenamesResponse.json()
            setUploadedFiles(filenamesData.filenames || [])
          } else {
            throw new Error("Failed to fetch filenames")
          }
        } else {
          throw new Error("Failed to login with stored credentials")
        }
      } catch (error) {
        console.error("Error logging in with stored credentials:", error)
      }
    }

    handleLoginWithStoredCredentials()
  }, [])

  useEffect(() => {
    if (!userEmail || !shouldPollButtons) return

    let intervalId
    let timeoutId

    const fetchDisabledButtons = async () => {
      try {
        const response = await fetch("/api/get-disabled-buttons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filenames: uploadedFiles, user_id: userEmail }),
        })
        const data = await response.json()
        setSummaryDisabled(data.summary_disabled)
        setAllSummaryDisabled(data.all_summary_disabled)
        setIndexDisabled(data.index_disabled)
        setAllIndexDisabled(data.all_index_disabled)

        // If ALL buttons are enabled, stop polling
        const allEnabled =
          !data.summary_disabled && !data.all_summary_disabled && !data.index_disabled && !data.all_index_disabled

        if (allEnabled) {
          clearInterval(intervalId)
          setShouldPollButtons(false)
        }
      } catch (error) {
        console.error("Error fetching button states:", error)
      }
    }

    // Wait 30 seconds before hitting the API
    timeoutId = setTimeout(() => {
      // After the initial 30s delay, start polling every 5s
      intervalId = setInterval(fetchDisabledButtons, 5000)
      // Also do one fetch immediately after the delay
      fetchDisabledButtons()
    }, 30000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [uploadedFiles, userEmail, shouldPollButtons])

  const handleIndividualFileChange = (e) => {
    const files = e.target.files
    const names = []
    for (let i = 0; i < files.length; i++) {
      names.push(files[i].name)
    }
    setAttachedFiles(names)
  }

  const handleBulkFileChange = (e) => {
    setBulkUploadFilename(e.target.value)
    const files = e.target.files
    const names = []
    for (let i = 0; i < files.length; i++) {
      names.push(files[i].name)
    }
    setBulkAttachedFiles(names)
  }

  const handleIndividualDragOver = (e) => {
    e.preventDefault()
    setIsDraggingIndividual(true)
  }

  const handleIndividualDragLeave = (e) => {
    e.preventDefault()
    setIsDraggingIndividual(false)
  }

  const handleIndividualDrop = (e) => {
    e.preventDefault()
    setIsDraggingIndividual(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      individualFileInputRef.current.files = files
      handleIndividualFileChange({ target: { files } })
    }
  }

  const handleBulkDragOver = (e) => {
    e.preventDefault()
    setIsDraggingBulk(true)
  }

  const handleBulkDragLeave = (e) => {
    e.preventDefault()
    setIsDraggingBulk(false)
  }

  const handleBulkDrop = (e) => {
    e.preventDefault()
    setIsDraggingBulk(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      bulkFileInputRef.current.files = files
      handleBulkFileChange({ target: { files } })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const storedCredentials = localStorage.getItem("rx_chatbot_credentials")
      const userEmail = storedCredentials ? JSON.parse(storedCredentials).email : null

      if (!userEmail) {
        throw new Error("User email not found in local storage")
      }

      const formData = new FormData()
      const files = individualFileInputRef.current?.files || []

      if (files.length === 0) {
        throw new Error("No files selected")
      }

      for (let i = 0; i < files.length; i++) {
        formData.append("files[]", files[i])
      }
      formData.append("email", userEmail)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const filenamesResponse = await fetch(`/api/get-filenames?email=${encodeURIComponent(userEmail)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (filenamesResponse.ok) {
        const filenamesData = await filenamesResponse.json()
        setUploadedFiles(filenamesData.filenames || [])
        // inside handleSubmit, after setUploadedFiles(...)
        setShouldPollButtons(true)
        setAttachedFiles([]) // Clear the attached files after upload
      } else {
        throw new Error("Failed to fetch filenames after upload")
      }

      setUploadSuccess(true)
      setTimeout(() => {
        setUploadSuccess(false)
      }, 3000)
      console.log("Files uploaded successfully")
    } catch (error) {
      console.error("Error uploading files:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileDelete = async (filename) => {
    console.log("Deleting file:", filename)
    try {
      const response = await fetch("/api/delete-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userEmail, filename }),
      })

      if (!response.ok) {
        throw new Error("Delete request failed")
      }

      const data = await response.json()
      if (data.success) {
        console.log("File deleted successfully:", filename)
        const updatedFilenames = uploadedFiles.filter((name) => name !== filename)
        setUploadedFiles(updatedFilenames)
        setDeleteSuccess(true)
        setTimeout(() => {
          setDeleteSuccess(false)
        }, 3000)
      } else {
        console.error("Error deleting file:", data.error)
      }
    } catch (error) {
      console.error("Error deleting file:", error.message)
    }
  }

  const handleBulkUploadSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const storedCredentials = localStorage.getItem("rx_chatbot_credentials")
      const userEmail = storedCredentials ? JSON.parse(storedCredentials).email : null

      if (!userEmail) {
        throw new Error("User email not found in local storage")
      }

      const formData = new FormData()
      const files = bulkFileInputRef.current?.files || []

      if (files.length === 0) {
        throw new Error("No files selected")
      }

      for (let i = 0; i < files.length; i++) {
        formData.append("files[]", files[i])
      }
      formData.append("email", userEmail)
      formData.append("group_name", bulkUploadFilename)

      const response = await fetch("/api/upload-files-bulk", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.error)
      }

      const filenamesResponse = await fetch(`/api/get-filenames?email=${encodeURIComponent(userEmail)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (filenamesResponse.ok) {
        const filenamesData = await filenamesResponse.json()
        setUploadedFiles(filenamesData.filenames || [])
        // inside handleBulkUploadSubmit, after setUploadedFiles(...)
        setShouldPollButtons(true)
        setBulkAttachedFiles([]) // Clear the attached files after upload
      } else {
        throw new Error("Failed to fetch filenames after bulk upload")
      }

      setUploadSuccess(true)
      setTimeout(() => {
        setUploadSuccess(false)
      }, 3000)
      console.log("Files uploaded successfully")
    } catch (error) {
      console.error("Error uploading files:", error.message)
      // Display the error message to the user or handle it accordingly
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="UploadPapers-container">
      <h1 className="UploadPapers-heading">
        Upload Your <span style={{ color: "#6f42c1" }}>Files</span>
      </h1>
      <div className="UploadPapers-bigbox">
        <form id="UploadPapers-upload-form" className="UploadPapers-form" onSubmit={handleSubmit}>
          <div className="UploadPapers-upload-box">
            <div
              className="UploadPapers-drag-box"
              onDragOver={handleIndividualDragOver}
              onDragLeave={handleIndividualDragLeave}
              onDrop={handleIndividualDrop}
            >
              <input
                id="individual-file-upload"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleIndividualFileChange}
                style={{ display: "none" }}
                ref={individualFileInputRef}
              />
              <label htmlFor="individual-file-upload" className="UploadPapers-uicon">
                <FiUpload />
                <br />
                <p>Click here or drag and drop files to select them</p>
                <p>Then click Upload to upload your files</p>
              </label>
            </div>
            {loading && (
              <div className="UploadPapers-loader">
                <div className="UploadPapers-dot"></div>
                <div className="UploadPapers-dot"></div>
                <div className="UploadPapers-dot"></div>
              </div>
            )}
          </div>
          <div className="UploadPapers-uploads-container">
            <div id="UploadPapers-upload-form" className="UploadPapers-upload-form">
              {attachedFiles.length > 0 && (
                <>
                  <h3 className="UploadPapers-hhh">Attached Files</h3>
                  <ul className="UploadPapers-file-list">
                    {attachedFiles.map((file, index) => (
                      <li key={index}>
                        <span>{file}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          <input className="UploadPapers-upload-button" type="submit" value="Upload" style={{ marginTop: "20px" }} />
        </form>

        <div className="bulk-upload-text">
          <p className="UploadPapers-bulk-p">
            or{" "}
            <span className="clickable-text" onClick={() => setShowBulkUpload(!showBulkUpload)}>
              click to upload multiple files as a single combined file
            </span>
            .
          </p>
        </div>
        {showBulkUpload && (
          <form id="UploadPapers-bulk-upload-form" className="UploadPapers-form" onSubmit={handleBulkUploadSubmit}>
            <div className="UploadPapers-upload-box">
              <div
                className="UploadPapers-drag-box"
                onDragOver={handleBulkDragOver}
                onDragLeave={handleBulkDragLeave}
                onDrop={handleBulkDrop}
              >
                <input
                  id="bulk-file-upload"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleBulkFileChange}
                  style={{ display: "none" }}
                  ref={bulkFileInputRef}
                />
                <label htmlFor="bulk-file-upload" className="UploadPapers-uicon">
                  <FiUpload />
                  <br />
                  <p>Click here or drag and drop files to select them</p>
                  <p>Then click Bulk Upload to upload your files</p>
                </label>
              </div>
              {loading && (
                <div className="UploadPapers-loader">
                  <div className="UploadPapers-dot"></div>
                  <div className="UploadPapers-dot"></div>
                  <div className="UploadPapers-dot"></div>
                </div>
              )}
            </div>
            <div className="UploadPapers-uploads-container">
              <div id="UploadPapers-upload-form" className="UploadPapers-upload-form">
                {bulkAttachedFiles.length > 0 && (
                  <>
                    <h3 className="UploadPapers-hhh">Attached Files</h3>
                    <ul className="UploadPapers-file-list">
                      {bulkAttachedFiles.map((file, index) => (
                        <li key={index}>
                          <span>{file}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
            <div className="UploadPapers-upload-box">
              <input
                type="text"
                placeholder="Enter bulk upload filename"
                onChange={(e) => setBulkUploadFilename(e.target.value)}
                required
                className="UploadPapers-bulk-input" // Add this class for styling
              />
              <input className="UploadPapers-upload-button" type="submit" value="Bulk Upload" />
            </div>
          </form>
        )}

        {uploadSuccess && <div className="UploadPapers-alert UploadPapers-success">File uploaded successfully.</div>}

        {deleteSuccess && <div className="UploadPapers-alert UploadPapers-success">File deleted successfully.</div>}

        {isLoggedIn ? (
          <div className="UploadPapers-uploads-container">
            <div id="UploadPapers-upload-form" className="UploadPapers-upload-form">
              {uploadedFiles.length > 0 && (
                <>
                  <h3 className="UploadPapers-hhh">Uploaded Files</h3>
                  <ul className="UploadPapers-file-list">
                    {uploadedFiles.map((file, index) => (
                      <li key={index}>
                        <span>{file}</span>
                        <AiOutlineDelete className="UploadPapers-delete-icon" onClick={() => handleFileDelete(file)} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="UploadPapers-not-logged-in">
            <p>You need to be logged in to view and upload files.</p>
          </div>
        )}
      </div>

      <div className="UploadPapers-buttons-container">
        {/*<Link to="/dashboard/summary-generator" className="UploadPapers-button-link">
          <button disabled={summaryDisabled}>Generate Summaries</button>
        </Link>
        <Link to="/dashboard/comparison-tool" className="UploadPapers-button-link">
          <button disabled={allSummaryDisabled}>Compare Summaries</button>
        </Link>
        <Link to="/dashboard/compare-and-chat" className="UploadPapers-button-link">
          <button disabled={allIndexDisabled}>Chat Across Documents</button>
        </Link>
        <Link to="/dashboard/notes" className="UploadPapers-button-link">
          <button disabled={indexDisabled}>Generate Notes</button>
        </Link>*/}
        <Link to="/dashboard/ai-chat" className="UploadPapers-button-link">
          <button disabled={indexDisabled}>Chat with Document</button>
        </Link>
        <Link to="/dashboard/questions-generator" className="UploadPapers-button-link">
          <button disabled={indexDisabled}>Generate Quiz</button>
        </Link>
        <Link to="/dashboard/mind-maps" className="UploadPapers-button-link">
          <button disabled={indexDisabled}>Generate Mind Maps</button>
        </Link>
        <Link to="/dashboard/flashcards" className="UploadPapers-button-link">
          <button disabled={indexDisabled}>Generate Flashcards</button>
        </Link>
      </div>
    </div>
  )
}

export default UploadPapers
