export const Element = (svgText: string): HTMLElement => {
  const parser = new DOMParser();
  return parser.parseFromString(svgText, 'text/xml').documentElement;
};

/**
 * Icon used in the side ribbon
 */
export const checkboxIcon = `
<svg fill="currentColor" stroke="currentColor" clip-rule="evenodd" version="1.1" viewBox="0 0 293 291" xmlns="http://www.w3.org/2000/svg">
 <path d="m266 146c0-7 6-13 13-13s12 6 12 13v90c0 30-25 55-55 55h-181c-30 0-55-25-55-55v-181c0-30 25-55 55-55h91c7 0 12 6 12 13s-5 12-12 12h-91c-16 0-30 14-30 30v181c0 16 14 30 30 30h181c16 0 30-14 30-30v-90z"/>
 <path d="m81 108c-5-5-5-13 0-18s13-5 18 0l47 46 125-125c5-5 13-5 18 0s5 13 0 18l-134 134c-5 5-13 5-18 0l-56-55z" stroke-width="1.0001"/>
</svg>`;

//
// Icons for use when rendering notes
// Sized to fit inline with actual checkbox inputs
//

/**
 * Sized so that this fits inline with actual checkbox inputs
 */
export const movedIconSvg = `
<svg class="todito-task-icon" width="67.866mm" height="50.848mm" version="1.1" viewBox="0 0 67.866 50.848" xmlns="http://www.w3.org/2000/svg">
 <g fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path transform="scale(.26458)" d="m165.26 45.489v-19.196c0-9.7004-7.8093-17.51-17.51-17.51h-122.18c-9.7004 0-17.51 7.8093-17.51 17.51v139.45c0 9.7004 7.8093 17.51 17.51 17.51h122.18c9.7004 0 17.51-7.8093 17.51-17.51v-17.186" stroke-miterlimit="31.5" stroke-width="16"/>
  <path d="m54.542 15.083 11.35 10.512-11.274 10.131m-26.509-10.055 37.783-0.076176" stroke-width="4.2333"/>
 </g>
</svg>`;

/**
 * Sized so that this fits inline with actual checkbox inputs
 */
export const skippedIconSvg = `
<svg class="todito-task-icon" width="67.866mm" height="50.848mm" version="1.1" viewBox="0 0 67.866 50.848" xmlns="http://www.w3.org/2000/svg">
 <g fill="none" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2.1126" y="2.4062" width="41.592" height="46.163" ry="4.6328" stroke-miterlimit="31.5" stroke-width="4.2333"/>
  <path d="m13.818 25.488h18.182" stroke-width="3.9308"/>
 </g>
</svg>`;

//
// Icons for the TaskView header
// NOT sized to fit inline with actual checkbox inputs
//

export const repeatingIconSvg = `
<svg class="todito-task-view-filter-icon" version="1.1" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
 <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="10">
  <path d="m200 89.27 25.615-25.779c-18.835-0.040473-99.965 0.27915-133.71 0.55875-33.546 0.27796-58.838 25.762-60.413 65.22m168.51-90.032c7.4458 7.4108 16.33 15.28 25.615 24.253"/>
  <path d="m56.046 166.29-25.615 25.779c18.835 0.0405 99.965-0.27915 133.71-0.55875 33.546-0.27796 58.838-25.762 60.413-65.22m-168.51 90.032c-7.4458-7.4108-16.33-15.28-25.615-24.253"/>
 </g>
</svg>`;

export const nonRepeatingIconSvg = `
<svg class="todito-task-view-filter-icon" version="1.1" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
 <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="10">
  <path d="m56.046 166.29-25.615 25.779c18.835 0.0405 86.351-0.27915 120.1-0.55875m44.98-9.1723c19.188-10.02 27.939-28.299 29.047-56.048m-168.51 90.032c-7.4458-7.4108-16.33-15.28-25.615-24.253"/>
  <path d="m200 89.27 25.615-25.779c-18.835-0.04047-85.633 0.27915-119.38 0.55875m-45.699 9.1723c-19.188 10.02-27.939 28.299-29.047 56.048m168.51-90.032c7.4458 7.4108 16.33 15.28 25.615 24.253"/>
  <path d="m59.539 39.19 139.7 177.22"/>
 </g>
</svg>`;

