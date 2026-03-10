import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import CreatePost from './pages/Editor/CreatePost';
import PostDetail from './pages/Post/PostDetail';
import Categories from './pages/Categories/Categories';
import About from './pages/About/About';

function App() {
    return (
        <Router>
            <div className="app">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/about" element={<About />} />
                        {/* Additional routes will be added here */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
