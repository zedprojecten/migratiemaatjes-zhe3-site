/**
 * Trigger de balloons-js animatie en garandeer dat de container zichtbaar
 * rendert.
 *
 * Bron: webdesign-by-kick door Kick van Zurlohe — trigger-balloons.ts.
 *
 * De library append't z'n root-element aan `<html>`. In sommige desktop
 * configuraties komt het op die plek niet zichtbaar uit door full-viewport
 * fixed-position overlays. Defensieve patch: na aanroep verplaatsen we het
 * element naar `<body>` en forceren een hoge z-index.
 */
import { balloons } from "balloons-js";

export function triggerBalloons(): void {
  balloons();
  requestAnimationFrame(() => {
    const container = document.querySelector("balloons");
    if (!container) return;
    if (container.parentElement === document.documentElement) {
      document.body.appendChild(container);
    }
    (container as HTMLElement).style.zIndex = "99999";
  });
}
