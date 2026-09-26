"use client";

import { motion, useReducedMotion } from "motion/react";
import ClickSpark from "./reactbits/ClickSpark";
import GlareHover from "./reactbits/GlareHover";
import StarBorder from "./reactbits/StarBorder";

const PRESS = { type: "spring", stiffness: 500, damping: 30 };

function Arrow() {
  return (
    <svg className="btn__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Primary (gradient) button. Hover: lifts, the glare sweeps once, the arrow
 * nudges forward. Press: springs down. Click: a small burst of sparks.
 * Glare and sparks come from React Bits.
 */
export function PrimaryButton({
  as = "button",
  children,
  className = "",
  wrapperClassName = "",
  block = false,
  arrow = false,
  sparkColor = "#22B8FF",
  ...rest
}) {
  const reduced = useReducedMotion();
  const M = motion[as];

  const button = (
    <M
      className={`btn btn--primary ${className}`}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={PRESS}
      {...rest}
    >
      <span className="btn__label">{children}</span>
      {arrow && <Arrow />}
    </M>
  );

  const glare = (
    <GlareHover
      width={block ? "100%" : "auto"}
      height="auto"
      background="transparent"
      borderColor="transparent"
      borderRadius="999px"
      glareColor="#ffffff"
      glareOpacity={0.3}
      glareAngle={-25}
      glareSize={230}
      transitionDuration={900}
      style={{ display: block ? "grid" : "inline-grid" }}
    >
      {button}
    </GlareHover>
  );

  return (
    <ClickSpark
      className={`rb-spark ${block ? "rb-spark--block" : ""} ${wrapperClassName}`}
      sparkColor={sparkColor}
      sparkSize={9}
      sparkRadius={24}
      sparkCount={8}
      duration={450}
    >
      {glare}
    </ClickSpark>
  );
}

/** Secondary button: a light travelling along the outline. Component: React Bits StarBorder. */
export function GhostButton({ as = "button", children, className = "", block = false, ...rest }) {
  return (
    <StarBorder
      as={as}
      className={`rb-star ${block ? "rb-star--block" : ""} ${className}`}
      color="var(--star)"
      speed="5s"
      thickness={1}
      backgroundColor="var(--surface)"
      textColor="var(--text)"
      borderColor="var(--border)"
      {...rest}
    >
      {children}
    </StarBorder>
  );
}
