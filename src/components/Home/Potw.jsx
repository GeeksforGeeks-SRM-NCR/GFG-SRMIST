import React from "react";
import styles from "styles/Home/Potw.module.css";
import { PotwCard } from "./Card";
import TiltedCard from '../Elements/TiltedCard';
import { useEffect, useState } from "react";
import { getPotwData } from "../../utils/contentful";
import Squares from '../Elements/Squares';
import ScrambledText from '../Elements/ScrambleText';

const Potw = () => {
  const [potwData, setPotwData] = useState({
    name: "",
    position: "",
    img: "",
  });

  useEffect(() => {
    getPotwData().then(setPotwData);
  }, []);

  return (
    <section
      id="Potw"
      className={`${styles.potwSection} relative overflow-hidden`}
    >
      {/* Title - Outside the grid animation */}
      <div className="relative z-20 pt-8">
       
            <ScrambledText
        className="section-title"
        radius={100}
        duration={1.2}
        speed={0.5}
        scrambleChars=".:"
      >
       Performer of the Week
      </ScrambledText>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction='diagonal' // up, down, left, right, diagonal
          borderColor='#fff'
          hoverFillColor='#222'
        />
      </div>

      {/* Centered Card Content */}
      <div className={`relative z-10 ${styles.contentWrapper}`}>
        <div className={styles.container}>
          <div className={styles.cardWrapper}>
            <div className={styles.cardBorder}>
              <TiltedCard
                imageSrc={potwData.img}
                altText={potwData.name}
                captionText={`${potwData.name} (${potwData.position})`}
                containerHeight="300px"
                containerWidth="100%"
                imageHeight="300px"
                imageWidth="300px"
                scaleOnHover={1.1}
                rotateAmplitude={14}
                showMobileWarning={true}
                showTooltip={true}
                overlayContent={null}
                displayOverlayContent={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Potw;
