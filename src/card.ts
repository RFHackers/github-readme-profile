// Importing necessary types and modules
import type { GetData } from "./getData";
import type { UiConfig } from "../api/index";
import { locales, Locales } from "./translations";
import { icons } from "./icons";
import { parseBoolean } from "./common/utils";

/**
 * Generates the SVG code for the user's GitHub stats card based on provided data and UI configuration.
 *
 * @param {GetData} data User's GitHub stats data.
 * @param {UiConfig} uiConfig User interface configuration.
 * @returns {string} SVG code representing the GitHub stats card.
 */
export default function cardStyle(data: GetData, uiConfig: UiConfig): string {
  // Setting fallback and default locale
  const fallbackLocale = "en";
  const defaultLocale: Locales[keyof Locales] = locales[fallbackLocale];
  const selectLocale: Locales[keyof Locales] = locales[uiConfig.Locale] || defaultLocale;

  // Determining text direction and animations based on UI configuration
  const isRtlDirection = parseBoolean(selectLocale.rtlDirection);
  const isDisabledAnimations = parseBoolean(uiConfig.disabledAnimations || uiConfig.Format === "png");

  // Setting angles and positions for SVG elements
  const direction = isRtlDirection ? "rtl" : "ltr";
  const titleXAngle = isDisabledAnimations ? (isRtlDirection ? 520 : 15) : (isRtlDirection ? 510 : 5);
  const titleYAngle = isDisabledAnimations ? 0 : -10;
  const textXAngle = isRtlDirection ? 215 : 25;
  const dataXAngle = isRtlDirection ? 15 : 225;
  const iconXAngle = isRtlDirection ? 225 : 0;
  const imageXAngle = isDisabledAnimations ? 120 : 125;
  const imageYAngle = isDisabledAnimations ? 70 : 65;
  const userXAngle = isDisabledAnimations ? 119.9 : 109.9;
  const userYAngle = isDisabledAnimations ? 140 : 130;
  const follXAngle = isDisabledAnimations ? 120 : 110;
  const follYAngle = isDisabledAnimations ? 161 : 151;

  // Setting styles for hiding stroke and border based on UI configuration
  const hideStroke = parseBoolean(uiConfig.hideStroke) ? `` : `stroke="#${uiConfig.strokeColor}" stroke-width="5"`;
  const hideBorder = parseBoolean(uiConfig.hideBorder) ? `` : `stroke="#${uiConfig.borderColor}" stroke-opacity="1" stroke-width="${uiConfig.borderWidth}"`;

  // CSS animations for SVG elements
  const animations = parseBoolean(uiConfig.disabledAnimations || uiConfig.Format === "png") ? `` : `        /* Animations */
        @keyframes scaleInAnimation {
            from {
                transform: translate(-5px, 5px) scale(0);
            }
            to {
                transform: translate(-5px, 5px) scale(1);
            }
        }
        @keyframes fadeInAnimation {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        @keyframes fadeLeftInAnimation {
            from {
                opacity: 0;
                transform: translate(-90px, 10px);
            }
            to {
                opacity: 1;
                transform: translate(10px, 10px);
            }
        }

        .div-animation {
            animation: fadeLeftInAnimation 0.7s ease-in-out forwards;
        }

        .image-profile-animation {
            animation: scaleInAnimation 1.2s ease-in-out forwards;
            transform-origin: ${imageXAngle}px ${imageYAngle}px;
        }

        .single-item-animation {
            opacity: 0;
            animation: fadeInAnimation 0.3s ease-in-out forwards;
        }`;

  // Extracting and formatting hidden and shown items based on UI configuration
  const hiddenItems = uiConfig.hiddenItems || "";
  const hiddenItemsArray = hiddenItems.split(",");
  const showItems = uiConfig.showItems || "";
  const showItemsArray = showItems.split(",");

  // Array containing information about different GitHub stats to be displayed on the card
  const cardItems = [
    { text: selectLocale.totalReposText || defaultLocale.totalReposText, value: data.public_repos, icon: icons.repository, hidden: hiddenItemsArray.includes("repos") },
    { text: selectLocale.starsCountText || defaultLocale.starsCountText, value: data.total_stars, icon: icons.star, hidden: hiddenItemsArray.includes("stars") },
    { text: selectLocale.forksCountText || defaultLocale.forksCountText, value: data.total_forks, icon: icons.fork, hidden: hiddenItemsArray.includes("forks") },
    { text: selectLocale.commitsCountText || defaultLocale.commitsCountText, value: data.total_commits, icon: icons.commit, hidden: hiddenItemsArray.includes("commits") },
    { text: selectLocale.totalPRText || defaultLocale.totalPRText, value: data.total_prs, icon: icons.pull_request, hidden: hiddenItemsArray.includes("prs") },
    { text: selectLocale.totalPRMergedText || defaultLocale.totalPRMergedText, value: data.total_prs_merged, icon: icons.pull_request_merged, hidden: hiddenItemsArray.includes("prs_merged") },
    { text: selectLocale.totalPRReviewedText || defaultLocale.totalPRReviewedText, value: data.total_review, icon: icons.review, hidden: !showItemsArray.includes("reviews") },
    { text: selectLocale.totalIssuesText || defaultLocale.totalIssuesText, value: data.total_issues, icon: icons.issue, hidden: hiddenItemsArray.includes("issues") },
    { text: selectLocale.totalIssuesClosedText || defaultLocale.totalIssuesClosedText, value: data.total_closed_issues, icon: icons.issue_closed, hidden: !showItemsArray.includes("issues_closed") },
    { text: selectLocale.totalDiscussionStartedText || defaultLocale.totalDiscussionStartedText, value: data.total_discussion_started, icon: icons.discussion_started, hidden: !showItemsArray.includes("discussions_started") },
    { text: selectLocale.totalDiscussionAnsweredText || defaultLocale.totalDiscussionAnsweredText, value: data.total_discussion_answered, icon: icons.discussion_answered, hidden: !showItemsArray.includes("discussions_answered") },
    { text: selectLocale.contributedToText || defaultLocale.contributedToText, value: data.total_contributed_to, icon: icons.contributed_to, hidden: hiddenItemsArray.includes("contributed") },
  ];

  // Filtering items based on hiddenItemsArray and showItemsArray
  const cardItemsToShow = cardItems.filter(item => !item.hidden);

  // Generating SVG code for each visible card item
  const cardItemsSVG = cardItemsToShow.map((item, index) => `
            <g transform="translate(230, ${index * 25})">
                <g class="single-item-animation" style="animation-delay: ${210 + index * 100}ms" transform="translate(25, 0)">
                    <svg x="${iconXAngle}" y="0" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                        ${item.icon}
                    </svg>
                    <text class="text" x="${textXAngle}" y="12.5">${item.text}:</text>
                    <text class="text text-bold" x="${dataXAngle}" y="12.5">${item.value}</text>
                </g>
            </g>`).join("\n");

  /**
   * Generates a linear gradient SVG code based on an array of color stops.
   *
   * @param {string[]} colors Array of color codes for the gradient stops.
   * @returns {string} SVG code representing the linear gradient.
   */
  function generateGradient(colors: string[]): string {
    const gradientId = "gradient";
    const gradientAngle = colors[0];
    const getColors = colors.slice(1);
    const gradientStops = getColors.map((color, index) => {
      const offset = (index * 100) / (getColors.length - 1);
      return `<stop offset="${offset}%" stop-color="#${color}"/>`;
    }).join("");
    return `
    <defs>
        <linearGradient id="${gradientId}" gradientTransform="rotate(${gradientAngle})" gradientUnits="userSpaceOnUse">
            ${gradientStops}
        </linearGradient>
    </defs>
    <rect x="0.5" y="0.5" rx="${uiConfig.borderRadius}" height="99.6%" width="99.8%" fill="url(#${gradientId})" ${hideBorder}/>
    `;
  }

  // Generating SVG code for the background based on background color or gradient
  let backgroundSVG;
  if (uiConfig.bgColor) {
    if (Array.isArray(uiConfig.bgColor)) {
      backgroundSVG = generateGradient(uiConfig.bgColor);
    } else if (typeof uiConfig.bgColor === 'string') {
      const gradientHexArray = uiConfig.bgColor.split(',');
      if (gradientHexArray.length >= 2) {
        const gradientColors = gradientHexArray.map(color => color.trim());
        backgroundSVG = generateGradient(gradientColors);
      } else {
        backgroundSVG = `<rect x="0.5" y="0.5" rx="${uiConfig.borderRadius}" height="99.6%" width="99.8%" fill="#${uiConfig.bgColor}" ${hideBorder}/>`;
      }
    }
  }

  // Final SVG code for the GitHub stats card
  return `<svg width="535" height="${Math.max(220, 45 + cardItemsToShow.length * 25)}"  direction="${direction}" viewBox="0 0 535 ${Math.max(220, 45 + cardItemsToShow.length * 25)}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <style>
        ${animations}

        .text {
            font-family: "Segoe UI", Ubuntu, sans-serif;
            fill: #${uiConfig.textColor};
            font-size: 14px;
        }

        .text-bold {
            font-weight: 700;
        }

        .text-middle {
            alignment-baseline: middle;
            text-anchor: middle;
        }

        .text-followers {
            font-family: "Segoe UI", Ubuntu, sans-serif;
            fill: #${uiConfig.textColor};
            font-size: 13px;
        }

        .text-username {
            font-family: "Segoe UI", Ubuntu, sans-serif;
            fill: #${uiConfig.usernameColor};
            font-weight: 750;
            font-size: 14.6px;
            alignment-baseline: middle;
            text-anchor: middle;
        }

        .text-title {
            font-family: "Segoe UI", Ubuntu, sans-serif;
            fill: #${uiConfig.titleColor};
            font-size: 17px;
            font-weight: 600;
        }

        .icon {
            fill: #${uiConfig.iconColor};
            display: block;
        }
    </style>
    <title id="titleId">${selectLocale.titleCard.split("{name}").join(data.name) || defaultLocale.titleCard.split("{name}").join(data.name)}</title>

    ${backgroundSVG}
    <g transform="translate(0, 25)">
        <g class="div-animation">
            <text x="${titleXAngle}" y="${titleYAngle}" class="text-title">${selectLocale.titleCard.split("{name}").join(data.name) || defaultLocale.titleCard.split("{name}").join(data.name)}</text>
        </g>
        <g class="image-profile-animation">
            <defs>
                <pattern id="image" x="0%" y="0%" height="100%" width="100%" viewBox="0 0 512 512">
                    <image x="0%" y="0%" width="512" height="512" href="data:image/jpeg;base64,${data.pic}"></image>
                </pattern>
            </defs>
            <circle cx="${imageXAngle}" cy="${imageYAngle}" r="50" fill="url(#image)" ${hideStroke}/>
        </g>
        <text x="${userXAngle}" y="${userYAngle}" direction="ltr" class="text-username div-animation">@${data.username}</text>
        <g class="div-animation text-middle">
            <text x="${follXAngle}" y="${follYAngle}" class="text-followers"><tspan class="text-bold">${data.followers}</tspan> ${selectLocale.followersText || defaultLocale.followersText} · <tspan class="text-bold">${data.following}</tspan> ${selectLocale.followingText || defaultLocale.followingText}</text>
        </g>

        <svg x="-10" y="12">
            ${cardItemsSVG}
        </svg>
    </g>
</svg>`;
}