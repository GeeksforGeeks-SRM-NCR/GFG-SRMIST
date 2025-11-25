import { Roboto_Mono, Space_Mono } from "next/font/google";
import "styles/globals.css";
import { Layout } from "../components";
import '../styles/Home/ScrambledText.module.css';
import SplashCursor from '../components/Elements/SplashCursor'


const Roboto = Roboto_Mono({ subsets: ["latin"] });

const Space = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export default function App({ Component }) {
  return (
    <>
      <Layout>
        <SplashCursor />
        <Component />
      </Layout>

      {/* Added Optimized Fonts */}
      <style jsx global>{`
        h1,
        h2,
        h3,
        h4,
        h5 {
          font-family: ${Space.style.fontFamily};
        }

        p,
        q,
        li,
        button {
          font-family: ${Roboto.style.fontFamily};
          word-spacing: 0.2rem;
        }
          
          
      `}</style>
    </>
  );
}
