import { useState } from 'react'
import './App.css'
import './toast.css'
import Navbar from './components/Navbar/Navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Footer from './components/Footer/Footer.jsx'
import LoginPopUp from './components/LoginPopUp/LoginPopUp.jsx'
import ViewListing from './pages/ViewListing/ViewListing.jsx'
import AddNewListing from './pages/AddNewListing/AddNewListing.jsx'
import UpdateListing from './pages/updateListing/updateListing.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Payment from './pages/Payment/Payment.jsx'
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess.jsx'
import PaymentCancel from './pages/PaymentCancel/PaymentCancel.jsx'
import MyListings from './pages/MyListings/MyListings.jsx'

function App() {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <>

    { showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
    <ToastContainer
      className="app-toast"
      position="top-right"
      autoClose={2000}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      pauseOnHover
      draggable={false}
      limit={3}
      theme="colored"
    />

    <div className="App">
      <Navbar setShowLogin={setShowLogin} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view/:id" element={<ViewListing setShowLogin={setShowLogin} />} />
        <Route path="/add-listing" element={<AddNewListing />} />
        <Route path="/update/:id" element={<UpdateListing />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/my-listings" element={<MyListings />} />
      </Routes>

      <Footer />

    </div>
    </>
  )
}

export default App
