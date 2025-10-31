"use client"

import { useState, useEffect } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { BsZoomIn, BsZoomOut } from "react-icons/bs"
import "./MindMaps.css"

const MindMapGenerator = ({ onMindMapGenerated }) => {
  const [userEmail, setUserEmail] = useState("")
  const [filenames, setFilenames] = useState([])
  const [selectedFile, setSelectedFile] = useState("")
  const [mindMapImages, setMindMapImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [zoomLevels, setZoomLevels] = useState({})
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

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

  const generateMindMap = async () => {
    if (selectedFile) {
      setLoading(true)
      try {
        const response = await fetch("/api/generate-mind-map", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userEmail, filename: selectedFile, language: selectedLanguage }),
        })
        const data = await response.json()
        const bytes_dict = data.mind_map_image_bytes
        console.log("Mind Map Data:", data)

        if (bytes_dict && typeof bytes_dict === "object") {
          const imageUrls = Object.entries(bytes_dict).map(([title, imageBytes]) => ({
            title,
            url: `data:image/png;base64,${imageBytes}`,
          }))

          setMindMapImages(imageUrls)
          setZoomLevels(
            imageUrls.reduce((acc, { title }) => {
              acc[title] = 1
              return acc
            }, {}),
          )

          onMindMapGenerated(imageUrls)
        } else {
          console.error("Failed to fetch mind map:", data)
          setMindMapImages([])
        }
      } catch (error) {
        console.error("Error generating mind map:", error)
        setMindMapImages([])
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSaveMindMap = (imageUrl, title) => {
    if (imageUrl) {
      const link = document.createElement("a")
      link.href = imageUrl
      link.setAttribute("download", `${title}.png`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      console.error("Mind map image is empty.")
    }
  }

  const handleZoomIn = (title) => {
    setZoomLevels((prevZoomLevels) => ({
      ...prevZoomLevels,
      [title]: (prevZoomLevels[title] || 1) + 0.1,
    }))
  }

  const handleZoomOut = (title) => {
    setZoomLevels((prevZoomLevels) => ({
      ...prevZoomLevels,
      [title]: Math.max(0.1, (prevZoomLevels[title] || 1) - 0.1),
    }))
  }

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value)
  }

  return (
    <div className="wl-MindMapGenerator-container-dark">
      <h1 className="wl-MindMapGenerator-title-dark">
        Mind Map <span>Generator</span>
      </h1>
      {isLoggedIn && isSubscribed ? (
      <div className="wl-MindMapGenerator-form-dark">
        <label style={{ color: "#e0e0e0" }}>Select Document</label>
        <select
          id="filename"
          name="filename"
          className="wl-MindMapGenerator-select-dark"
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
        <label style={{ color: "#e0e0e0" }}>Select Language</label>
        <select
          id="language"
          name="language"
          className="wl-MindMapGenerator-select-dark"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          {languages.map((language) => (
            <option key={language.code} value={language.name}>
              {language.name}
            </option>
          ))}
        </select>
        <button className="wl-MindMapGenerator-button-dark" onClick={generateMindMap} disabled={loading}>
          {loading ? "Generating Mind Map..." : "Generate Mind Map"}
        </button>
      </div>
      ) : (
        <div >Please login and subscribe to generate Mind Maps.</div>
      )}
      {mindMapImages.length > 0 && (
        <div className="wl-MindMapGenerator-images-container-dark">
          {mindMapImages.map(({ title, url }) => (
            <div key={title} className="wl-MindMapGenerator-image-wrapper-dark">
              <div className="wl-MindMapGenerator-zoom-controls-dark">
                <button onClick={() => handleZoomIn(title)}>
                  <BsZoomIn />
                </button>
                <button onClick={() => handleZoomOut(title)}>
                  <BsZoomOut />
                </button>
                <button onClick={() => handleSaveMindMap(url, title)}>Download</button>
              </div>
              <TransformWrapper>
                <TransformComponent>
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Generated Mind Map ${title}`}
                    className="wl-MindMapGenerator-image-dark"
                    style={{ transform: `scale(${zoomLevels[title] || 1})` }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

MindMapGenerator.defaultProps = {
  onMindMapGenerated: () => {},
}

export default MindMapGenerator
