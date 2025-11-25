import React from "react";
import styles from "styles/Home/Potw.module.css";
import { PotwCard } from "./Card";
import { SparklesCore } from "../ui/sparkles";
import { useEffect, useState } from "react";
import { getPotwData } from "../../utils/contentful";
import Squares from '../Elements/Squares';


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
      {/* Sparkles Background */}
      <div className="absolute inset-0 w-full h-full">
      <Squares 
speed={0.5} 
squareSize={40}
direction='diagonal' // up, down, left, right, diagonal
borderColor='#fff'
hoverFillColor='#222'
/>

      </div>
    
 

      {/* Content */}
      <div className={`relative z-10 ${styles.contentWrapper}`}>
        <h2 className="section-title text-white">Performer of the Week</h2>
        <div className={styles.container}>
          <div className={styles.cardWrapper}>
            <div className={styles.cardBorder}>
              <PotwCard  data={potwData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Potw;
