window.TYNWARE_SITE = {
  tinyRentalCheckoutUrl: "",
  tinyRentalDownloadUrl: "",
  offerDeskCheckoutUrl: "",
  offerDeskDownloadUrl: "",
  supportEmail: "support@tynware.com"
};

function wireLink(selector, url, fallbackLabel) {
  document.querySelectorAll(selector).forEach((el) => {
    if (url) {
      el.href = url;
      el.classList.remove("disabled");
      el.removeAttribute("aria-disabled");
    } else {
      el.href = "#";
      el.classList.add("disabled");
      el.setAttribute("aria-disabled", "true");
      if (fallbackLabel) el.textContent = fallbackLabel;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireLink("[data-checkout]", window.TYNWARE_SITE.tinyRentalCheckoutUrl, "Checkout coming soon");
  wireLink("[data-download]", window.TYNWARE_SITE.tinyRentalDownloadUrl, "Download coming soon");
  wireLink("[data-offerdesk-checkout]", window.TYNWARE_SITE.offerDeskCheckoutUrl, "Checkout coming soon");
  wireLink("[data-offerdesk-download]", window.TYNWARE_SITE.offerDeskDownloadUrl, "Download coming soon");

  document.querySelectorAll("[data-support-email]").forEach((el) => {
    el.textContent = window.TYNWARE_SITE.supportEmail;
    el.href = `mailto:${window.TYNWARE_SITE.supportEmail}`;
  });
});


// Screenshot lightbox
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  if (!lightbox || !lightboxImage) return;

  const closeButton = lightbox.querySelector(".lightbox-close");

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
  };

  document.querySelectorAll("[data-lightbox-src]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      lightboxImage.src = link.dataset.lightboxSrc || link.href;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      closeButton?.focus();
    });
  });

  closeButton?.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
});
