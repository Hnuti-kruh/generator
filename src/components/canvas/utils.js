import alertifyjs from "alertifyjs";
import "alertifyjs/build/css/alertify.css";

import * as fabric from "fabric";

const setCharAt = (str, index, chr) => {
  if (index > str.length - 1) return str;

  return str.substring(0, index) + chr + str.substring(index + 1);
};

const clearObjects = (clearableItems, canvas) => {
  for (const clearableItem of clearableItems) {
    if (clearableItem !== null) {
      canvas.remove(clearableItem);
    }
  }
};

const getSingleLineTextBoxWidth = (text, fontSize, fontFamily) => {
  text = text.replace(/[^\S\r\n]+/g, " ");
  text = text.replace(/\r\n/g, "\n");

  let positionWithinString = -1;

  const splitWords = text.split(" ");
  let wordIndexes = {};
  const spaceText = new fabric.Text(" ", {
    fontFamily: fontFamily,
    fontSize: fontSize,
  });

  // I stole this from another function and this breaks its line width checking system
  // so that I don't have to modify the way it works because i remember none of this
  // hacky browser font shit anymore.
  const maxWidth = 999999999999999;
  let currentWidth = 0;

  for (let wordPosition = 0; wordPosition < splitWords.length; wordPosition++) {
    let currentWord = splitWords[wordPosition];
    let skipNewLineGeneration = false;

    if (currentWord.includes("\n")) {
      skipNewLineGeneration = true;

      const breakSplitWord = currentWord.split("\n");

      const firstLineWord = breakSplitWord[0];
      const secondLineWord = breakSplitWord[1];

      // Word + \n
      positionWithinString += firstLineWord.length + 1;

      currentWord = secondLineWord;
    }

    const wordIsLast = wordPosition === splitWords.length - 1;

    positionWithinString += currentWord.length + (!wordIsLast ? 1 : 0);

    const wordText = new fabric.Text(currentWord, {
      fontFamily: fontFamily,
      fontSize: fontSize,
    });

    // This is really ugly, I have no idea why Chromium thinks the text is shorter than it really is.
    // (Or why Firefox thinks it's longer.)
    // But, it works.
    currentWidth += wordText.width * (Boolean(window.chrome) ? 1.183 : 1);

    if (!skipNewLineGeneration && currentWidth > maxWidth) {
      if (
        ["a", "i", "o", "u", "s", "se", "v", "z"].includes(
          splitWords[
            wordPosition !== 0 ? wordPosition - 1 : wordPosition
          ].replace("*", ""),
        )
      ) {
        // Previous word is not a, i, o, u, s, ...
        const lineBreakPosition =
          positionWithinString -
          (!wordIsLast ? 1 : 0) -
          currentWord.length -
          1 -
          splitWords[wordPosition !== 0 ? wordPosition - 1 : wordPosition]
            .length;

        text = setCharAt(text, lineBreakPosition, "\n");
      } else {
        text = setCharAt(
          text,
          positionWithinString - (!wordIsLast ? 1 : 0) - currentWord.length,
          "\n",
        );
      }

      currentWidth = wordText.width;
    } else if (!wordIsLast) {
      currentWidth += spaceText.width;
    }
  }

  console.log(currentWidth);

  return currentWidth;
};

const sortObjects = (canvas) => {
  canvas._objects.sort((a, b) => (a.zIndex > b.zIndex ? 1 : -1));
  canvas.renderAll();
};

const transformTextLineBreaks = (
  text,
  fontSize,
  fontFamily,
  maxWidth,
  options,
) => {
  if (options === undefined) {
    options = {};
  }

  if (!options.skipWhitespaceNormalization) {
    text = text.replace(/[^\S\r\n]+/g, " ");
    text = text.replace(/\r\n/g, "\n");
  }

  let positionWithinString = -1;
  let currentWidth = 0;

  const splitWords = text.split(" ");
  let wordIndexes = {};
  const spaceText = new fabric.Text(" ", {
    fontFamily: fontFamily,
    fontSize: fontSize,
  });

  for (let wordPosition = 0; wordPosition < splitWords.length; wordPosition++) {
    let currentWord = splitWords[wordPosition];
    let skipNewLineGeneration = false;

    if (currentWord.includes("\n")) {
      skipNewLineGeneration = true;

      const breakSplitWord = currentWord.split("\n");

      const firstLineWord = breakSplitWord[0];
      const secondLineWord = breakSplitWord[1];

      // Word + \n
      positionWithinString += firstLineWord.length + 1;

      currentWord = secondLineWord;
      currentWidth = 0;
    }

    const wordIsLast = wordPosition === splitWords.length - 1;

    positionWithinString += currentWord.length + (!wordIsLast ? 1 : 0);

    const wordText = new fabric.Text(currentWord, {
      fontFamily: fontFamily,
      fontSize: fontSize,
    });

    // This is really ugly, I have no idea why Chromium thinks the text is shorter than it really is.
    // (Or why Firefox thinks it's longer.)
    // But, it works.
    currentWidth += wordText.width * (!!window.chrome ? 1.183 : 1);

    if (!skipNewLineGeneration && currentWidth > maxWidth) {
      if (
        ["a", "i", "o", "u", "s", "se", "v", "z"].includes(
          splitWords[
            wordPosition !== 0 ? wordPosition - 1 : wordPosition
          ].replace("*", ""),
        )
      ) {
        // Previous word is not a, i, o, u, s, ...
        const lineBreakPosition =
          positionWithinString -
          (!wordIsLast ? 1 : 0) -
          currentWord.length -
          1 -
          splitWords[wordPosition !== 0 ? wordPosition - 1 : wordPosition]
            .length;

        text = setCharAt(text, lineBreakPosition, "\n");
      } else {
        text = setCharAt(
          text,
          positionWithinString - (!wordIsLast ? 1 : 0) - currentWord.length,
          "\n",
        );
      }

      currentWidth = wordText.width;
    } else if (!wordIsLast) {
      currentWidth += spaceText.width;
    }
  }

  if (options.prependLinesWithSpace) {
    let prependedText = "";
    let splitLines = text.split("\n");
    let linePosition = 0;

    for (let line of splitLines) {
      if (linePosition + 1 !== splitLines.length) {
        if (line[0] === "*") {
          line = `${line}\n`;
        } else {
          line = ` ${line}\n`;
        }
      }

      prependedText += line;
    }

    text = prependedText;
  }

  return text;
};

