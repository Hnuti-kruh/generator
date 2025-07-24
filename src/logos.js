import defaultLogoLight from "./assets/logos/default-light.png";
import defaultLogoDark from "./assets/logos/default-dark.png";

import defaultBadgeLight from "./assets/badges/default-light.png";
import defaultBadgeDark from "./assets/badges/default-dark.png";

const LOGOS = {
  defaultLight: {
    name: "Základní - světlé",
    src: defaultLogoLight,
  },
  defaultDark: {
    name: "Základní - tmavé",
    src: defaultLogoDark,
  },
};

const BADGES = {
  defaultLight: {
    name: "Základní - světlé",
    src: defaultBadgeLight,
  },
  defaultDark: {
    name: "Základní - tmavé",
    src: defaultBadgeDark,
  },
};

const LOGO_POSITIONS = {
  top_left: {
    id: "top-left",
    name: "Vlevo nahoře",
  },
  top_right: {
    id: "top-right",
    name: "Vpravo nahoře",
  },
  bottom_left: {
    id: "bottom-left",
    name: "Vlevo dole",
  },
  bottom_right: {
    id: "bottom-right",
    name: "Vpravo dole",
  },
};

const generateLogoPositions = (identifiers) => {
  let logoPositionsList = [];

  for (const [key, value] of Object.entries(LOGO_POSITIONS)) {
    if (!identifiers.includes(key)) {
      continue;
    }

    logoPositionsList.push(value);
  }

  return logoPositionsList;
};

const generateDefaultBadges = (identifier) => {
  let badgesCopy = BADGES;

  for (const [badgeIdentifier, badge] of Object.entries(badgesCopy)) {
    badge.defaultSelected = badgeIdentifier === identifier;
  }

  return Object.values(badgesCopy);
};

const generateDefaultLogos = (identifier) => {
  let logosCopy = LOGOS;

  for (const [logoIdentifier, logo] of Object.entries(logosCopy)) {
    logo.defaultSelected = logoIdentifier === identifier;
  }

  return Object.values(logosCopy);
};

export {
  LOGOS,
  generateDefaultLogos,
  generateDefaultBadges,
  LOGO_POSITIONS,
  generateLogoPositions,
};
