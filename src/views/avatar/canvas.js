import { sortObjects } from "../../components/canvas/utils";
import * as fabric from "fabric";

let mainImage = null;
let overlayImage = null;
let mainImageSource = null;
let pointerDownEventAssigned = false;

const removeDownEventListener = () => {
  document
    .getElementsByClassName("upper-canvas")[0]
    .removeEventListener("pointerdown", canvasPointerDownEvent);
};

let upEventFunction = null;
let canvasPointerDownEvent = null;

const redraw = async (canvas, options) => {
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

  /* BEGIN Main image render */

  if (
    options.mainImage !== null &&
    (!canvas.contains(mainImage) ||
      mainImage === null ||
      options.mainImage.src !== mainImageSource)
  ) {
    if (mainImage !== null) {
      canvas.remove(mainImage);
    }

    mainImage = new fabric.Image(options.mainImage, {
      left: 0,
      top: 0,
      zIndex: 0,
    });

    mainImage.setControlsVisibility({
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

    if (mainImage.width >= mainImage.height) {
      mainImage.scaleToHeight(canvas.height);
    } else {
      mainImage.scaleToWidth(canvas.width);
    }

    canvas.add(mainImage);
    mainImageSource = options.mainImage.src;

    removeDownEventListener();
    pointerDownEventAssigned = false;
  } else if (mainImage !== null && options.mainImage === null) {
    canvas.remove(mainImage);

    removeDownEventListener();
    pointerDownEventAssigned = false;
  }

  /* END Main image render */

  /* BEGIN Overlay render */

  if (
    options.overlayImage !== null &&
    (overlayImage === null ||
      options.overlayImage.src !== overlayImage._element.src)
  ) {
    if (overlayImage !== null) {
      canvas.remove(overlayImage);
    }

    overlayImage = new Image();

    overlayImage = new fabric.Image(options.overlayImage, {
      selectable: false,
      zIndex: 5,
    });
    overlayImage.scaleToWidth(canvas.width);

    canvas.add(overlayImage);
  }

  /* END Overlay render */

  sortObjects(canvas);

  canvasPointerDownEvent = (event) => {
    let activeObject = canvas.getActiveObject();

    if (activeObject === null) {
      return;
    }

    // if (activeObject._element.src == mainImage._element.src) {
    // return
    // }

    canvas.remove(overlayImage);
    overlayImage = null;
  };

  if (!pointerDownEventAssigned) {
    document
      .getElementsByClassName("upper-canvas")[0]
      .addEventListener("pointerdown", canvasPointerDownEvent);

    pointerDownEventAssigned = true;
  }

  /*const clipCircle = new fabric.Circle({
    left: canvas.width / 2,
    top: canvas.height / 2,
    originX: "center",
    originY: "center",
    radius: canvas.width / 2,
    absolutePositioned: true, // clip relative to canvas
  });

  // assign it to the canvas
  canvas.clipPath = clipCircle;*/
  canvas.renderAll();

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
