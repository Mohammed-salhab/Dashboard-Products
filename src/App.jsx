import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Register from "./pages/Register"


function App() {
  return (
   <Router>
      <Routes>    
        <Route path="/register" Component={Register}></Route>
      </Routes>
    </Router>
  )
}

export default App
