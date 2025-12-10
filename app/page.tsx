import { GridScan } from './components/GridScan';
import { Logo2 } from "./logo/logo2";
import FuzzyText from "./components/FuzzyText";
import GlassyNavbar from "./components/GlassyNavbar";
import LogoLoop from './components/LogoLoop';
import { SiInstagram, SiGithub, SiLinkedin, SiDiscord, SiX } from 'react-icons/si';

import DecryptedText from './components/DecryptedText';


export default function Home() {
  const socialLogos = [
    { node: <SiInstagram color="#ffffff" />, title: "Instagram", href: "https://www.instagram.com/gfg_srmist_ncr" },
    { node: <SiGithub color="#ffffff" />, title: "GitHub", href: "https://github.com/GEEKSFORGEEKS-SRMIST-NCR" },
    { node: <SiLinkedin color="#ffffff" />, title: "LinkedIn", href: "https://www.linkedin.com/company/gfgsrmist/" },
    { node: <SiDiscord color="#ffffff" />, title: "Discord", href: "https://discord.gg/58uwPkFjJJ" },
    { node: <SiX color="#ffffff" />, title: "Instagram", href: "https://x.com/gfg_srmist_ncr?s=11" },
    { node: <SiInstagram color="#ffffff" />, title: "Instagram", href: "https://www.instagram.com/gfg_srmist_ncr" },
    { node: <SiGithub color="#ffffff" />, title: "GitHub", href: "https://github.com/GEEKSFORGEEKS-SRMIST-NCR" },
    { node: <SiLinkedin color="#ffffff" />, title: "LinkedIn", href: "https://www.linkedin.com/company/gfgsrmist/" },
    { node: <SiDiscord color="#ffffff" />, title: "Discord", href: "https://discord.gg/58uwPkFjJJ" },
    { node: <SiX color="#ffffff" />, title: "Instagram", href: "https://x.com/gfg_srmist_ncr?s=11" },

  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Glassy Navbar */}
      <GlassyNavbar />

      {/* GridScan Background */}
      <GridScan
        className="w-full h-full absolute top-0 left-0"
        style={{}}
        sensitivity={0.55}
        lineThickness={1}
        linesColor="#ffffff"
        gridScale={0.1}
        scanColor="#157415"
        scanOpacity={0.4}
        enablePost
        bloomIntensity={0.6}
        chromaticAberration={0.000}
        noiseIntensity={0.01}
      />

      {/* Center Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-10 w-full px-4">
        {/* GeeksForGeeks Logo - positioned higher */}
        <div className="w-full max-w-[700px] flex justify-center items-center -mt-20 sm:-mt-24">
          <Logo2 />
        </div>

        {/* SRMIST Text - below the logo */}
        <div className="flex justify-center items-center text-center">
          <FuzzyText
            fontSize="clamp(1.5rem, 5vw, 3rem)"
            baseIntensity={0.1}
            hoverIntensity={0.2}
            enableHover={true}
            color="#ffffff"
          >
            Campus Body
            SRMIST Delhi NCR
          </FuzzyText>

        </div>
      </div>

      {/* Social Media Logo Loop - Bottom */}
      <div className="absolute bottom-[60px] left-0 w-full z-20">
        <LogoLoop
          logos={socialLogos}
          speed={50}
          direction="left"
          logoHeight={32}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut={true}
          fadeOutColor="rgba(0,0,0,0)"
          ariaLabel="Social Media Links"
        />
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-[10px] w-full text-center z-20 text-white/60 text-xs px-4">
        <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
      </div>
    </div>
  );
}
