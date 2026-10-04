(() => {
  // Pipeline steps: an ARIA tablist. Without JS every panel stays visible.
  const tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    const select = (index, { focus = false } = {}) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus({ preventScroll: true });

      // On phones the steps become a horizontal chip row; keep the active chip in view
      // without scrolling the page vertically.
      if (tablist.scrollWidth > tablist.clientWidth) {
        const tab = tabs[index];
        const left = tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2;
        tablist.scrollTo({ left, behavior: "smooth" });
      }
    };

    const syncOrientation = () => {
      const horizontal = window.matchMedia("(max-width: 640px)").matches;
      tablist.setAttribute("aria-orientation", horizontal ? "horizontal" : "vertical");
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", (event) => {
        const last = tabs.length - 1;
        const next = {
          ArrowDown: i === last ? 0 : i + 1,
          ArrowRight: i === last ? 0 : i + 1,
          ArrowUp: i === 0 ? last : i - 1,
          ArrowLeft: i === 0 ? last : i - 1,
          Home: 0,
          End: last,
        }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select(next, { focus: true });
      });
    });

    syncOrientation();
    window.matchMedia("(max-width: 640px)").addEventListener("change", syncOrientation);
    tabs.forEach((tab, i) => {
      tab.tabIndex = i === 0 ? 0 : -1;
      panels[i].hidden = i !== 0;
    });
  }

  // Promo film: a quiet cover button first, native controls once it plays.
  const frame = document.querySelector(".film-frame");
  if (frame) {
    const video = frame.querySelector("video");
    const cover = frame.querySelector(".film-play");
    video.controls = false;
    cover.addEventListener("click", () => {
      video.controls = true;
      video.play().catch(() => {
        cover.hidden = false;
      });
    });
    video.addEventListener("play", () => {
      cover.hidden = true;
      video.controls = true;
    });
    video.addEventListener("ended", () => {
      video.controls = false;
      cover.hidden = false;
    });
  }

  // Relationship graph: hover (mouse), tap (touch) or focus (keyboard) a person to trace their links.
  const graph = document.querySelector(".graph");
  if (graph) {
    const nodes = [...graph.querySelectorAll(".node")];
    const linked = [...graph.querySelectorAll("[data-a]")];
    let pointerType = "mouse";

    const focusOn = (id) => {
      if (!id) {
        delete graph.dataset.focus;
        graph.querySelectorAll(".is-on").forEach((el) => el.classList.remove("is-on"));
        return;
      }
      graph.dataset.focus = id;
      const related = new Set([id]);
      linked.forEach((el) => {
        const on = el.dataset.a === id || el.dataset.b === id;
        el.classList.toggle("is-on", on);
        if (on) {
          related.add(el.dataset.a);
          related.add(el.dataset.b);
        }
      });
      nodes.forEach((node) => node.classList.toggle("is-on", related.has(node.dataset.id)));
    };

    graph.addEventListener("pointerdown", (event) => {
      pointerType = event.pointerType;
    });
    graph.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") focusOn(null);
    });

    nodes.forEach((node) => {
      const id = node.dataset.id;
      node.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") focusOn(id);
      });
      node.addEventListener("click", () => {
        if (pointerType !== "mouse") focusOn(graph.dataset.focus === id ? null : id);
      });
      node.addEventListener("focus", () => focusOn(id));
      node.addEventListener("blur", () => focusOn(null));
    });

    document.addEventListener("click", (event) => {
      if (!graph.contains(event.target)) focusOn(null);
    });
  }
})();
