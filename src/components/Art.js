import React, { useLayoutEffect } from "react";
import gsap from "gsap";
import classes from "../style/art.module.css";

//vertical loop adapted from https://codepen.io/GreenSock/pen/ExGJZXg?editors=1010

function Art() {
  useLayoutEffect(() => {
    const words = document.getElementsByName("art")
    const tl = verticalLoop(words, 100);
    return () => {
      if (tl && tl.kill) {
        tl.kill();
      }
    };
  }, []);

  function verticalLoop(elements, speed) {
    elements = gsap.utils.toArray(elements);
  
    if (elements.length === 0) {
      console.error("No elements found for animation");
      return null;
    }
  
    let firstBounds = elements[0].getBoundingClientRect(),
      lastBounds = elements[elements.length - 1].getBoundingClientRect(),
      inverted = firstBounds.top > lastBounds.top,
      topBounds = inverted ? lastBounds : firstBounds,
      bottomBounds = inverted ? firstBounds : lastBounds,
      top = topBounds.top - topBounds.height - Math.abs(elements[inverted ? elements.length - 2 : 1].getBoundingClientRect().top - topBounds.bottom),
      bottom = bottomBounds.top,
      distance = bottom - top,
      duration = Math.abs(distance / speed),
      tl = gsap.timeline({ repeat: -1 }),
      plus, minus;
  
    if (inverted) {
      speed = -speed;
      bottom += Math.abs(elements[inverted ? elements.length - 2 : 1].getBoundingClientRect().top - topBounds.top);
    }
    plus = speed < 0 ? "-=" : "+=";
    minus = speed < 0 ? "+=" : "-=";
  
    elements.forEach((el, i) => {
      // Add error checking here to ensure `el` is defined
      if (!el) {
        console.error(`Element at index ${i} is undefined`);
        return;
      }
  
      let bounds = el.getBoundingClientRect(),
        ratio = Math.abs((bottom - bounds.top) / distance);
  
      if ((speed < 0) !== inverted) {
        ratio = 1 - ratio;
      }
      tl.to(el, {
        y: plus + distance * ratio,
        duration: duration * ratio,
        ease: "none"
      }, 0);
      tl.fromTo(el, {
        y: minus + distance
      }, {
        y: plus + (1 - ratio) * distance,
        ease: "none",
        duration: (1 - ratio) * duration,
        immediateRender: false
      }, duration * ratio);
    });
  
    return tl;
  }
  

  return (
    <div className={classes.textContainer}>
      <div className={classes.textRow}>
        <div name="art" className={`${classes.textItem} ${classes.goldfish}`}>ART</div>
        <div name="art" className={`${classes.textItem} ${classes.kiss}`}>SCULPTURE</div>
        <div name="art" className={`${classes.textItem} ${classes.vangogh}`}>PAITING</div>
        <div name="art" className={`${classes.textItem} ${classes.pearlearing}`}>COSTUMES</div>
        <div name="art" className={`${classes.textItem} ${classes.picasso}`}>PHOTOGRAPHY</div>
        <div name="art" className={`${classes.textItem} ${classes.venus}`}>ANTIQUES</div>
        <div name="art" className={`${classes.textItem} ${classes.star}`}>CONTEMPORARY</div>
      </div>
    </div>
  );
}

export default Art;
