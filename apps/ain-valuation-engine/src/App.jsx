import React, { useState, useEffect } from 'react';
import { LuFileSignature, LuGitBranch, LuCheckCircle, LuXCircle, LuArchive } from 'react-icons/lu';

// Import the necessary Firebase functions for React
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

// IMPORTANT: Global variables are provided by the environment. Do not modify these.
// We check for their existence and provide defaults for local development.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Helper function to get status icon
const getStatusIcon = (status) => {
  switch (status) {
    case 'production':
      return <LuCheckCircle className="text-green-500" />;
    case 'staging':
      return <LuGitBranch className="text-yellow-500" />;
    case 'archived':
      return <LuArchive className="text-gray-500" />;
    default:
      return <LuXCircle className="text-red-500" />;
  }
};

// Custom Modal Component to replace alerts
const Modal = ({ show, title, message, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-8 border w-96 shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600">{message}</p>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const App = () => {
  const [models, setModels] = useState([]);
  const [newModel, setNewModel] = useState({ name: '', versionName: '', author: '' });
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  // Function to show the custom modal
  const showCustomModal = (title, message) => {
    setModalContent({ title, message });
    setShowModal(true);
  };

  // useEffect hook to initialize Firebase and set up listeners
  useEffect(() => {
    // Check if firebaseConfig is available before initializing
    if (Object.keys(firebaseConfig).length === 0) {
      console.error('Firebase configuration is missing. The app will not be persistent.');
      setLoading(false);
      return;
    }

    // Initialize Firebase app and services
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const authInstance = getAuth(app);

    setDb(firestore);

    // Set up a real-time authentication state listener
    const unsubscribeAuth = onAuthStateChanged(authInstance, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // If no user is authenticated, sign in with the provided token or anonymously
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(authInstance, initialAuthToken);
          } else {
            await signInAnonymously(authInstance);
          }
        } catch (error) {
          console.error('Firebase authentication failed:', error);
          setLoading(false);
        }
      }
    });

    // Clean up the auth listener when the component unmounts
    return () => unsubscribeAuth();
  }, []);

  // useEffect hook to set up the Firestore listener after authentication
  useEffect(() => {
    // Only proceed if db and userId are available
    if (!db || !userId) {
      return;
    }

    setLoading(true);

    // Firestore collection path for public data
    const modelsCollectionPath = `/artifacts/${appId}/public/data/models`;
    const modelsCollection = collection(db, modelsCollectionPath);

    // Set up a real-time listener to the models collection
    // orderBy() is commented out to prevent runtime errors with missing indexes.
    // We will sort the data in the front-end instead.
    // const q = query(modelsCollection, orderBy('timestamp', 'desc'));
    const unsubscribeSnapshot = onSnapshot(modelsCollection, (querySnapshot) => {
      const fetchedModels = [];
      querySnapshot.forEach((doc) => {
        const modelData = doc.data();
        const modelIndex = fetchedModels.findIndex(m => m.name === modelData.name);
        
        if (modelIndex > -1) {
          // If the model already exists in our array, add the new version
          fetchedModels[modelIndex].versions.push({ ...modelData, id: doc.id });
        } else {
          // If this is a new model, create a new entry with its first version
          fetchedModels.push({
            id: doc.id,
            name: modelData.name,
            versions: [{ ...modelData, id: doc.id }],
          });
        }
      });

      // Sort models by timestamp on the client side
      fetchedModels.forEach(model => {
        model.versions.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
      });
      
      setModels(fetchedModels);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching models:', error);
      setLoading(false);
    });

    // Clean up the snapshot listener when the component unmounts
    return () => unsubscribeSnapshot();
  }, [db, userId, appId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModel((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new model registration
  const handleRegisterModel = async (e) => {
    e.preventDefault();
    if (!newModel.name || !newModel.versionName || !newModel.author || !db) {
      showCustomModal('Validation Error', 'Please fill out all fields and ensure the database is initialized.');
      return;
    }

    try {
      setLoading(true);
      const modelsCollectionPath = `/artifacts/${appId}/public/data/models`;
      await addDoc(collection(db, modelsCollectionPath), {
        name: newModel.name,
        versionId: newModel.versionName,
        status: 'staging', // New models start in staging
        metrics: { accuracy: 'N/A' },
        author: newModel.author,
        timestamp: serverTimestamp(),
      });
      setNewModel({ name: '', versionName: '', author: '' }); // Clear the form
      setLoading(false);
      showCustomModal('Success', 'Model registered successfully!');
    } catch (error) {
      console.error('Error registering new model:', error);
      showCustomModal('Registration Failed', 'Failed to register model. Check the console for details.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans antialiased text-gray-800">
      <Modal 
        show={showModal} 
        title={modalContent.title} 
        message={modalContent.message} 
        onClose={() => setShowModal(false)} 
      />
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-center text-indigo-700">ML Model Registry</h1>
          <p className="text-center text-lg text-gray-600 mt-2">Manage and version your machine learning models.</p>
        </header>

        {/* --- User ID Display --- */}
        <div className="text-center text-sm text-gray-500 mb-6 p-3 bg-white rounded-lg shadow">
          Current User ID: <span className="font-mono font-bold text-gray-700">{userId || 'Not authenticated'}</span>
        </div>

        {/* --- Model Registration Form --- */}
        <section className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Register New Model</h2>
          <form onSubmit={handleRegisterModel} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              value={newModel.name}
              onChange={handleInputChange}
              placeholder="Model Name (e.g., Sentiment Analysis)"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              required
            />
            <input
              type="text"
              name="versionName"
              value={newModel.versionName}
              onChange={handleInputChange}
              placeholder="Version Name (e.g., v1.1.0)"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              required
            />
            <input
              type="text"
              name="author"
              value={newModel.author}
              onChange={handleInputChange}
              placeholder="Author (e.g., Jane Doe)"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              required
            />
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!userId || loading}
              >
                <div className="flex items-center justify-center gap-2">
                  <LuFileSignature className="h-5 w-5" />
                  <span>{loading ? 'Registering...' : 'Register Model'}</span>
                </div>
              </button>
            </div>
          </form>
        </section>

        {/* --- Models List --- */}
        <section>
          <h2 className="text-3xl font-bold text-gray-700 mb-6">Existing Models</h2>
          {loading && (
            <div className="text-center text-lg text-indigo-500 p-8">Loading models...</div>
          )}
          {!loading && models.length === 0 && (
            <div className="text-center text-lg text-gray-400 p-8">No models registered yet.</div>
          )}
          <div className="space-y-6">
            {models.map((model) => (
              <div key={model.name} className="bg-white rounded-2xl shadow-xl p-6 transition-transform hover:scale-[1.01] duration-150">
                <h3 className="text-xl font-bold text-indigo-600 mb-2">{model.name}</h3>
                <div className="mt-4 space-y-4">
                  {model.versions.map((version) => (
                    <div key={version.id} className="border border-gray-200 rounded-xl p-4 transition-all duration-150 hover:bg-gray-50 flex items-center gap-4">
                      {getStatusIcon(version.status)}
                      <div className="flex-grow">
                        <span className="font-bold text-gray-900">{version.versionId}</span>
                        <span className={`ml-3 text-sm font-semibold capitalize px-2 py-1 rounded-full ${
                          version.status === 'production' ? 'bg-green-100 text-green-700' :
                          version.status === 'staging' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {version.status}
                        </span>
                        <div className="text-gray-500 text-sm mt-1">
                          Deployed on: {new Date(version.timestamp?.toMillis()).toLocaleDateString()} by {version.author}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {Object.entries(version.metrics).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-medium text-gray-600">{key.replace('_', ' ')}:</span>
                            <span className="ml-1 font-semibold text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