const transformHighlightedText = (
  text,
  fontSize,
  maxWidth,
  fontFamily,
  highlightColor,
  highlightedTextColor,
  options,
) => {
  if (options === undefined) {
    options = {};
  }

  text = transformTextLineBreaks(text, fontSize, fontFamily, maxWidth, options);

  let positionWithinString = 0;

  const textContainsDiacritics = /[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚÝŽ]+/.test(text);
  const textContainsHighlight = /\*/.test(text);

  let positionWithinLine = 0;
  let linePosition = 0;
  let previousLinePosition = 0;
  let highlightIsActive = false;

  let styles = {
    0: {},
  };

  let rects = [];
  let line = "";
  let highlightedText = "";

  for (const character of text) {
    const characterIsStar = character === "*";

    if (characterIsStar) {
      highlightIsActive = !highlightIsActive;

      if (highlightIsActive) {
        highlightedText += "‎";
        line += "‎";
      }

      text = setCharAt(text, positionWithinString, "‎");
    } else if (highlightIsActive) {
      highlightedText += character;

      if (character == "\n") {
        line = "";
      } else {
        line += character;
      }
    }

    let style = {};

    if (highlightIsActive || characterIsStar) {
      if (!options.invertHighlight) {
        if (!options.skipAddingBg) {
          style.textBackgroundColor = highlightColor;
        }

        style.fill = highlightedTextColor;
      } else {
        style.fill = highlightColor;
      }
    }

    if (
      options.padWhenDiacritics &&
      textContainsHighlight &&
      textContainsDiacritics
    ) {
      style.deltaY = Math.ceil(
        fontSize *
          (options.diacriticsDeltaYOffset !== undefined
            ? options.diacriticsDeltaYOffset
            : 0.1),
      );
    }

    styles[linePosition][positionWithinLine] = style;

    positionWithinLine++;
    positionWithinString++;
    previousLinePosition = linePosition;

    if (character === "\n") {
      styles[linePosition + 1] = {};
      linePosition++;

      if (highlightIsActive) {
        text =
          text.slice(0, positionWithinString - 1) +
          " " +
          text.slice(positionWithinString - 1);
        positionWithinString++;

        text =
          text.slice(0, positionWithinString) +
          " " +
          text.slice(positionWithinString);
        positionWithinString++;

        positionWithinLine = 1;
        styles[linePosition][0] = style;
      } else {
        positionWithinLine = 0;
      }
    }
  }

  return {
    text: text,
    styles: styles,
    paddingBottom:
      options.padWhenDiacritics &&
      textContainsHighlight &&
      textContainsDiacritics
        ? Math.ceil(
            fontSize *
              (options.diacriticsDeltaYOffset !== undefined
                ? options.diacriticsDeltaYOffset
                : 0.1),
          )
        : 0,
    rects: rects,
  };
};

const checkTextBoxHeight = (textBox, maxLines) => {
  if (textBox.textLines.length > maxLines) {
    if (!window.showingMaxLinesWarning) {
      window.showingMaxLinesWarning = true;

      const errorMessage = alertifyjs.error(
        `Text je moc dlouhý a nevejde se do ${maxLines} řádků. Prosím, zkrať ho.`,
      );

      errorMessage.callback = () => {
        window.showingMaxLinesWarning = false;
      };
    }

    let textLines = [...textBox.textLines];
    textLines.splice(maxLines);
    textBox.set("text", textLines.join("\n"));
  }
};

export {
  clearObjects,
  sortObjects,
  transformHighlightedText,
  transformTextLineBreaks,
  getSingleLineTextBoxWidth,
  checkTextBoxHeight,
};