export const cbUncheckedIconSvg = `
<svg class="todito-task-view-filter-icon" width="46.222" height="50.832" version="1.1" viewBox="0 0 46.222 50.832" xmlns="http://www.w3.org/2000/svg">
 <g transform="matrix(1.0087 0 0 1.0087 .0040851 -.29205)" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2.1126" y="2.4062" width="41.592" height="46.163" ry="4.6328" stroke-miterlimit="31.5" stroke-width="4.2333"/>
 </g>
</svg>`;

export const cbCheckedIconSvg = `
<svg class="todito-task-view-filter-icon" width="46.222" height="50.832" version="1.1" viewBox="0 0 46.222 50.832" xmlns="http://www.w3.org/2000/svg">
 <path d="m8.7903 27.379 8.2836 8.2349 20.358-20.396" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.1064"/>
 <g transform="matrix(1.0087 0 0 1.0087 .0040851 -.29205)" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2.1126" y="2.4062" width="41.592" height="46.163" ry="4.6328" stroke-miterlimit="31.5" stroke-width="4.2333"/>
 </g>
</svg>`;

export const moved2IconSvg = `
<svg class="todito-task-view-filter-icon" width="67.866mm" height="50.848mm" version="1.1" viewBox="0 0 67.866 50.848" xmlns="http://www.w3.org/2000/svg">
 <g fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path transform="scale(.26458)" d="m165.26 45.489v-19.196c0-9.7004-7.8093-17.51-17.51-17.51h-122.18c-9.7004 0-17.51 7.8093-17.51 17.51v139.45c0 9.7004 7.8093 17.51 17.51 17.51h122.18c9.7004 0 17.51-7.8093 17.51-17.51v-17.186" stroke-miterlimit="31.5" stroke-width="16"/>
  <path d="m54.542 15.083 11.35 10.512-11.274 10.131m-26.509-10.055 37.783-0.076176" stroke-width="4.2333"/>
 </g>
</svg>`;

export const dailyIconSvg = `
<svg class="todito-task-view-filter-icon" width="52px" height="52px" enable-background="new 0 0 52 52" version="1.1" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
 <g stroke="none">
  <path d="m46.5 20h-41c-0.8 0-1.5 0.7-1.5 1.5v24.5c0 2.2 1.8 4 4 4h36c2.2 0 4-1.8 4-4v-24.5c0-0.8-0.7-1.5-1.5-1.5zm-16.65 22.1c0 0.9-0.5 1.9-1.5 1.9-0.9 0-1.5-0.9-1.5-1.9v-10.3l-2.1 1.9c-0.3 0.3-0.7 0.4-1.1 0.4-0.8 0-1.5-0.6-1.5-1.5 0-0.4 0.1-0.7 0.4-1l3.8-3.8c0.4-0.4 0.9-0.7 1.5-0.7 1.1 0 2 1 2 2.1z"/>
  <path d="m44 7h-5v-2c0-1.6-1.3-3-3-3-1.6 0-3 1.3-3 3v2h-14v-2c0-1.6-1.3-3-3-3-1.6 0-3 1.3-3 3v2h-5c-2.2 0-4 1.8-4 4v2.5c0 0.8 0.7 1.5 1.5 1.5h41c0.8 0 1.5-0.7 1.5-1.5v-2.5c0-2.2-1.8-4-4-4z">
 </g>
</svg>`;

