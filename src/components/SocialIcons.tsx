import {
  FaLinkedinIn,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social");
    if (!social) return;

    const disposers: Array<() => void> = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement | null;
      if (!link) return;

      let rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;
      let rafId = 0;
      let lastX = -1;
      let lastY = -1;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        // Skip style writes when we've effectively settled to avoid layout thrash.
        if (Math.abs(currentX - lastX) > 0.1 || Math.abs(currentY - lastY) > 0.1) {
          link.style.setProperty("--siLeft", `${currentX}px`);
          link.style.setProperty("--siTop", `${currentY}px`);
          lastX = currentX;
          lastY = currentY;
        }
        rafId = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      const onResize = () => {
        rect = elem.getBoundingClientRect();
      };

      elem.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", onResize);
      rafId = requestAnimationFrame(updatePosition);

      disposers.push(() => {
        cancelAnimationFrame(rafId);
        elem.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
      });
    });

    return () => {
      disposers.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://www.linkedin.com/in/prasanna-kumar-750990181/" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="mailto:kprasanna713@gmail.com" target="_blank">
            <MdEmail />
          </a>
        </span>
      </div>
      <a className="resume-button" href="#">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
