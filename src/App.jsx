import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Register from "./pages/Register"
import Login from "./pages/Login";
import Products from "./pages/Products";
function App() {
  return (
   <Router>
      <Routes> 
          <Route path="/" Component={Login}></Route>   
            <Route path="/products" Component={Products}></Route>
        <Route path="/register" Component={Register}></Route>
      </Routes>
    </Router>
  )
}

export default App
