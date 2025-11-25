import { FaqApi } from "api/FaqAPI";
import { useState } from "react";
import styles from "styles/Home/Faq.module.css";
import ScrambledText from '../Elements/ScrambleText';

const Faq = () => {
  const [selected, setSelected] = useState(null);

  const toggle = (i) => {
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
  };

  return (
    <section className={styles.faq} id="faq">
      
            <ScrambledText
        className="section-title"
        radius={100}
        duration={1.2}
        speed={0.5}
        scrambleChars=".:"
      >
       Frequently Asked Questions
      </ScrambledText>

      {/* Accordion list */}
      <div className={styles.accordion}>
        {FaqApi.map((item, i) => (
          <div className={styles.item} key={i}>
            <div
              className={styles.title}
              onClick={() => toggle(i)}
              onKeyDown={() => toggle(i)}
              role="button"
              tabIndex="0"
            >
              <h4> {item.question} </h4>
              <span style={{ transition: "500ms" }}>
                {selected === i ? "-" : "+"}
              </span>
            </div>
            <div
              className={
                selected === i
                  ? `${styles.show + " " + styles.content}`
                  : styles.content
              }
            >
              <hr />
              {item.answer.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