export const weeklyIconSvg = `
<svg class="todito-task-view-filter-icon" width="52px" height="52px" enable-background="new 0 0 52 52" version="1.1" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
 <g stroke="none">
  <path d="m44 7h-5v-2c0-1.6-1.3-3-3-3-1.6 0-3 1.3-3 3v2h-14v-2c0-1.6-1.3-3-3-3-1.6 0-3 1.3-3 3v2h-5c-2.2 0-4 1.8-4 4v2.5c0 0.8 0.7 1.5 1.5 1.5h41c0.8 0 1.5-0.7 1.5-1.5v-2.5c0-2.2-1.8-4-4-4z"/>
  <path d="m46.5 20h-41c-0.8 0-1.5 0.7-1.5 1.5v24.5c0 2.2 1.8 4 4 4h36c2.2 0 4-1.8 4-4v-24.5c0-0.8-0.7-1.5-1.5-1.5zm-13.7 9.5-6.3 13.4c-0.3 0.7-1 1.1-1.8 1.1-1.1 0-1.9-0.9-1.9-1.8 0-0.2 0.1-0.5 0.2-0.8l5.3-11.4h-7.6c-0.9 0-1.7-0.6-1.7-1.5 0-0.8 0.8-1.5 1.7-1.5h10.4c1 0 1.9 0.8 1.9 1.8 0 0.3-0.1 0.5-0.2 0.7z"/>
 </g>
</svg>
`;

export const monthlyIconSvg = `
<svg class="todito-task-view-filter-icon" width="52px" height="52px" enable-background="new 0 0 52 52" version="1.1" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
 <g stroke="none">
  <path d="m44 7h-5v-2c0-1.6-1.3-3-3-3-1.6 0-3 1.3-3 3v2h-14v-2c0-1.6-1.3-3-3-3-1.6 0-3 1.3-3 3v2h-5c-2.2 0-4 1.8-4 4v2.5c0 0.8 0.7 1.5 1.5 1.5h41c0.8 0 1.5-0.7 1.5-1.5v-2.5c0-2.2-1.8-4-4-4z"/>
  <path d="m46.5 20h-41c-0.8 0-1.5 0.7-1.5 1.5v24.5c0 2.2 1.8 4 4 4h36c2.2 0 4-1.8 4-4v-24.5c0-0.8-0.7-1.5-1.5-1.5zm-25.4 24c-2.4 0-5.1-0.9-5.9-2.2-0.1-0.2-0.2-0.4-0.2-0.7 0-0.9 0.8-1.6 1.6-1.6 0.3 0 0.6 0.1 0.9 0.2 1.1 0.6 2.4 1 3.5 1 2 0 3.1-0.9 3.1-2.1 0-1.3-1-1.9-3.3-1.9-1.3 0.2-2.2-0.4-2.2-1.6 0-0.9 0.6-1.5 1.6-1.5 2.1 0.1 3.6-0.4 3.6-1.8 0-1.3-1.3-1.9-3-1.9-1.1 0-2.2 0.3-3.2 0.9-0.2 0.2-0.5 0.2-0.8 0.2-0.8 0-1.5-0.6-1.5-1.5 0-0.4 0.2-0.8 0.5-1.1 1.3-1.1 3.1-1.8 5.4-1.8 3.8 0 6.2 1.7 6.2 4.5 0 2.1-1.8 3.4-3.6 3.8 1.7 0.2 3.8 1.5 3.8 3.9-0.1 3.2-2.6 5.2-6.5 5.2zm15.9-1.9c0 0.9-0.5 1.9-1.5 1.9-0.9 0-1.5-0.9-1.5-1.9v-10.3l-2.1 1.9c-0.3 0.3-0.7 0.4-1.1 0.4-0.8 0-1.5-0.6-1.5-1.5 0-0.4 0.1-0.7 0.4-1l3.8-3.8c0.4-0.4 0.9-0.7 1.5-0.7 1.1 0 2 1 2 2.1v12.9z"/>
 </g>
</svg>
`;
