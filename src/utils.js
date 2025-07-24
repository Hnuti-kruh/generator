import { toRaw } from "vue";

const loadFonts = async (fonts) => {
  for (const font of fonts) {
    await document.fonts.load(
      `${font}`,
      "Příliš žluťoučký kůň úpěl ďábelské ó.",
    );
  }
};

const clearNullsFromArray = (originalArray) => {
  for (const originalArrayItem of originalArray) {
    if (originalArrayItem !== null) {
      continue;
    }

    originalArray = originalArray.filter((nestedArrayItem) => {
      nestedArrayItem !== originalArrayItem;
    });
  }

  return originalArray;
};

const updateAutoRedrawStorage = (autoRedraw) => {
  window.sessionStorage.setItem("auto_redraw", JSON.stringify(autoRedraw));
};

const loadCanvasStorage = async (data) => {
  const canvasProperties = JSON.parse(
    window.sessionStorage.getItem("canvas_properties"),
  );
  const autoRedraw = JSON.parse(window.sessionStorage.getItem("auto_redraw"));

  if (canvasProperties) {
    for (const [key, value] of Object.entries(canvasProperties)) {
      if (!(key in data)) {
        continue;
      }

      if (key.toLowerCase().endsWith("image") && value) {
        const image = new Image();

        await new Promise((resolve) => {
          image.onload = () => {
            resolve();
          };

          image.src = value;
        });

        data[key] = image;

        continue;
      }

      data[key] = value;
    }
  }

  if (autoRedraw) {
    data.autoRedraw = autoRedraw;
  }
};

const setCanvasStorage = (data) => {
  let processedData = {};

  for (const [key, value] of Object.entries(data)) {
    if (key.toLowerCase().endsWith("image") && value) {
      processedData[key] = value.src;

      continue;
    }

    processedData[key] = value;
  }

  window.sessionStorage.setItem(
    "canvas_properties",
    JSON.stringify(processedData),
  );
};

const toRawDeep = (observed) => {
  const val = toRaw(observed);

  if (Array.isArray(val)) {
    return val.map(toRawDeep);
  }

  if (val === null) return null;

  if (typeof val === "object") {
    const entries = Object.entries(val).map(([key, val]) => [
      key,
      toRawDeep(val),
    ]);

    return Object.fromEntries(entries);
  }

  return val;
};

export {
  toRawDeep,
  loadFonts,
  clearNullsFromArray,
  loadCanvasStorage,
  setCanvasStorage,
  updateAutoRedrawStorage,
};
