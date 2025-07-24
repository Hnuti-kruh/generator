import * as fabric from "fabric";

class PaddedHighlightingTextbox extends fabric.Textbox {
  _renderTextLinesBackground(ctx) {
    if (!this.textBackgroundColor && !this.styleHas("textBackgroundColor")) {
      return;
    }

    var heightOfLine,
      lineLeftOffset,
      originalFill = ctx.fillStyle,
      line,
      lastColor,
      leftOffset = this._getLeftOffset(),
      lineTopOffset = this._getTopOffset(),
      boxStart = 0,
      boxWidth = 0,
      charBox,
      currentColor,
      path = this.path,
      drawStart;

    const highlightPadding =
      this.highlightPadding !== undefined ? this.highlightPadding : 1;

    for (var i = 0, len = this._textLines.length; i < len; i++) {
      heightOfLine = this.getHeightOfLine(i);

      if (
        !this.textBackgroundColor &&
        !this.styleHas("textBackgroundColor", i)
      ) {
        lineTopOffset += heightOfLine;
        continue;
      }

      line = this._textLines[i];
      lineLeftOffset = this._getLineLeftOffset(i);
      boxWidth = 0;
      boxStart = 0;
      lastColor = this.getValueOfPropertyAt(i, 0, "textBackgroundColor");

      for (var j = 0, jlen = line.length; j < jlen; j++) {
        charBox = this.__charBounds[i][j];
        currentColor = this.getValueOfPropertyAt(i, j, "textBackgroundColor");

        if (path) {
          ctx.save();
          ctx.translate(charBox.renderLeft, charBox.renderTop);
          ctx.rotate(charBox.angle);
          ctx.fillStyle = currentColor;
          currentColor &&
            ctx.fillRect(
              -charBox.width / 2,
              (-heightOfLine / this.lineHeight) * (1 - this._fontSizeFraction) -
                highlightPadding * 2,
              charBox.width,
              heightOfLine / this.lineHeight + highlightPadding,
            );
          ctx.restore();
        } else if (currentColor !== lastColor) {
          drawStart = leftOffset + lineLeftOffset + boxStart;

          if (this.direction === "rtl") {
            drawStart = this.width - drawStart - boxWidth;
          }

          ctx.fillStyle = lastColor;
          lastColor &&
            ctx.fillRect(
              drawStart,
              lineTopOffset - highlightPadding,
              boxWidth,
              heightOfLine / this.lineHeight + highlightPadding * 2,
            );
          boxStart = charBox.left;
          boxWidth = charBox.width;
          lastColor = currentColor;
        } else {
          boxWidth += charBox.kernedWidth;
        }
      }

      if (currentColor && !path) {
        drawStart = leftOffset + lineLeftOffset + boxStart;

        if (this.direction === "rtl") {
          drawStart = this.width - drawStart - boxWidth;
        }

        ctx.fillStyle = currentColor;
        ctx.fillRect(
          drawStart,
          lineTopOffset - highlightPadding,
          boxWidth,
          heightOfLine / this.lineHeight + highlightPadding * 2,
        );
      }

      lineTopOffset += heightOfLine;
    }

    ctx.fillStyle = originalFill;
    // if there is text background color no
    // other shadows should be casted
    this._removeShadow(ctx);
  }
}

export { PaddedHighlightingTextbox };
