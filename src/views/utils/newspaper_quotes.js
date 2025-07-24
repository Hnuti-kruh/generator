import sourceImageCT from "../../assets/news_sources/ct.png";
import sourceImageDenikN from "../../assets/news_sources/denik_n.png";
import sourceImageSeznam from "../../assets/news_sources/seznam_zpravy.png";
import sourceImageCNN from "../../assets/news_sources/cnn.png";
import sourceImageCzechRadio from "../../assets/news_sources/rozhlas.png";

const SOURCE_IMAGES = [
  {
    name: "Česká televize",
    src: sourceImageCT,
    defaultSelected: false,
  },
  {
    name: "Deník N",
    src: sourceImageDenikN,
    defaultSelected: false,
  },
  {
    name: "Seznam Zprávy",
    src: sourceImageSeznam,
    defaultSelected: false,
  },
  {
    name: "CNN",
    src: sourceImageCNN,
    defaultSelected: false,
  },
  {
    name: "Český Rozhlas",
    src: sourceImageCzechRadio,
    defaultSelected: false,
  },
];

export { SOURCE_IMAGES };
