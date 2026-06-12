// Replace with your inbox — FormSubmit sends a one-time confirmation link on first use.
const CONTACT_EMAIL = "yatharthlegend252@gmail.com";
const LOADER_DURATION = 2600;

document.body.classList.add("loading");

const loader = document.querySelector(".loader");
const entranceElements = [...document.querySelectorAll(".entrance")];

requestAnimationFrame(() => {
    requestAnimationFrame(() => loader.classList.add("is-animating"));
});

entranceElements.forEach((element) => {
    element.style.setProperty("--entrance-delay", `${element.dataset.entranceDelay || 0}ms`);
});

const startPageEntrance = () => {
    loader.classList.add("is-exiting");
    document.body.classList.remove("loading");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            entranceElements.forEach((element) => element.classList.add("is-entered"));
        });
    });

    setTimeout(() => {
        introReady = true;
        document.body.classList.add("is-interactive");
    }, 1800);

    setTimeout(() => loader.classList.add("is-done"), 950);
};

setTimeout(() => {
    startPageEntrance();

    if (window.location.hash) {
        setTimeout(() => {
            document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" });
        }, 400);
    }
}, LOADER_DURATION);

const reveals = [...document.querySelectorAll(".reveal")];

reveals.forEach((element, index) => {
    const fromAbove = index % 2 === 1;
    element.classList.add(fromAbove ? "reveal--from-above" : "reveal--from-below");
    element.style.setProperty("--reveal-delay", `${(index % 3) * 110}ms`);
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });

reveals.forEach((element) => revealObserver.observe(element));

const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
const smoothPointer = { x: pointer.x, y: pointer.y };
const cursor = document.querySelector(".cursor");
const floatTargets = [...document.querySelectorAll(".float-target")];
const parallaxCopy = document.querySelector(".parallax-copy");
let introReady = false;

window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
});

const animatePointer = () => {
    smoothPointer.x += (pointer.x - smoothPointer.x) * 0.09;
    smoothPointer.y += (pointer.y - smoothPointer.y) * 0.09;

    cursor.style.transform = `translate(${smoothPointer.x}px, ${smoothPointer.y}px) translate(-50%, -50%)`;

    if (introReady) {
        const viewportX = smoothPointer.x / innerWidth - 0.5;
        const viewportY = smoothPointer.y / innerHeight - 0.5;
        parallaxCopy.style.transform = `translate3d(${viewportX * -20}px, ${viewportY * -12}px, 0)`;
    }

    floatTargets.forEach((target) => {
        if (!introReady) return;
        if (target.classList.contains("entrance") && !target.classList.contains("is-entered")) return;

        const rect = target.getBoundingClientRect();
        const nearViewport = rect.bottom > -100 && rect.top < innerHeight + 100;
        if (!nearViewport) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const localX = Math.max(-1, Math.min(1, (smoothPointer.x - centerX) / innerWidth));
        const localY = Math.max(-1, Math.min(1, (smoothPointer.y - centerY) / innerHeight));
        const strength = Number(target.dataset.strength || .4);
        const base = target.classList.contains("hero__visual") ? "translate(-50%, -50%) " : "";
        target.style.transform = `${base}translate3d(${localX * 55 * strength}px, ${localY * 40 * strength}px, 0)`;
    });

    requestAnimationFrame(animatePointer);
};

animatePointer();

document.querySelectorAll(".cursor-view").forEach((target) => {
    target.addEventListener("pointerenter", () => cursor.classList.add("is-view"));
    target.addEventListener("pointerleave", () => cursor.classList.remove("is-view"));
});

document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate3d(${x * .18}px, ${y * .18}px, 0)`;
    });
    element.addEventListener("pointerleave", () => {
        element.style.transform = "";
    });
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");

menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "Close" : "Menu";
});

nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "Menu";
    });
});

const updateTime = () => {
    document.querySelector(".live-time").textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(new Date());
};

updateTime();
setInterval(updateTime, 30000);
document.querySelector(".year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-project-stack]").forEach((stack) => {
    const project = stack.closest(".project");
    if (!project) return;

    project.addEventListener("mouseenter", () => stack.classList.add("is-spread"));
    project.addEventListener("mouseleave", () => stack.classList.remove("is-spread"));
});

const marqueeTrack = document.querySelector(".marquee__track");
if (marqueeTrack) {
    const marquee = marqueeTrack.closest(".marquee");
    marquee?.addEventListener("mouseenter", () => {
        marqueeTrack.style.animationPlayState = "paused";
    });
    marquee?.addEventListener("mouseleave", () => {
        marqueeTrack.style.animationPlayState = "running";
    });
}

const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");

if (contactForm) contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    const submitButton = contactForm.querySelector(".contact__submit");

    contactStatus.className = "contact__status";
    contactStatus.textContent = "";

    if (!name || !email || !message) {
        contactStatus.classList.add("is-error");
        contactStatus.textContent = "Please fill in every field.";
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                message,
                _subject: `Portfolio message from ${name}`,
                _template: "table",
                _captcha: "false"
            })
        });

        if (!response.ok) {
            throw new Error("Request failed");
        }

        contactForm.reset();
        contactStatus.classList.add("is-success");
        contactStatus.textContent = "Message sent — I'll get back to you soon.";
    } catch {
        contactStatus.classList.add("is-error");
        contactStatus.textContent = "Something went wrong. Try again or reach out on GitHub.";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send message +";
    }
});