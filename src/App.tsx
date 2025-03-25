import React, { useState, useEffect } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { FileText, Save, Mail, Plus, LogOut } from "lucide-react";
import ReactQuill from "react-quill";
import { GoogleDriveService } from "./services/googleDrive";
import { LetterList } from "./components/LetterList";
import { GoogleUser, Letter } from "./types/google";
import "react-quill/dist/quill.snow.css";

function App() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setUser({
        email: "",
        name: "",
        picture: "",
        access_token: tokenResponse.access_token,
      });
    },
    onError: () => {
      console.log("Login Failed");
    },
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    if (user?.access_token) {
      loadLetters();
    }
  }, [user]);

  const loadLetters = async () => {
    if (!user?.access_token) return;

    try {
      setIsLoading(true);
      const driveService = GoogleDriveService.getInstance(user.access_token);
      const fetchedLetters = await driveService.getLetters();
      setLetters(
        fetchedLetters.map((letter: any) => ({
          id: letter.id,
          title: letter.name,
          content: "",
          lastModified: new Date(letter.modifiedTime),
        }))
      );
    } catch (error) {
      console.error("Error loading letters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.access_token || !title) return;

    try {
      setIsLoading(true);
      const driveService = GoogleDriveService.getInstance(user.access_token);
      await driveService.saveLetter(title, content);
      await loadLetters();
      alert("Letter saved successfully!");
    } catch (error) {
      console.error("Error saving letter:", error);
      alert("Failed to save letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLetterSelect = async (letter: Letter) => {
    if (!user?.access_token) return;

    try {
      setIsLoading(true);
      const driveService = GoogleDriveService.getInstance(user.access_token);
      const content = await driveService.getLetter(letter.id);
      setCurrentLetter(letter);
      setTitle(letter.title);
      setContent(content);
    } catch (error) {
      console.error("Error loading letter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewLetter = () => {
    setCurrentLetter(null);
    setTitle("");
    setContent("");
  };

  // 🌟 Modern HomePage UI 🌟
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        {/* Navbar */}
        <nav className="w-full max-w-7xl px-6 py-4 flex justify-between items-center">
         
          
        </nav>

        {/* Hero Section */}
        <div className="text-center px-6">
          <h1 className="text-5xl font-bold text-gray-900">
            Create Beautiful Letters with <span className="text-blue-600">Letterbox</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            A minimal, elegant letter editor that saves directly to your Google Drive.
            Write with confidence, style, and simplicity.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => login()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Sign in with Google
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <FileText className="w-12 h-12 text-blue-600 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold">Elegant Editor</h3>
            <p className="text-gray-600 mt-2">
              A distraction-free writing experience with just the right formatting options.
            </p>
          </div>

          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <Save className="w-12 h-12 text-blue-600 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold">Google Drive Integration</h3>
            <p className="text-gray-600 mt-2">
              Save your letters directly to Google Drive with a single click.
            </p>
          </div>

          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <Plus className="w-12 h-12 text-blue-600 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold">Auto-save Drafts</h3>
            <p className="text-gray-600 mt-2">
              Never lose your work with automatic saving and version history.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <FileText className="w-7 h-7 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Letterbox</h1>
          </div>
  
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNewLetter} 
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-sm hover:bg-gray-300 transition"
            >
              New Letter
            </button>
            <button 
              onClick={handleSave} 
              disabled={isLoading || !title} 
              className={`px-4 py-2 rounded-md shadow-sm font-semibold transition ${
                isLoading || !title
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Save to Drive
            </button>
            <button 
              onClick={logout} 
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
  
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-4 gap-6">
        {/* Sidebar - Letter List */}
        <aside className="bg-white rounded-lg shadow-md p-4 col-span-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Letters</h2>
          <LetterList letters={letters} onLetterSelect={handleLetterSelect} />
        </aside>
  
        {/* Editor */}
        <section className="col-span-3 bg-white rounded-lg shadow-md p-6">
          {/* Letter Title Input */}
          <input
            type="text"
            placeholder="Enter your letter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
  
          {/* Text Editor */}
          <div className="mt-4">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-[500px] border border-gray-300 rounded-md"
            />
          </div>
  
          {/* Bottom Save Button */}
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSave} 
              disabled={isLoading || !title} 
              className={`px-5 py-3 rounded-lg text-lg font-semibold transition ${
                isLoading || !title
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Save Letter
            </button>
          </div>
        </section>
      </main>
    </div>
  );
  

}

export default App;
