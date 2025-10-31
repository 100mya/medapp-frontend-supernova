"use client"

import { useState, useEffect } from "react"
import "./Flashcards.css"

const Flashcards = () => {
  const [userEmail, setUserEmail] = useState("")
  const [filenames, setFilenames] = useState([])
  const [selectedFile, setSelectedFile] = useState("")
  const [flashcards, setFlashcards] = useState({})
  const [loading, setLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [showPopup, setShowPopup] = useState(false)
  const [selectedFlashcardIndex, setSelectedFlashcardIndex] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [cardText, setCardText] = useState("")

  const languages = [
    { code: "en", name: "English" },
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" },
    { code: "am", name: "Amharic" },
    { code: "ar", name: "Arabic" },
    { code: "hy", name: "Armenian" },
    { code: "az", name: "Azerbaijani" },
    { code: "eu", name: "Basque" },
    { code: "be", name: "Belarusian" },
    { code: "bn", name: "Bengali" },
    { code: "bs", name: "Bosnian" },
    { code: "bg", name: "Bulgarian" },
    { code: "ca", name: "Catalan" },
    { code: "ceb", name: "Cebuano" },
    { code: "zh", name: "Chinese" },
    { code: "co", name: "Corsican" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "nl", name: "Dutch" },
    { code: "eo", name: "Esperanto" },
    { code: "et", name: "Estonian" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "fy", name: "Frisian" },
    { code: "gl", name: "Galician" },
    { code: "ka", name: "Georgian" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "gu", name: "Gujarati" },
    { code: "ht", name: "Haitian Creole" },
    { code: "ha", name: "Hausa" },
    { code: "haw", name: "Hawaiian" },
    { code: "he", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "hmn", name: "Hmong" },
    { code: "hu", name: "Hungarian" },
    { code: "is", name: "Icelandic" },
    { code: "ig", name: "Igbo" },
    { code: "id", name: "Indonesian" },
    { code: "ga", name: "Irish" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "jw", name: "Javanese" },
    { code: "kn", name: "Kannada" },
    { code: "kk", name: "Kazakh" },
    { code: "km", name: "Khmer" },
    { code: "rw", name: "Kinyarwanda" },
    { code: "ko", name: "Korean" },
    { code: "ku", name: "Kurdish" },
    { code: "ky", name: "Kyrgyz" },
    { code: "lo", name: "Lao" },
    { code: "la", name: "Latin" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "lb", name: "Luxembourgish" },
    { code: "mk", name: "Macedonian" },
    { code: "mg", name: "Malagasy" },
    { code: "ms", name: "Malay" },
    { code: "ml", name: "Malayalam" },
    { code: "mt", name: "Maltese" },
    { code: "mi", name: "Maori" },
    { code: "mr", name: "Marathi" },
    { code: "mn", name: "Mongolian" },
    { code: "my", name: "Myanmar (Burmese)" },
    { code: "ne", name: "Nepali" },
    { code: "no", name: "Norwegian" },
    { code: "ny", name: "Nyanja (Chichewa)" },
    { code: "or", name: "Odia (Oriya)" },
    { code: "ps", name: "Pashto" },
    { code: "fa", name: "Persian" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "pa", name: "Punjabi" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sm", name: "Samoan" },
    { code: "gd", name: "Scots Gaelic" },
    { code: "sr", name: "Serbian" },
    { code: "st", name: "Sesotho" },
    { code: "sn", name: "Shona" },
    { code: "sd", name: "Sindhi" },
    { code: "si", name: "Sinhala" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "so", name: "Somali" },
    { code: "es", name: "Spanish" },
    { code: "su", name: "Sundanese" },
    { code: "sw", name: "Swahili" },
    { code: "sv", name: "Swedish" },
    { code: "tl", name: "Tagalog (Filipino)" },
    { code: "tg", name: "Tajik" },
    { code: "ta", name: "Tamil" },
    { code: "tt", name: "Tatar" },
    { code: "te", name: "Telugu" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "tk", name: "Turkmen" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "ug", name: "Uyghur" },
    { code: "uz", name: "Uzbek" },
    { code: "vi", name: "Vietnamese" },
    { code: "cy", name: "Welsh" },
    { code: "xh", name: "Xhosa" },
    { code: "yi", name: "Yiddish" },
    { code: "yo", name: "Yoruba" },
    { code: "zu", name: "Zulu" },
  ]

  useEffect(() => {
    const handleLoginWithStoredCredentials = async () => {
      try {
        const storedCredentials = localStorage.getItem("rx_chatbot_credentials")
        const storedSubscriptionStatus = localStorage.getItem("isSubscribed")

        if (storedSubscriptionStatus) {
          setIsSubscribed(JSON.parse(storedSubscriptionStatus))
        }
        if (!storedCredentials) {
          throw new Error("No stored credentials found")
        }
        const { email, password } = JSON.parse(storedCredentials)

        {/*const storedPlanStatus = localStorage.getItem("isPremiumPlan")
        console.log(storedPlanStatus)
        if (storedPlanStatus) {
          setIsPremiumPlan(JSON.parse(storedPlanStatus))
        }*/}

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
          setUserEmail(email)
          setIsLoggedIn(true)

          const filenamesResponse = await fetch(`/api/get-filenames?email=${encodeURIComponent(email)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (filenamesResponse.ok) {
            const filenamesData = await filenamesResponse.json()
            setFilenames(filenamesData.filenames || [])
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
    const savedCredentials = localStorage.getItem("rx_chatbot_credentials")
    if (savedCredentials) {
      const { email } = JSON.parse(savedCredentials)
      setUserEmail(email)
    }
  }, [])

  useEffect(() => {
    const fetchFilenames = async () => {
      if (userEmail) {
        try {
          const response = await fetch(`/api/get-filenames?email=${encodeURIComponent(userEmail)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
          const data = await response.json()
          setFilenames(data.filenames)
        } catch (error) {
          console.error("Error fetching filenames:", error)
        }
      }
    }

    fetchFilenames()
  }, [userEmail])

  const generateFlashcards = async () => {
    if (selectedFile) {
      setLoading(true)
      try {
        const response = await fetch("/api/generate-flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userEmail, filename: selectedFile, language: selectedLanguage }),
        })
        const data = await response.json()

        if (data && data.flashcards) {
          setFlashcards(data.flashcards)
        } else {
          console.error("Failed to fetch flashcards:", data)
          setFlashcards({})
        }
      } catch (error) {
        console.error("Error generating flashcards:", error)
        setFlashcards({})
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSaveFlashcard = (flashcardContent, index) => {
    setShowPopup(true)
    setSelectedFlashcardIndex(index)
    setCardText(flashcardContent)
  }

  const handlePopupSave = async () => {
    try {
      const flashcardData = {
        text: cardText,
        title: title.trim(),
        tags: tags
          .trim()
          .split(",")
          .map((tag) => tag.trim()),
        type: "flashcard",
        email: userEmail,
      }

      console.log(flashcardData)

      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flashcardData),
      })

      if (!response.ok) {
        throw new Error("Failed to save flashcard.")
      }

      console.log("Flashcard saved successfully!")
      setShowPopup(false)
    } catch (error) {
      console.error("Error saving flashcard:", error)
    }
  }

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value)
  }

  return (
    <div className="wl-FlashCard-container-dark">
      <h1 className="wl-FlashCard-title-dark">
        Flashcard <span>Generator</span>
      </h1>
      {isLoggedIn && isSubscribed ? (
        <div className="wl-FlashCard-form-dark">
        <label className="wl-FlashCard-label-dark">Select Document</label>
        <select
          className="wl-FlashCard-select-dark"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          <option value="">Select a file</option>
          {filenames.map((filename, index) => (
            <option key={index} value={filename}>
              {filename}
            </option>
          ))}
        </select>

        <label className="wl-FlashCard-label-dark">Select Language</label>
        <select className="wl-FlashCard-select-dark" value={selectedLanguage} onChange={handleLanguageChange}>
          {languages.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        <button className="wl-FlashCard-button-dark" onClick={generateFlashcards} disabled={loading}>
          {loading ? "Generating Flashcards..." : "Generate Flashcards"}
        </button>

        {Object.keys(flashcards).length > 0 && (
          <div className="wl-FlashCard-results-dark">
            <div className="wl-FlashCard-item-container-dark">
              {Object.entries(flashcards).map(([key, flashcard], index) => (
                <div key={index} className="wl-FlashCard-item-dark">
                  <div className="wl-FlashCard-inner-dark">
                    <div className="wl-FlashCard-front-dark">
                      <p>{flashcard.Question}</p>
                    </div>
                    <div className="wl-FlashCard-back-dark">
                      <p>{flashcard.Answer}</p>
                    </div>
                  </div>
                  <button
                    className="wl-FlashCard-save-dark"
                    onClick={() => handleSaveFlashcard(JSON.stringify(flashcard), index)}
                  >
                    Save
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      ) : (
        <div>Please login and subscribe to generate Flashcards.</div>
      )}
      {showPopup && (
        <div className="wl-QuestionsGenerator-popup-dark">
          <div className="wl-QuestionsGenerator-popup-content-dark">
            <h2>Enter Title and Tags</h2>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <button onClick={handlePopupSave}>Save</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Flashcards
