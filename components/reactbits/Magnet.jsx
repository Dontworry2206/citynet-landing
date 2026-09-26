"use client";

// From React Bits (https://github.com/DavidHDev/react-bits), MIT + Commons Clause.
// Locally adapted: same props, but driven by motion springs instead of
// setState + CSS transitions, so it follows the cursor smoothly without
// re-rendering on every mouse move.
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const SPRING = { stiffness: 170, damping: 17, mass: 0.6 };

const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  useEffect(() => {
    if (disabled) {
      x.set(0);
      y.set(0);
      return;
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;

      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      if (
        Math.abs(centerX - e.clientX) < width / 2 + padding &&
        Math.abs(centerY - e.clientY) < height / 2 + padding
      ) {
        x.set((e.clientX - centerX) / magnetStrength);
        y.set((e.clientY - centerY) / magnetStrength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const onLeaveWindow = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, [padding, disabled, magnetStrength, x, y]);

  return (
    <div ref={ref} className={wrapperClassName} style={{ position: "relative", display: "inline-block" }} {...props}>
      <motion.div className={innerClassName} style={{ x, y, willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
};

export default Magnet;
