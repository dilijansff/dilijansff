const parityStylesheetId = "menu-parity-styles";

if (!document.getElementById(parityStylesheetId)) {
  const stylesheet = document.createElement("link");
  stylesheet.id = parityStylesheetId;
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("../css/menu-parity.css", import.meta.url).href;
  document.head.append(stylesheet);
}

const drawerIcons = [
  {
    href: "https://t.me/Dilijans_FF",
    label: "Написать в Telegram",
    external: true,
    artwork: `
      <circle cx="16" cy="16" r="16" fill="#fff"/>
      <path fill="#5e5c44" d="M7.1 15.6 24.3 9c.8-.3 1.5.4 1.3 1.2l-2.9 13.6c-.2.9-1.3 1.2-2 .7l-4.4-3.3-2.2 2.2c-.4.4-1.1.1-1-.5l.5-4.2 8.8-7.1-10.7 6.2-4.5-1.4c-.5-.1-.6-.6-.1-.8Z"/>
    `,
  },
  {
    href: "https://wa.me/79857757373",
    label: "Написать в WhatsApp",
    external: true,
    artwork: `
      <circle cx="16" cy="16" r="16" fill="#fff"/>
      <path d="M22.2 9.7a8.7 8.7 0 0 0-13.7 10.4L7.3 25l5-1.3a8.7 8.7 0 0 0 9.9-14Z" fill="none" stroke="#5e5c44" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.3 11.6c.4-.3.8-.2 1 .3l1 2.2c.2.4.1.7-.2 1l-.7.7c1 2.1 2.7 3.6 4.8 4.4l.7-.8c.3-.3.6-.4 1-.2l2.1 1c.4.2.6.6.4 1-.5 1.2-1.6 1.8-2.9 1.6-4.7-.8-8.7-4.6-9.7-9.3-.3-1.2.3-2.4 1.5-2.9.3-.1.7-.1 1 .1Z" fill="#5e5c44"/>
    `,
  },
  {
    href: "tel:+79268560549",
    label: "Позвонить",
    artwork: `
      <circle cx="16" cy="16" r="16" fill="#fff"/>
      <path d="M10.3 8.7c.6-.4 1.4-.2 1.8.4l2.2 3.5c.4.6.3 1.3-.2 1.8l-1.4 1.3a17.2 17.2 0 0 0 4.2 4.2l1.3-1.4c.5-.5 1.2-.6 1.8-.2l3.5 2.2c.6.4.8 1.2.4 1.8l-1 1.5c-.7 1.1-2 1.6-3.3 1.2-5.8-1.8-10.4-6.4-12.2-12.2-.4-1.3.1-2.6 1.2-3.3l1.7-1Z" fill="#5e5c44"/>
      <path d="M17.8 8.4c3.1.6 5.5 3 6.1 6.1M17.7 12.1c1.2.3 2.2 1.2 2.5 2.5" fill="none" stroke="#5e5c44" stroke-width="1.8" stroke-linecap="round"/>
    `,
  },
  {
    href: "mailto:DilijansFF@mail.ru",
    label: "Написать на электронную почту",
    artwork: `
      <circle cx="16" cy="16" r="16" fill="#fff"/>
      <rect x="7.5" y="10.5" width="17" height="12" rx="2" fill="#5e5c44"/>
      <path d="m9.1 12.2 6.1 4.7c.5.4 1.2.4 1.7 0l6-4.7" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  },
];

document.querySelectorAll(".site-nav__drawer-socials").forEach((wrapper) => {
  const links = drawerIcons.map(({ href, label, external, artwork }) => {
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("aria-label", label);
    if (external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.innerHTML = `<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">${artwork}</svg>`;
    return link;
  });

  wrapper.replaceChildren(...links);
});

const drawerSectionLinks = [...document.querySelectorAll(".site-nav__link")]
  .map((link) => {
    const hash = new URL(link.href, window.location.href).hash;
    const section = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    return section ? { link, section } : null;
  })
  .filter(Boolean);

const updateActiveDrawerLink = () => {
  if (!drawerSectionLinks.length) return;

  const marker = Math.min(window.innerHeight * 0.35, 320);
  let active = drawerSectionLinks[0];

  for (const entry of drawerSectionLinks) {
    if (entry.section.getBoundingClientRect().top <= marker) active = entry;
  }

  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 2
  ) {
    active = drawerSectionLinks.at(-1);
  }

  for (const entry of drawerSectionLinks) {
    const isActive = entry === active;
    entry.link.toggleAttribute("data-drawer-active", isActive);
    if (isActive) entry.link.setAttribute("aria-current", "location");
    else entry.link.removeAttribute("aria-current");
  }
};

let activeLinkFrame = 0;
const scheduleActiveDrawerLinkUpdate = () => {
  if (activeLinkFrame) return;
  activeLinkFrame = window.requestAnimationFrame(() => {
    activeLinkFrame = 0;
    updateActiveDrawerLink();
  });
};

window.addEventListener("scroll", scheduleActiveDrawerLinkUpdate, { passive: true });
window.addEventListener("resize", scheduleActiveDrawerLinkUpdate, { passive: true });
window.addEventListener("hashchange", scheduleActiveDrawerLinkUpdate);
document
  .querySelectorAll("[data-menu-toggle]")
  .forEach((toggle) => toggle.addEventListener("click", updateActiveDrawerLink));
updateActiveDrawerLink();
