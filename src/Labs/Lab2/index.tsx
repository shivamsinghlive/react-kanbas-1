import "./index.css";
import ForegroundColors from "./ForegroundColors";
import BackgroundColors from "./BackgroundColors";
import Borders from "./Borders";
import Padding from "./Padding";
import Margins from "./Margins";
import Corners from "./Corners";
import Positions from "./Positions";
import Zindex from "./Zindex";
import Float from "./Float";
import GridLayout from "./GridLayout";
import Flex from "./Flex";
import ReactIconsSampler from "./ReactIcons";
import BootstrapGrids from "./BootstrapGrids";
import ScreenSizeLabel from "./ScreenSizeLabel";
import BootstrapTables from "./BootstrapTables";
import BootstrapLists from "./BootstrapLists";
import BootstrapForms from "./BootstrapForms";
import BootstrapNavigation from "./BootstrapNavigation";
import AbsolutePosition from "./AbsolutePositions";
export default function Lab2() {
    return (
      <div id="wd-lab2" className="container">
        <h2>Lab 2 - Cascading Style Sheets</h2>
        <h3>Styling with the STYLE attribute</h3>
        <div id="wd-css-id-selectors">
        <h3>ID selectors</h3>
        <p id="wd-id-selector-1">
            Instead of changing the look and feel of all the 
            elements of the same name, e.g., P, we can refer to a specific element by its ID
        </p>
        <p id="wd-id-selector-2">
            Here's another paragraph using a different ID and a different look and
            feel
        </p>
        </div>

        <div id="wd-css-class-selectors">
        <h3>Class selectors</h3>
        <p className="wd-class-selector">
            Instead of using IDs to refer to elements, you can use an element's CLASS attribute
        </p>
        <h4 className="wd-class-selector">
            This heading has same style as paragraph above
        </h4>
        </div>

        <div id="wd-css-document-structure">
        <div className="wd-selector-1">
            <h3>Document structure selectors</h3>
            <div className="wd-selector-2">
            Selectors can be combined to refer elements in particular
            places in the document
            <p className="wd-selector-3">
                This paragraph's red background is referenced as
                <br />
                .selector-2 .selector3<br />
                meaning the descendant of some ancestor.<br />
                <span className="wd-selector-4">
                Whereas this span is a direct child of its parent
                </span><br />
                You can combine these relationships to create specific 
                styles depending on the document structure
            </p>
            </div>
        </div>
        </div>

        <ForegroundColors/>
        {/* <div id="wd-css-colors">
            <ForegroundColors />
        </div> */}

        <div id="wd-css-background-colors">
            <BackgroundColors />
        </div>

        <div id="wd-css-borders">
            <Borders />
        </div>

        <div id="wd-css-paddings">
            <Padding/>
        </div>

        <div id="wd-css-margins">
            <Margins/>
        </div>

        <div id="wd-css-borders">
            <Corners/>
        </div>

        <div id="wd-css-positions">
            <Positions/>
        </div>

        <AbsolutePosition/>


        <div id="wd-z-index">
            <Zindex/>
        </div>

        <div id="wd-float-divs">
            <Float/>
        </div>

        <div id="wd-css-grid-layout">
            <GridLayout/>
        </div>

        <div id="wd-css-flex">
            <Flex/>
        </div>

        <div id="wd-react-icon-sampler">
            <ReactIconsSampler/>
        </div>

        <div id="wd-bootstrap-grids">
            <BootstrapGrids/>
        </div>

        <div id="wd-screen-size-label">
            <ScreenSizeLabel/>
        </div>

        <div id="wd-bootstrap-tables">
            <BootstrapTables/>
        </div>

        <div id="wd-bootstrap-lists">
            <BootstrapLists/>
        </div>

        <div id="wd-bootstrap-forms">
            <BootstrapForms/>
        </div>

        <div id="wd-bootstrap-navigation">
            <BootstrapNavigation/>
        </div>
      </div>
    );
  }
  