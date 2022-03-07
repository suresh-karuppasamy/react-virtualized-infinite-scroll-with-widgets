import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Demo from "./Demo";
import Demo1 from "./Demo1";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Demo />}>
            <Route index element={<Demo />} />
            <Route path="api" element={<Demo1 />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
