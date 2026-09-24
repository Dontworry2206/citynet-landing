"use client";

import { motion } from "motion/react";
import ClickSpark from "./reactbits/ClickSpark";
import GlareHover from "./reactbits/GlareHover";
import Magnet from "./reactbits/Magnet";
import StarBorder from "./reactbits/StarBorder";

/**
 * Primary (gradient) button: glare sweep on hover, sparks on click and,
 * optionally, a magnetic pull toward the cursor. Components: React Bits.
 */
export function PrimaryButton({
  as = "button",
  children,
  className = "",
  wrapperClassName = "",
  block = false,
  magnet = false,
  sparkColor = "#22B8FF",
  ...rest
}) {
  const M = motion[as];
  const button = (
    <M className={`btn btn--primary ${className}`} whileTap={{ scale: 0.97 }} {...rest}>
      {children}
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
      glareOpacity={0.4}
      glareAngle={-30}
      glareSize={260}
      transitionDuration={800}
      style={{ display: block ? "grid" : "inline-grid" }}
    >
      {button}
    </GlareHover>
  );

  const sparks = (
    <ClickSpark
      className={`rb-spark ${block ? "rb-spark--block" : ""} ${wrapperClassName}`}
      sparkColor={sparkColor}
      sparkSize={11}
      sparkRadius={22}
      sparkCount={10}
      duration={500}
    >
      {glare}
    </ClickSpark>
  );

  if (!magnet) return sparks;
  return (
    <Magnet padding={70} magnetStrength={3} wrapperClassName="rb-magnet">
      {sparks}
    </Magnet>
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
