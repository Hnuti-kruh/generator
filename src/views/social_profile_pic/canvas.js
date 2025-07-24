import * as fabric from "fabric";
import {
  clearObjects,
  sortObjects,
  transformHighlightedText,
  checkTextBoxHeight,
} from "../../components/canvas/utils";
import COLORS from "../../colors";
import { PaddedHighlightingTextbox } from "../../components/canvas/textbox";

//import bgImageSourceBlack from "../../assets/template/base_person_event/bg_black.png";
//import bgImageSourceWhite from "../../assets/template/base_person_event/bg_white.png";

let mainImage = null;
let personImage = null;
let contractedByTextbox = null;
let previousColor = null;
let mainTextBox = null;

let personImageSource = null;

const removeDownEventListener = () => {
  document
    .getElementsByClassName("upper-canvas")[0]
    .removeEventListener("pointerdown", canvasPointerDownEvent);
};

let upEventFunction = null;
let canvasPointerDownEvent = null;
let pointerDownEventAssigned = false;

const redraw = async (canvas, options) => {
  clearObjects([contractedByTextbox, mainTextBox], canvas);

  const contractedByTextSize = Math.ceil(canvas.height * 0.035);
  const contractedByTextMaxWidth = Math.ceil(canvas.width * 0.9);
  const contractedByTextBottomMargin = Math.ceil(canvas.width * 0.02);
  const contractedByTextSideMargin = Math.ceil(canvas.width * 0.03);

  const textMarginLeft = Math.ceil(canvas.width * 0.4);
  const textMarginRight = Math.ceil(canvas.width * 0.23);

  let mainTextMarginBottom = Math.ceil(canvas.height * 0.36);
  const mainTextBackgroundMarginTop = Math.ceil(canvas.height * 0.14);
  const mainTextSize = Math.ceil(canvas.height * 0.13);
  const mainTextHeightLimit = Math.ceil(mainTextSize * 2.2);
  const mainTextLineHeight = 0.85;

  document
    .getElementsByClassName("upper-canvas")[0]
    .removeEventListener("pointerup", upEventFunction);
  document
    .getElementsByClassName("upper-canvas")[0]
    .removeEventListener("pointerout", upEventFunction);
  document
    .getElementsByClassName("upper-canvas")[0]
    .removeEventListener("pointercancel", upEventFunction);

  canvas.preserveObjectStacking = true;

  /* BEGIN Person image render */

  if (
    options.personImage !== null &&
    (!canvas.contains(personImage) ||
      personImage === null ||
      options.personImage.src !== personImageSource)
  ) {
    if (personImage !== null) {
      canvas.remove(personImage);
    }

    personImage = new fabric.Image(options.personImage, {
      left: 0,
      top: 0,
      zIndex: 0,
    });

    personImage.setControlsVisibility({
      // corners (uniform scale)
      tl: true,
      tr: true,
      bl: true,
      br: true,
      // mids (scale X/Y independently)
      ml: true,
      mr: true,
      mt: true,
      mb: true,
      // rotation
      mtr: false,
    });

    if (personImage.width >= personImage.height) {
      personImage.scaleToHeight(canvas.height);
    } else {
      personImage.scaleToWidth(canvas.width);
    }

    canvas.add(personImage);
    personImageSource = options.personImage.src;
    // canvas.centerObject(personImage)

    removeDownEventListener();
    pointerDownEventAssigned = false;
  } else if (personImage !== null && options.personImage === null) {
    canvas.remove(personImage);

    removeDownEventListener();
    pointerDownEventAssigned = false;
  }

  /* END Person image render */

  /* BEGIN Main image render */

  if (previousColor !== options.colors.background || mainImage === null) {
    if (mainImage !== null) {
      canvas.remove(mainImage);
    }

    const image = new Image();

    const imageLoadPromise = new Promise((resolve) => {
      image.onload = () => {
        resolve();
      };

      /*if (options.colors.background.value === COLORS.black.value) {
        image.src = bgImageSourceBlack;
      } else {
        image.src = bgImageSourceWhite;
      }*/
    });
    await imageLoadPromise;

    mainImage = new fabric.Image(image, {
      left: 0,
      top: 0,
      zIndex: 5,
      selectable: false,
    });

    mainImage.scaleToWidth(canvas.width);

    canvas.add(mainImage);

    previousColor = options.colors.background;
  }

  /* END Main image render */

  if (options.mainText !== null) {
    /* BEGIN Name text render */

    const mainTextWidth = canvas.width - textMarginLeft - textMarginRight;

    const highlightedData = transformHighlightedText(
      options.mainText,
      mainTextSize,
      mainTextWidth,
      "Bebas Neue",
      options.colors.highlight.value,
      options.colors.highlightedText.value,
      { padWhenDiacritics: true },
    );

    mainTextBox = new PaddedHighlightingTextbox(highlightedData.text, {
      width: canvas.width,
      left: textMarginLeft,
      textAlign: "left",
      fontFamily: "Bebas Neue",
      fontSize: mainTextSize,
      lineHeight: mainTextLineHeight,
      fill: options.colors.mainText.value,
      styles: highlightedData.styles,
      selectable: false,
      highlightPadding: canvas.height * 0.003,
      zIndex: 10,
    });

    checkTextBoxHeight(mainTextBox, 2);

    canvas.add(mainTextBox);

    let mainTextBoxTop =
      canvas.height - mainTextBox.height - mainTextMarginBottom;

    if (mainTextBox.textLines.length === 1) {
      mainTextBoxTop -= mainTextSize / 2;
    }

    mainTextBox.top = mainTextBoxTop - highlightedData.paddingBottom;

    canvas.renderAll();

    /* END Main text render */
  }

  /* BEGIN Contracted by render */

  if (options.contractedBy !== null) {
    contractedByTextbox = new fabric.Textbox(options.contractedBy, {
      left:
        canvas.width - contractedByTextMaxWidth - contractedByTextSideMargin,
      top: canvas.height - contractedByTextBottomMargin - contractedByTextSize,
      width: contractedByTextMaxWidth,
      fontFamily: "Roboto Condensed",
      fontSize: contractedByTextSize,
      textAlign: "right",
      fill: options.colors.contractedByText.value,
      selectable: false,
      zIndex: 10,
    });

    checkTextBoxHeight(contractedByTextbox, 1);

    canvas.add(contractedByTextbox);
  }

  /* END Contracted by render */

  sortObjects(canvas);

  canvasPointerDownEvent = (event) => {
    let activeObject = canvas.getActiveObject();

    if (activeObject === null) {
      return;
    }

    // if (activeObject._element.src == mainImage._element.src) {
    // return
    // }

    canvas.remove(mainImage);
    canvas.remove(mainTextBox);
    mainImage = null;
    mainTextBox = null;
  };

  if (!pointerDownEventAssigned) {
    document
      .getElementsByClassName("upper-canvas")[0]
      .addEventListener("pointerdown", canvasPointerDownEvent);

    pointerDownEventAssigned = true;
  }

  upEventFunction = (event) => {
    redraw(canvas, options);
  };

  document
    .getElementsByClassName("upper-canvas")[0]
    .addEventListener("pointerup", upEventFunction);

  document
    .getElementsByClassName("upper-canvas")[0]
    .addEventListener("pointerout", upEventFunction);

  document
    .getElementsByClassName("upper-canvas")[0]
    .addEventListener("pointercancel", upEventFunction);
};

export default redraw;
