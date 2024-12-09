import Lab1 from "./Lab1";
import { Route, Routes, Navigate } from "react-router";
import TOC from "./TOC";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";
import Lab4 from "./Lab4";
import store from "./store";
import { Provider } from "react-redux";
import Lab5 from "./Lab5";
export default function Labs() {
  return (
    <Provider store={store}>
        <div id="wd-labs">
            <h1 className="text-center"> Shivam Singh</h1>
            <h2 className="text-center"> Section 3</h2>
            <h3> Source Code</h3>
                Please click here 
                <a id="wd-github-src" href="https://github.com/shivamsinghlive/kanbas-react-web-app">Source Code</a>
                to check out the GitHub Source Code for Labs and Kanbas.<br/>
            <h1>Labs</h1>
            <TOC />
            <Routes>
                <Route path="/" element={<Navigate to="Lab5" />} />
                <Route path="Lab1" element={<Lab1 />} />
                <Route path="Lab2" element={<Lab2 />} />
                <Route path="Lab3/*" element={<Lab3 />} />
                <Route path="Lab4/*" element={<Lab4 />} />
                <Route path="Lab5/*" element={<Lab5 />} />
            </Routes>
        </div>
    </Provider>
);}
